import { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";
import { PrismaFollowRepository } from "@/app/_infrastructure/follow/PrismaFollowRepository";

function createPrismaMock() {
  return {
    follow: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  };
}

describe("PrismaFollowRepositoryの永続化処理", () => {
  it("exists: 複合キーで検索して存在判定を返す", async () => {
    const prisma = createPrismaMock();
    prisma.follow.findUnique.mockResolvedValue({ followerId: "user-1" });
    const repo = new PrismaFollowRepository(prisma as never);

    const found = await repo.exists({
      followerId: FollowFollowerId.fromString("user-1"),
      followingId: FollowFollowingId.fromString("user-2"),
    });

    expect(found).toBe(true);
    expect(prisma.follow.findUnique).toHaveBeenCalledWith({
      where: {
        followerId_followingId: {
          followerId: "user-1",
          followingId: "user-2",
        },
      },
      select: { followerId: true },
    });
  });

  it("create: 重複エラー(P2002)は握りつぶす", async () => {
    const prisma = createPrismaMock();
    const duplicateError = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
    });
    prisma.follow.create.mockRejectedValue(duplicateError);
    const repo = new PrismaFollowRepository(prisma as never);

    await expect(
      repo.create({
        followerId: FollowFollowerId.fromString("user-1"),
        followingId: FollowFollowingId.fromString("user-2"),
      })
    ).resolves.toBeUndefined();
  });

  it("create: 重複以外のエラーは再送出する", async () => {
    const prisma = createPrismaMock();
    const unexpectedError = new Error("db down");
    prisma.follow.create.mockRejectedValue(unexpectedError);
    const repo = new PrismaFollowRepository(prisma as never);

    await expect(
      repo.create({
        followerId: FollowFollowerId.fromString("user-1"),
        followingId: FollowFollowingId.fromString("user-2"),
      })
    ).rejects.toThrow("db down");
  });

  it("remove: 未存在エラー(P2025)は握りつぶす", async () => {
    const prisma = createPrismaMock();
    const notFoundError = new Prisma.PrismaClientKnownRequestError("missing", {
      code: "P2025",
      clientVersion: "test",
    });
    prisma.follow.delete.mockRejectedValue(notFoundError);
    const repo = new PrismaFollowRepository(prisma as never);

    await expect(
      repo.remove({
        followerId: FollowFollowerId.fromString("user-1"),
        followingId: FollowFollowingId.fromString("user-2"),
      })
    ).resolves.toBeUndefined();
  });

  it("findFollowedUserIds: 対象が空ならクエリせず空Setを返す", async () => {
    const prisma = createPrismaMock();
    const repo = new PrismaFollowRepository(prisma as never);

    const result = await repo.findFollowedUserIds({
      followerId: FollowFollowerId.fromString("user-1"),
      followingIds: [],
    });

    expect(result).toEqual(new Set());
    expect(prisma.follow.findMany).not.toHaveBeenCalled();
  });

  it("findFollowedUserIds: 該当行をSetに変換して返す", async () => {
    const prisma = createPrismaMock();
    prisma.follow.findMany.mockResolvedValue([
      { followingId: "user-2" },
      { followingId: "user-3" },
    ]);
    const repo = new PrismaFollowRepository(prisma as never);

    const result = await repo.findFollowedUserIds({
      followerId: FollowFollowerId.fromString("user-1"),
      followingIds: [
        FollowFollowingId.fromString("user-2"),
        FollowFollowingId.fromString("user-3"),
      ],
    });

    expect(prisma.follow.findMany).toHaveBeenCalledWith({
      where: {
        followerId: "user-1",
        followingId: { in: ["user-2", "user-3"] },
      },
      select: { followingId: true },
    });
    expect(result).toEqual(new Set(["user-2", "user-3"]));
  });
});
