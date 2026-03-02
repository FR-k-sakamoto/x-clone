import type { ReplyAuthorId } from "@/app/_domain/reply/ReplyAuthorId";
import type { ReplyBody } from "@/app/_domain/reply/ReplyBody";
import type { Reply } from "@/app/_domain/reply/Reply";
import type { ReplyId } from "@/app/_domain/reply/ReplyId";
import type { ReplyParentPostId } from "@/app/_domain/reply/ReplyParentPostId";

export type ThreadPost = {
  postId: string;
  parentId: string | null;
  authorId: string;
  authorHandle: string;
  body: string;
  createdAt: Date;
};

export interface ReplyRepository {
  create(params: {
    authorId: ReplyAuthorId;
    parentPostId: ReplyParentPostId;
    body: ReplyBody;
  }): Promise<Reply>;
  findPostById(postId: ReplyId): Promise<ThreadPost | null>;
  listByParentIds(parentIds: ReplyParentPostId[]): Promise<ThreadPost[]>;
}
