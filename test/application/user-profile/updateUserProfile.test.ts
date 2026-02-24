import { describe, expect, it, vi } from "vitest";

import { updateUserProfile } from "@/app/_application/user-profile/updateUserProfile";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

function createRepoMock() {
  return {
    findById: vi.fn(),
    findByHandle: vi.fn(),
    existsByHandle: vi.fn(),
    update: vi.fn(),
  } satisfies UserProfileRepository;
}

describe("プロフィール更新ユースケース", () => {
  it("ユーザーIDが不正なときエラーを返す", async () => {
    const repo = createRepoMock();

    const result = await updateUserProfile(
      { userProfileRepo: repo },
      { userId: " ", name: "Alice", handle: "alice_1", bio: "" }
    );

    expect(result).toEqual({ ok: false, message: "ユーザーIDが不正です。" });
    expect(repo.existsByHandle).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("ハンドルが既に使われているときエラーを返す", async () => {
    const repo = createRepoMock();
    repo.existsByHandle.mockResolvedValue(true);

    const result = await updateUserProfile(
      { userProfileRepo: repo },
      { userId: "user-1", name: "Alice", handle: "alice_1", bio: "hello" }
    );

    expect(result).toEqual({
      ok: false,
      message: "このハンドルは既に使用されています。",
    });
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("入力が妥当なら更新を実行して成功を返す", async () => {
    const repo = createRepoMock();
    repo.existsByHandle.mockResolvedValue(false);
    repo.update.mockResolvedValue(undefined);

    const result = await updateUserProfile(
      { userProfileRepo: repo },
      { userId: "user-1", name: " Alice ", handle: " Alice_1 ", bio: " hi " }
    );

    expect(repo.existsByHandle).toHaveBeenCalledTimes(1);
    const [existsHandleArg, existsExcludeUserIdArg] =
      repo.existsByHandle.mock.calls[0];
    expect((existsHandleArg as UserHandle).toString()).toBe("alice_1");
    expect(existsExcludeUserIdArg.toString()).toBe("user-1");

    expect(repo.update).toHaveBeenCalledTimes(1);
    const updateArg = repo.update.mock.calls[0][0];
    expect(updateArg.userId.toString()).toBe("user-1");
    expect(updateArg.name.toString()).toBe("Alice");
    expect(updateArg.handle.toString()).toBe("alice_1");
    expect(updateArg.bio.toString()).toBe("hi");

    expect(result).toEqual({ ok: true, message: "プロフィールを更新しました。" });
  });
});
