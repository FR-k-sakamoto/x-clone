import { describe, expect, it, vi } from "vitest";

import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import { PrismaUserProfileRepository } from "@/app/_infrastructure/user-profile/PrismaUserProfileRepository";

function createPrismaMock() {
  return {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };
}

describe("PrismaUserProfileRepositoryの永続化処理", () => {
  it("findById: レコードがない場合は null を返す", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue(null);
    const repo = new PrismaUserProfileRepository(prisma as never);

    const profile = await repo.findById(UserId.fromString("user-1"));

    expect(profile).toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true, name: true, handle: true, bio: true },
    });
  });

  it("findByHandle: レコードがある場合はドメインモデルへ変換する", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      name: "Bob",
      handle: "bob_2",
      bio: null,
    });
    const repo = new PrismaUserProfileRepository(prisma as never);

    const profile = await repo.findByHandle(UserHandle.fromString("bob_2"));

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { handle: "bob_2" },
      select: { id: true, name: true, handle: true, bio: true },
    });
    expect(profile?.getUserId().toString()).toBe("user-2");
    expect(profile?.getName().toString()).toBe("Bob");
    expect(profile?.getHandle().toString()).toBe("bob_2");
    expect(profile?.getBio().toString()).toBeNull();
  });

  it("existsByHandle: 同一ユーザーIDを除外した場合は false を返す", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: "user-1" });
    const repo = new PrismaUserProfileRepository(prisma as never);

    const exists = await repo.existsByHandle(
      UserHandle.fromString("alice_1"),
      UserId.fromString("user-1")
    );

    expect(exists).toBe(false);
  });

  it("existsByHandle: 別ユーザーが使っている場合は true を返す", async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: "user-2" });
    const repo = new PrismaUserProfileRepository(prisma as never);

    const exists = await repo.existsByHandle(
      UserHandle.fromString("alice_1"),
      UserId.fromString("user-1")
    );

    expect(exists).toBe(true);
  });

  it("update: 値オブジェクトを文字列化して更新する", async () => {
    const prisma = createPrismaMock();
    prisma.user.update.mockResolvedValue({});
    const repo = new PrismaUserProfileRepository(prisma as never);

    await repo.update({
      userId: UserId.fromString("user-1"),
      name: ProfileName.fromString("Alice"),
      handle: UserHandle.fromString("alice_1"),
      bio: UserBio.fromString(""),
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        name: "Alice",
        handle: "alice_1",
        bio: null,
      },
    });
  });
});
