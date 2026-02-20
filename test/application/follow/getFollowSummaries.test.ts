import { describe, expect, it, vi } from "vitest";

import { getFollowSummaries } from "@/app/_application/follow/getFollowSummaries";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

function createRepoMock() {
  return {
    exists: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    findFollowedUserIds: vi.fn(),
  } satisfies FollowRepository;
}

describe("フォロー要約取得ユースケース", () => {
  it("対象ユーザーが空なら空配列を返す", async () => {
    const repo = createRepoMock();

    const result = await getFollowSummaries(
      { followRepo: repo },
      { viewerUserId: "viewer-1", targetUserIds: [] }
    );

    expect(result).toEqual([]);
    expect(repo.findFollowedUserIds).not.toHaveBeenCalled();
  });

  it("閲覧者IDが不正なら全て未フォローを返す", async () => {
    const repo = createRepoMock();

    const result = await getFollowSummaries(
      { followRepo: repo },
      { viewerUserId: " ", targetUserIds: ["user-1", "user-2"] }
    );

    expect(result).toEqual([
      { targetUserId: "user-1", followedByMe: false },
      { targetUserId: "user-2", followedByMe: false },
    ]);
    expect(repo.findFollowedUserIds).not.toHaveBeenCalled();
  });

  it("有効な対象IDのみでリポジトリ検索し結果をマージする", async () => {
    const repo = createRepoMock();
    repo.findFollowedUserIds.mockResolvedValue(new Set(["user-2"]));

    const result = await getFollowSummaries(
      { followRepo: repo },
      {
        viewerUserId: "viewer-1",
        targetUserIds: ["user-1", " ", "user-2", "user-3"],
      }
    );

    expect(repo.findFollowedUserIds).toHaveBeenCalledTimes(1);
    const callArg = repo.findFollowedUserIds.mock.calls[0][0];
    expect(callArg.followerId.toString()).toBe("viewer-1");
    expect(callArg.followingIds.map((id: { toString: () => string }) => id.toString())).toEqual([
      "user-1",
      "user-2",
      "user-3",
    ]);

    expect(result).toEqual([
      { targetUserId: "user-1", followedByMe: false },
      { targetUserId: " ", followedByMe: false },
      { targetUserId: "user-2", followedByMe: true },
      { targetUserId: "user-3", followedByMe: false },
    ]);
  });
});
