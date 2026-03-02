import type { PrismaClient } from "@prisma/client";

import { Reply } from "@/app/_domain/reply/Reply";
import { ReplyAuthorId } from "@/app/_domain/reply/ReplyAuthorId";
import { ReplyBody } from "@/app/_domain/reply/ReplyBody";
import { ReplyId } from "@/app/_domain/reply/ReplyId";
import { ReplyParentPostId } from "@/app/_domain/reply/ReplyParentPostId";
import type { ReplyRepository, ThreadPost } from "@/app/_domain/reply/ReplyRepository";

function toThreadPost(row: {
  id: string;
  parentId: string | null;
  authorId: string;
  body: string;
  createdAt: Date;
  author: { handle: string };
}): ThreadPost {
  return {
    postId: row.id,
    parentId: row.parentId,
    authorId: row.authorId,
    authorHandle: row.author.handle,
    body: row.body,
    createdAt: row.createdAt,
  };
}

export class PrismaReplyRepository implements ReplyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: {
    authorId: ReplyAuthorId;
    parentPostId: ReplyParentPostId;
    body: ReplyBody;
  }): Promise<Reply> {
    const created = await this.prisma.post.create({
      data: {
        authorId: params.authorId.toString(),
        body: params.body.toString(),
        parentId: params.parentPostId.toString(),
      },
      select: {
        id: true,
        authorId: true,
        body: true,
        parentId: true,
        createdAt: true,
      },
    });

    return new Reply(
      ReplyId.fromString(created.id),
      ReplyAuthorId.fromString(created.authorId),
      ReplyParentPostId.fromString(created.parentId ?? params.parentPostId.toString()),
      ReplyBody.fromString(created.body),
      created.createdAt
    );
  }

  async findPostById(postId: ReplyId): Promise<ThreadPost | null> {
    const found = await this.prisma.post.findUnique({
      where: { id: postId.toString() },
      select: {
        id: true,
        parentId: true,
        authorId: true,
        body: true,
        createdAt: true,
        author: { select: { handle: true } },
      },
    });

    return found ? toThreadPost(found) : null;
  }

  async listByParentIds(parentIds: ReplyParentPostId[]): Promise<ThreadPost[]> {
    if (parentIds.length === 0) return [];

    const rows = await this.prisma.post.findMany({
      where: {
        parentId: { in: parentIds.map((id) => id.toString()) },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        parentId: true,
        authorId: true,
        body: true,
        createdAt: true,
        author: { select: { handle: true } },
      },
    });

    return rows.map(toThreadPost);
  }
}
