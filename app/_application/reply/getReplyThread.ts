import { ReplyId } from "@/app/_domain/reply/ReplyId";
import { ReplyParentPostId } from "@/app/_domain/reply/ReplyParentPostId";
import type { ReplyRepository, ThreadPost } from "@/app/_domain/reply/ReplyRepository";
import type { ReplyThreadNode } from "@/app/_domain/reply/ReplyThread";

export type GetReplyThreadResult =
  | {
      ok: true;
      rootPost: ReplyThreadNode;
      replies: ReplyThreadNode[];
    }
  | { ok: false; message: string };

function toNode(post: ThreadPost, depth: number): ReplyThreadNode {
  return {
    postId: post.postId,
    parentId: post.parentId,
    authorId: post.authorId,
    authorHandle: post.authorHandle,
    body: post.body,
    createdAtIso: post.createdAt.toISOString(),
    depth,
  };
}

export async function getReplyThread(
  deps: { replyRepo: ReplyRepository },
  input: { rootPostId: string; maxDepth?: number; maxReplies?: number }
): Promise<GetReplyThreadResult> {
  let rootPostId: ReplyId;
  try {
    rootPostId = ReplyId.fromString(input.rootPostId);
  } catch {
    return { ok: false, message: "投稿IDが不正です。" };
  }

  const root = await deps.replyRepo.findPostById(rootPostId);
  if (!root) {
    return { ok: false, message: "投稿が見つかりません。" };
  }

  const maxDepth = Math.max(1, Math.min(input.maxDepth ?? 6, 20));
  const maxReplies = Math.max(1, Math.min(input.maxReplies ?? 200, 500));

  const replies: ReplyThreadNode[] = [];
  let frontier: Array<{ postId: string; depth: number }> = [{ postId: root.postId, depth: 1 }];

  while (frontier.length > 0 && replies.length < maxReplies) {
    const parentIds = frontier.map((item) => ReplyParentPostId.fromString(item.postId));
    const parentDepthById = new Map(frontier.map((item) => [item.postId, item.depth]));

    const children = await deps.replyRepo.listByParentIds(parentIds);
    const nextFrontier: Array<{ postId: string; depth: number }> = [];

    for (const child of children) {
      const parentDepth = parentDepthById.get(child.parentId ?? "");
      if (parentDepth === undefined) continue;
      if (parentDepth > maxDepth) continue;

      replies.push(toNode(child, parentDepth));
      if (replies.length >= maxReplies) break;

      const childDepth = parentDepth + 1;
      if (childDepth <= maxDepth) {
        nextFrontier.push({ postId: child.postId, depth: childDepth });
      }
    }

    frontier = nextFrontier;
  }

  return {
    ok: true,
    rootPost: toNode(root, 0),
    replies,
  };
}
