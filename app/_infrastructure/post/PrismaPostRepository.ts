import type { PrismaClient } from "@prisma/client";

import { Post } from "@/app/_domain/post/Post";
import { PostAuthorId } from "@/app/_domain/post/PostAuthorId";
import { PostBody } from "@/app/_domain/post/PostBody";
import { PostId } from "@/app/_domain/post/PostId";
import type { PostRepository } from "@/app/_domain/post/PostRepository";

function toDomainPost(row: {
  id: string;
  authorId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return new Post(
    PostId.fromString(row.id),
    PostAuthorId.fromString(row.authorId),
    PostBody.fromString(row.body),
    row.createdAt,
    row.updatedAt
  );
}

export class PrismaPostRepository implements PostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: { authorId: PostAuthorId; body: PostBody }): Promise<Post> {
    const created = await this.prisma.post.create({
      data: {
        authorId: params.authorId.toString(),
        body: params.body.toString(),
      },
      select: {
        id: true,
        authorId: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return toDomainPost(created);
  }

  async findById(id: PostId): Promise<Post | null> {
    const found = await this.prisma.post.findUnique({
      where: { id: id.toString() },
      select: {
        id: true,
        authorId: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return found ? toDomainPost(found) : null;
  }

  async listRecent(limit: number): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        authorId: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return posts.map(toDomainPost);
  }

  async updateBody(params: { postId: PostId; body: PostBody }): Promise<Post | null> {
    try {
      const updated = await this.prisma.post.update({
        where: { id: params.postId.toString() },
        data: { body: params.body.toString() },
        select: {
          id: true,
          authorId: true,
          body: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return toDomainPost(updated);
    } catch {
      return null;
    }
  }

  async deleteById(postId: PostId): Promise<void> {
    await this.prisma.post.delete({
      where: { id: postId.toString() },
    });
  }
}
