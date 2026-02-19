import type { PrismaClient } from "@prisma/client";

import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export class PrismaLikeRepository implements LikeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(params: { userId: LikeUserId; postId: LikePostId }): Promise<boolean> {
    const found = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: params.userId.toString(),
          postId: params.postId.toString(),
        },
      },
      select: { userId: true },
    });
    return !!found;
  }

  async create(params: { userId: LikeUserId; postId: LikePostId }): Promise<void> {
    try {
      await this.prisma.like.create({
        data: {
          userId: params.userId.toString(),
          postId: params.postId.toString(),
        },
      });
    } catch {
      // `Like` has a unique composite key. Concurrent duplicate likes are no-op.
    }
  }

  async remove(params: { userId: LikeUserId; postId: LikePostId }): Promise<void> {
    try {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId: params.userId.toString(),
            postId: params.postId.toString(),
          },
        },
      });
    } catch {
      // Removing non-existing like is a no-op.
    }
  }

  async countByPostIds(postIds: LikePostId[]): Promise<Map<string, number>> {
    if (postIds.length === 0) return new Map<string, number>();

    const grouped = await this.prisma.like.groupBy({
      by: ["postId"],
      where: {
        postId: { in: postIds.map((postId) => postId.toString()) },
      },
      _count: { _all: true },
    });

    return new Map(grouped.map((row) => [row.postId, row._count._all]));
  }

  async findLikedPostIds(params: {
    userId: LikeUserId;
    postIds: LikePostId[];
  }): Promise<Set<string>> {
    if (params.postIds.length === 0) return new Set<string>();

    const rows = await this.prisma.like.findMany({
      where: {
        userId: params.userId.toString(),
        postId: { in: params.postIds.map((postId) => postId.toString()) },
      },
      select: { postId: true },
    });

    return new Set(rows.map((row) => row.postId));
  }
}
