"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { createPost } from "@/app/_application/post/createPost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaPostRepository } from "@/app/_infrastructure/post/PrismaPostRepository";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export type CreatePostState = { ok: boolean; message: string | null };

const initialError: CreatePostState = {
  ok: false,
  message: "投稿に失敗しました。",
};

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  await assertServerActionCsrf();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    logOperationWarn("post.create.unauthorized");
    return { ok: false, message: "投稿にはログインが必要です。" };
  }

  const bodyRaw = formData.get("body");
  const body = typeof bodyRaw === "string" ? bodyRaw : "";

  const postRepo = new PrismaPostRepository(prisma);

  try {
    const result = await createPost({ postRepo }, { authorId: userId, body });
    if (!result.ok) {
      logOperationWarn("post.create.validation_failed", { userId, message: result.message });
      return { ok: false, message: result.message };
    }

    revalidatePath("/");
    logOperationInfo("post.create.success", { userId });
    return { ok: true, message: null };
  } catch (error) {
    logOperationError("post.create.failed", error, { userId });
    return initialError;
  }
}
