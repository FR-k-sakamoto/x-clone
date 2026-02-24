"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { repostPost } from "@/app/_application/repost/repostPost";
import { unrepostPost } from "@/app/_application/repost/unrepostPost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaRepostRepository } from "@/app/_infrastructure/repost/PrismaRepostRepository";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export async function toggleRepostAction(formData: FormData): Promise<void> {
  await assertServerActionCsrf();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    logOperationWarn("repost.toggle.unauthorized");
    throw new Error("Unauthorized");
  }

  const postIdRaw = formData.get("postId");
  const intentRaw = formData.get("intent");
  const postId = typeof postIdRaw === "string" ? postIdRaw : "";
  const intent = intentRaw === "unrepost" ? "unrepost" : "repost";

  const repostRepo = new PrismaRepostRepository(prisma);

  try {
    const result =
      intent === "unrepost"
        ? await unrepostPost({ repostRepo }, { userId, postId })
        : await repostPost({ repostRepo }, { userId, postId });

    if (!result.ok) {
      logOperationWarn("repost.toggle.validation_failed", {
        userId,
        postId,
        intent,
        message: result.message,
      });
      throw new Error(result.message);
    }

    revalidatePath("/");
    logOperationInfo("repost.toggle.success", { userId, postId, intent });
  } catch (error) {
    logOperationError("repost.toggle.failed", error, { userId, postId, intent });
    throw error;
  }
}
