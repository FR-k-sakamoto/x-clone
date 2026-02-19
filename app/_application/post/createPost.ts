import { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import { PostBody } from "@/app/_domain/post/PostBody";
import type { PostRepository } from "@/app/_domain/post/PostRepository";

export type CreatePostResult =
  | { ok: true }
  | { ok: false; message: string };

export async function createPost(
  deps: { postRepo: PostRepository },
  input: { authorId: string; body: string }
): Promise<CreatePostResult> {
  let authorId: PostAuthorId;
  let body: PostBody;

  try {
    authorId = PostAuthorId.fromString(input.authorId);
    body = PostBody.fromString(input.body);
  } catch {
    return { ok: false, message: "投稿内容が不正です。" };
  }

  await deps.postRepo.create({ authorId, body });
  return { ok: true };
}
