"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { updateUserProfile as updateUserProfileUseCase } from "@/app/_application/user-profile/updateUserProfile";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { PrismaUserProfileRepository } from "@/app/_infrastructure/user-profile/PrismaUserProfileRepository";
import { prisma } from "@/app/_infrastructure/db/prisma";

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
  const sessionPromise = getServerSession(authOptions);

  const name = getString(formData, "name");
  const handle = getString(formData, "handle");
  const bio = getString(formData, "bio");

  const session = await sessionPromise;
  const userId = session?.user?.id ?? "";
  if (!userId) {
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
    }

    return { ok: result.ok, message: result.message };
  } catch (err) {
    console.error("[profile][update][action]", err);
    return { ok: false, message: "プロフィール更新に失敗しました。" };
  }
}
