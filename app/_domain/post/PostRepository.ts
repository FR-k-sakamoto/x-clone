import type { Post } from "@/app/_domain/post/Post";
import type { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import type { PostBody } from "@/app/_domain/post/PostBody";
import type { PostId } from "@/app/_domain/post/PostId";

export interface PostRepository {
  create(params: { authorId: PostAuthorId; body: PostBody }): Promise<Post>;
  findById(id: PostId): Promise<Post | null>;
  listRecent(limit: number): Promise<Post[]>;
  updateBody(params: { postId: PostId; body: PostBody }): Promise<Post | null>;
  deleteById(postId: PostId): Promise<void>;
}
