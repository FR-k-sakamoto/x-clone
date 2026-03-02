import { ReplyAuthorId } from "@/app/_domain/reply/ReplyAuthorId";
import { ReplyBody } from "@/app/_domain/reply/ReplyBody";
import { ReplyId } from "@/app/_domain/reply/ReplyId";
import type { ReplyRepository } from "@/app/_domain/reply/ReplyRepository";
import { ReplyParentPostId } from "@/app/_domain/reply/ReplyParentPostId";

export type CreateReplyResult =
  | { ok: true; replyId: string }
  | { ok: false; message: string };

export async function createReply(
  deps: { replyRepo: ReplyRepository },
  input: { authorId: string; parentPostId: string; body: string }
): Promise<CreateReplyResult> {
  let authorId: ReplyAuthorId;
  let parentPostId: ReplyParentPostId;
  let body: ReplyBody;

  try {
    authorId = ReplyAuthorId.fromString(input.authorId);
    parentPostId = ReplyParentPostId.fromString(input.parentPostId);
    body = ReplyBody.fromString(input.body);
  } catch {
    return { ok: false, message: "返信内容が不正です。" };
  }

  const parent = await deps.replyRepo.findPostById(
    ReplyId.fromString(parentPostId.toString())
  );
  if (!parent) {
    return { ok: false, message: "返信先の投稿が見つかりません。" };
  }

  const reply = await deps.replyRepo.create({ authorId, parentPostId, body });
  return { ok: true, replyId: reply.getId().toString() };
}
