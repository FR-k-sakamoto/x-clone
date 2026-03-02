import { ProfileName } from "@/app/_domain/user-profile/ProfileName";
import { UserBio } from "@/app/_domain/user-profile/UserBio";
import { UserHandle } from "@/app/_domain/user-profile/UserHandle";
import { UserId } from "@/app/_domain/user-profile/UserId";
import type { UserProfileRepository } from "@/app/_domain/user-profile/UserProfileRepository";

export type UpdateUserProfileResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function updateUserProfile(
  deps: { userProfileRepo: UserProfileRepository },
  input: {
    userId: string;
    name: string;
    handle: string;
    bio: string;
  }
): Promise<UpdateUserProfileResult> {
  let userId: UserId;
  let name: ProfileName;
  let handle: UserHandle;
  let bio: UserBio;

  try {
    userId = UserId.fromString(input.userId);
  } catch {
    return { ok: false, message: "ユーザーIDが不正です。" };
  }

  try {
    name = ProfileName.fromString(input.name);
  } catch {
    return { ok: false, message: "名前は1文字以上50文字以内で入力してください。" };
  }

  try {
    handle = UserHandle.fromString(input.handle);
  } catch {
    return {
      ok: false,
      message: "ハンドルは英小文字・数字・アンダースコアで1-24文字にしてください。",
    };
  }

  try {
    bio = UserBio.fromString(input.bio);
  } catch {
    return { ok: false, message: "自己紹介は160文字以内で入力してください。" };
  }

  const handleTaken = await deps.userProfileRepo.existsByHandle(handle, userId);
  if (handleTaken) {
    return { ok: false, message: "このハンドルは既に使用されています。" };
  }

  await deps.userProfileRepo.update({
    userId,
    name,
    handle,
    bio,
  });

  return { ok: true, message: "プロフィールを更新しました。" };
}
