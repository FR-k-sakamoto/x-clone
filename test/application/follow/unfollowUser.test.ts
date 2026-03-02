import { describe, expect, it, vi } from "vitest";

import { unfollowUser } from "@/app/_application/follow/unfollowUser";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

function createRepoMock() {
  return {
    exists: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    findFollowedUserIds: vi.fn(),
  } satisfies FollowRepository;
}

describe("アンフォローユースケース", () => {
  it("入力が不正なときエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await unfollowUser(
      { followRepo: repo },
      { followerId: "", followingId: "user-2" }
    );

    expect(result).toEqual({ ok: false, message: "不正な入力です。" });
    expect(repo.remove).not.toHaveBeenCalled();
  });

  it("入力が妥当なら削除を実行して成功を返す", async () => {
    const repo = createRepoMock();
    repo.remove.mockResolvedValue(undefined);

    const result = await unfollowUser(
      { followRepo: repo },
      { followerId: "user-1", followingId: "user-2" }
    );

    expect(result).toEqual({ ok: true });
    expect(repo.remove).toHaveBeenCalledTimes(1);
    const removeArg = repo.remove.mock.calls[0][0];
    expect(removeArg.followerId.toString()).toBe("user-1");
    expect(removeArg.followingId.toString()).toBe("user-2");
  });
});
