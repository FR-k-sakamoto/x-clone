import { describe, expect, it, vi } from "vitest";

import { followUser } from "@/app/_application/follow/followUser";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

function createRepoMock() {
  return {
    exists: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    findFollowedUserIds: vi.fn(),
  } satisfies FollowRepository;
}

describe("フォローユースケース", () => {
  it("入力が不正なときエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await followUser(
      { followRepo: repo },
      { followerId: " ", followingId: "user-2" }
    );

    expect(result).toEqual({ ok: false, message: "不正な入力です。" });
    expect(repo.exists).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("自分自身のフォローはエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await followUser(
      { followRepo: repo },
      { followerId: "user-1", followingId: "user-1" }
    );

    expect(result).toEqual({ ok: false, message: "自分自身はフォローできません。" });
    expect(repo.exists).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("既にフォロー済みなら作成せず成功を返す", async () => {
    const repo = createRepoMock();
    repo.exists.mockResolvedValue(true);

    const result = await followUser(
      { followRepo: repo },
      { followerId: "user-1", followingId: "user-2" }
    );

    expect(result).toEqual({ ok: true });
    expect(repo.exists).toHaveBeenCalledTimes(1);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("未フォローなら作成して成功を返す", async () => {
    const repo = createRepoMock();
    repo.exists.mockResolvedValue(false);
    repo.create.mockResolvedValue(undefined);

    const result = await followUser(
      { followRepo: repo },
      { followerId: "user-1", followingId: "user-2" }
    );

    expect(result).toEqual({ ok: true });
    expect(repo.exists).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledTimes(1);
    const createArg = repo.create.mock.calls[0][0];
    expect(createArg.followerId.toString()).toBe("user-1");
    expect(createArg.followingId.toString()).toBe("user-2");
  });
});
