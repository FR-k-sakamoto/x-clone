import { Prisma, type PrismaClient } from "@prisma/client";

import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import type { RepostRepository, RepostTimelineEvent } from "@/app/_domain/repost/RepostRepository";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export class PrismaRepostRepository implements RepostRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(params: { userId: RepostUserId; postId: RepostPostId }): Promise<boolean> {
    const found = await this.prisma.repost.findUnique({
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

  async create(params: { userId: RepostUserId; postId: RepostPostId }): Promise<void> {
    try {
      await this.prisma.repost.create({
        data: {
          userId: params.userId.toString(),
          postId: params.postId.toString(),
        },
      });
    } catch (error) {
      // `Repost` has a unique composite key. Concurrent duplicate reposts are no-op.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return;
      }
      throw error;
    }
  }

  async remove(params: { userId: RepostUserId; postId: RepostPostId }): Promise<void> {
    try {
      await this.prisma.repost.delete({
        where: {
          userId_postId: {
            userId: params.userId.toString(),
            postId: params.postId.toString(),
          },
        },
      });
    } catch (error) {
      // Removing non-existing repost is a no-op.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return;
      }
      throw error;
    }
  }

  async countByPostIds(postIds: RepostPostId[]): Promise<Map<string, number>> {
    if (postIds.length === 0) return new Map<string, number>();

    const grouped = await this.prisma.repost.groupBy({
      by: ["postId"],
      where: {
        postId: { in: postIds.map((postId) => postId.toString()) },
      },
      _count: { _all: true },
    });

    return new Map(grouped.map((row) => [row.postId, row._count._all]));
  }

  async findRepostedPostIds(params: {
    userId: RepostUserId;
    postIds: RepostPostId[];
  }): Promise<Set<string>> {
    if (params.postIds.length === 0) return new Set<string>();

    const rows = await this.prisma.repost.findMany({
      where: {
        userId: params.userId.toString(),
        postId: { in: params.postIds.map((postId) => postId.toString()) },
      },
      select: { postId: true },
    });

    return new Set(rows.map((row) => row.postId));
  }

  async listRecentTimelineEvents(limit: number): Promise<RepostTimelineEvent[]> {
    const reposts = await this.prisma.repost.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        postId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            handle: true,
            name: true,
          },
        },
        post: {
          select: {
            authorId: true,
            body: true,
            createdAt: true,
          },
        },
      },
    });

    return reposts.map((repost) => ({
      postId: repost.postId,
      repostedAt: repost.createdAt,
      reposter: {
        userId: repost.user.id,
        handle: repost.user.handle,
        name: repost.user.name,
      },
      post: {
        authorId: repost.post.authorId,
        body: repost.post.body,
        createdAt: repost.post.createdAt,
      },
    }));
  }
}
