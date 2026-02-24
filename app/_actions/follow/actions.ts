"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { followUser } from "@/app/_application/follow/followUser";
import { unfollowUser } from "@/app/_application/follow/unfollowUser";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaFollowRepository } from "@/app/_infrastructure/follow/PrismaFollowRepository";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export async function toggleFollowAction(formData: FormData): Promise<void> {
  await assertServerActionCsrf();

  const session = await getServerSession(authOptions);
  const followerId = session?.user?.id;
  if (!followerId) {
    logOperationWarn("follow.toggle.unauthorized");
    throw new Error("Unauthorized");
  }

  const followingIdRaw = formData.get("followingId");
  const intentRaw = formData.get("intent");
  const profileHandleRaw = formData.get("profileHandle");
  const followingId = typeof followingIdRaw === "string" ? followingIdRaw : "";
  const intent = intentRaw === "unfollow" ? "unfollow" : "follow";
  const profileHandle = typeof profileHandleRaw === "string" ? profileHandleRaw : "";

  const followRepo = new PrismaFollowRepository(prisma);

  try {
    const result =
      intent === "unfollow"
        ? await unfollowUser({ followRepo }, { followerId, followingId })
        : await followUser({ followRepo }, { followerId, followingId });

    if (!result.ok) {
      logOperationWarn("follow.toggle.validation_failed", {
        followerId,
        followingId,
        intent,
        message: result.message,
      });
      throw new Error(result.message);
    }

    revalidatePath("/");
    if (profileHandle) {
      revalidatePath(`/u/${profileHandle}`);
    }
    logOperationInfo("follow.toggle.success", { followerId, followingId, intent });
  } catch (error) {
    logOperationError("follow.toggle.failed", error, { followerId, followingId, intent });
    throw error;
  }
}
