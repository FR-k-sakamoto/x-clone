import { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import { PostId } from "@/app/_domain/post/PostId";
import type { PostRepository } from "@/app/_domain/post/PostRepository";

export type DeletePostResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deletePost(
  deps: { postRepo: PostRepository },
  input: { postId: string; requesterId: string }
): Promise<DeletePostResult> {
  let postId: PostId;
  let requesterId: PostAuthorId;

  try {
    postId = PostId.fromString(input.postId);
    requesterId = PostAuthorId.fromString(input.requesterId);
  } catch {
    return { ok: false, message: "投稿IDが不正です。" };
  }

  const post = await deps.postRepo.findById(postId);
  if (!post) return { ok: false, message: "投稿が見つかりません。" };
  if (!post.canBeDeletedBy(requesterId)) {
    return { ok: false, message: "投稿を削除する権限がありません。" };
  }

  await deps.postRepo.deleteById(postId);
  return { ok: true };
}
