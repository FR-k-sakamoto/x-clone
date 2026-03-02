import { Prisma, type PrismaClient } from "@prisma/client";

import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

export class PrismaFollowRepository implements FollowRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<boolean> {
    const found = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: params.followerId.toString(),
          followingId: params.followingId.toString(),
        },
      },
      select: { followerId: true },
    });
    return !!found;
  }

  async create(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<void> {
    try {
      await this.prisma.follow.create({
        data: {
          followerId: params.followerId.toString(),
          followingId: params.followingId.toString(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return;
      }
      throw error;
    }
  }

  async remove(params: {
    followerId: FollowFollowerId;
    followingId: FollowFollowingId;
  }): Promise<void> {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: params.followerId.toString(),
            followingId: params.followingId.toString(),
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return;
      }
      throw error;
    }
  }

  async findFollowedUserIds(params: {
    followerId: FollowFollowerId;
    followingIds: FollowFollowingId[];
  }): Promise<Set<string>> {
    if (params.followingIds.length === 0) return new Set<string>();

    const rows = await this.prisma.follow.findMany({
      where: {
        followerId: params.followerId.toString(),
        followingId: { in: params.followingIds.map((id) => id.toString()) },
      },
      select: { followingId: true },
    });

    return new Set(rows.map((row) => row.followingId));
  }
}
