import { describe, expect, it, vi } from "vitest";

import { getUserProfileByHandle } from "@/app/_application/user-profile/getUserProfileByHandle";
import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import { UserProfile } from "@/app/_domain/user-profile/UserProfile";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

function createProfile(): UserProfile {
  return new UserProfile(
    UserId.fromString("user-2"),
    UserHandle.fromString("bob_2"),
    ProfileName.fromString("Bob"),
    UserBio.fromString("hello")
  );
}

function createRepoMock() {
  return {
    findById: vi.fn(),
    findByHandle: vi.fn(),
    existsByHandle: vi.fn(),
    update: vi.fn(),
  } satisfies UserProfileRepository;
}

describe("ハンドルでプロフィール取得するユースケース", () => {
  it("不正なハンドルのときエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await getUserProfileByHandle(
      { userProfileRepo: repo },
      { handle: "INVALID-HANDLE" }
    );

    expect(result).toEqual({ ok: false, message: "ハンドルが不正です。" });
    expect(repo.findByHandle).not.toHaveBeenCalled();
  });

  it("プロフィールが存在しないときエラーを返す", async () => {
    const repo = createRepoMock();
    repo.findByHandle.mockResolvedValue(null);

    const result = await getUserProfileByHandle(
      { userProfileRepo: repo },
      { handle: "bob_2" }
    );

    expect(result).toEqual({
      ok: false,
      message: "プロフィールが見つかりませんでした。",
    });
  });

  it("ハンドルを正規化して検索しプロフィールを返す", async () => {
    const repo = createRepoMock();
    repo.findByHandle.mockResolvedValue(createProfile());

    const result = await getUserProfileByHandle(
      { userProfileRepo: repo },
      { handle: " Bob_2 " }
    );

    expect(repo.findByHandle).toHaveBeenCalledTimes(1);
    const handleArg = repo.findByHandle.mock.calls[0][0] as UserHandle;
    expect(handleArg.toString()).toBe("bob_2");
    expect(result).toEqual({
      ok: true,
      profile: {
        userId: "user-2",
        name: "Bob",
        handle: "bob_2",
        bio: "hello",
      },
    });
  });
});
