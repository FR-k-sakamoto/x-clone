import { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import { PostBody } from "@/app/_domain/post/PostBody";
import { PostId } from "@/app/_domain/post/PostId";
import type { PostRepository } from "@/app/_domain/post/PostRepository";

export type EditPostResult =
  | { ok: true }
  | { ok: false; message: string };

export async function editPost(
  deps: { postRepo: PostRepository },
  input: { postId: string; editorId: string; body: string }
): Promise<EditPostResult> {
  let postId: PostId;
  let editorId: PostAuthorId;
  let body: PostBody;

  try {
    postId = PostId.fromString(input.postId);
    editorId = PostAuthorId.fromString(input.editorId);
    body = PostBody.fromString(input.body);
  } catch {
    return { ok: false, message: "投稿内容が不正です。" };
  }

  const post = await deps.postRepo.findById(postId);
  if (!post) return { ok: false, message: "投稿が見つかりません。" };

  try {
    post.editBody(body, editorId);
  } catch {
    return { ok: false, message: "投稿を編集する権限がありません。" };
  }

  const updated = await deps.postRepo.updateBody({ postId, body: post.getBody() });
  if (!updated) return { ok: false, message: "投稿の更新に失敗しました。" };

  return { ok: true };
}
