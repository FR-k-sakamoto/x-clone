"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { updateUserProfile as updateUserProfileUseCase } from "@/app/_application/user-profile/updateUserProfile";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";
import { PrismaUserProfileRepository } from "@/app/_infrastructure/user-profile/PrismaUserProfileRepository";

export type UpdateProfileState = {
  ok: boolean;
  message: string | null;
};

function getString(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  await assertServerActionCsrf();

  const sessionPromise = getServerSession(authOptions);

  const name = getString(formData, "name");
  const handle = getString(formData, "handle");
  const bio = getString(formData, "bio");

  const session = await sessionPromise;
  const userId = session?.user?.id ?? "";
  if (!userId) {
    logOperationWarn("profile.update.unauthorized");
    return { ok: false, message: "認証が必要です。再ログインしてください。" };
  }

  const userProfileRepo = new PrismaUserProfileRepository(prisma);

  try {
    const result = await updateUserProfileUseCase(
      { userProfileRepo },
      { userId, name, handle, bio }
    );

    if (result.ok) {
      revalidatePath("/");
      revalidatePath("/profile");
      logOperationInfo("profile.update.success", { userId });
    } else {
      logOperationWarn("profile.update.validation_failed", { userId, message: result.message });
    }

    return { ok: result.ok, message: result.message };
  } catch (err) {
    logOperationError("profile.update.failed", err, { userId });
    return { ok: false, message: "プロフィール更新に失敗しました。" };
  }
}
