import { describe, expect, it, vi } from "vitest";

import { getUserProfile } from "@/app/_application/user-profile/getUserProfile";
import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import { UserProfile } from "@/app/_domain/user-profile/UserProfile";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

function createProfile(): UserProfile {
  return new UserProfile(
    UserId.fromString("user-1"),
    UserHandle.fromString("alice_1"),
    ProfileName.fromString("Alice"),
    UserBio.fromString("")
  );
}

function createRepoMock() {
  return {
    findById: vi.fn<Parameters<UserProfileRepository["findById"]>, ReturnType<UserProfileRepository["findById"]>>(),
    findByHandle: vi.fn(),
    existsByHandle: vi.fn(),
    update: vi.fn(),
  } satisfies UserProfileRepository;
}

describe("ユーザーIDでプロフィール取得するユースケース", () => {
  it("不正なユーザーIDのときエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await getUserProfile(
      { userProfileRepo: repo },
      { userId: "   " }
    );

    expect(result).toEqual({ ok: false, message: "ユーザーIDが不正です。" });
    expect(repo.findById).not.toHaveBeenCalled();
  });

  it("プロフィールが存在しないときエラーを返す", async () => {
    const repo = createRepoMock();
    repo.findById.mockResolvedValue(null);

    const result = await getUserProfile(
      { userProfileRepo: repo },
      { userId: "user-1" }
    );

    expect(result).toEqual({
      ok: false,
      message: "プロフィールが見つかりませんでした。",
    });
  });

  it("プロフィールが存在するとレスポンス用に整形して返す", async () => {
    const repo = createRepoMock();
    repo.findById.mockResolvedValue(createProfile());

    const result = await getUserProfile(
      { userProfileRepo: repo },
      { userId: "user-1" }
    );

    expect(result).toEqual({
      ok: true,
      profile: {
        userId: "user-1",
        name: "Alice",
        handle: "alice_1",
        bio: "",
      },
    });
  });
});
