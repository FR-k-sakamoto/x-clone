"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { likePost } from "@/app/_application/reaction/likePost";
import { unlikePost } from "@/app/_application/reaction/unlikePost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export async function toggleLikeAction(formData: FormData): Promise<void> {
  await assertServerActionCsrf();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    logOperationWarn("reaction.toggle.unauthorized");
    throw new Error("Unauthorized");
  }

  const postIdRaw = formData.get("postId");
  const intentRaw = formData.get("intent");
  const postId = typeof postIdRaw === "string" ? postIdRaw : "";
  const intent = intentRaw === "unlike" ? "unlike" : "like";

  const likeRepo = new PrismaLikeRepository(prisma);

  try {
    const result =
      intent === "unlike"
        ? await unlikePost({ likeRepo }, { userId, postId })
        : await likePost({ likeRepo }, { userId, postId });

    if (!result.ok) {
      logOperationWarn("reaction.toggle.validation_failed", {
        userId,
        postId,
        intent,
        message: result.message,
      });
      throw new Error(result.message);
    }

    revalidatePath("/");
    logOperationInfo("reaction.toggle.success", { userId, postId, intent });
  } catch (error) {
    logOperationError("reaction.toggle.failed", error, { userId, postId, intent });
    throw error;
  }
}
