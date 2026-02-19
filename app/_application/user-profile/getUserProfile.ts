import { UserId } from "@/app/_domain/user-profile/UserId";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

export type GetUserProfileResult =
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

export async function getUserProfile(
  deps: { userProfileRepo: UserProfileRepository },
  input: { userId: string }
): Promise<GetUserProfileResult> {
  let userId: UserId;
  try {
    userId = UserId.fromString(input.userId);
  } catch {
    return { ok: false, message: "ユーザーIDが不正です。" };
  }

  const profile = await deps.userProfileRepo.findById(userId);
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
