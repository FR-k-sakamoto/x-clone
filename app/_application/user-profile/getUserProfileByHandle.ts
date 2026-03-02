import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

export type GetUserProfileByHandleResult =
  | {
      ok: true;
      profile: {
        userId: string;
        name: string;
        handle: string;
        bio: string;
      };
    }
  | { ok: false; message: string };

export async function getUserProfileByHandle(
  deps: { userProfileRepo: UserProfileRepository },
  input: { handle: string }
): Promise<GetUserProfileByHandleResult> {
  let handle: UserHandle;
  try {
    handle = UserHandle.fromString(input.handle);
  } catch {
    return { ok: false, message: "ハンドルが不正です。" };
  }

  const profile = await deps.userProfileRepo.findByHandle(handle);
  if (!profile) {
    return { ok: false, message: "プロフィールが見つかりませんでした。" };
  }

  return {
    ok: true,
    profile: {
      userId: profile.getUserId().toString(),
      name: profile.getName().toString(),
      handle: profile.getHandle().toString(),
      bio: profile.getBio().toString() ?? "",
    },
  };
}
