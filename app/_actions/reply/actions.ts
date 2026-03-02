"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { createReply } from "@/app/_application/reply/createReply";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaReplyRepository } from "@/app/_infrastructure/reply/PrismaReplyRepository";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export type CreateReplyState = { ok: boolean; message: string | null };

const initialError: CreateReplyState = {
  ok: false,
  message: "返信に失敗しました。",
};

export async function createReplyAction(
  _prevState: CreateReplyState,
  formData: FormData
): Promise<CreateReplyState> {
  await assertServerActionCsrf();

  const session = await getServerSession(authOptions);
  const authorId = session?.user?.id;
  if (!authorId) {
    logOperationWarn("reply.create.unauthorized");
    return { ok: false, message: "返信にはログインが必要です。" };
  }

  const parentPostIdRaw = formData.get("parentPostId");
  const bodyRaw = formData.get("body");
  const parentPostId = typeof parentPostIdRaw === "string" ? parentPostIdRaw : "";
  const body = typeof bodyRaw === "string" ? bodyRaw : "";

  const replyRepo = new PrismaReplyRepository(prisma);

  try {
    const result = await createReply({ replyRepo }, { authorId, parentPostId, body });
    if (!result.ok) {
      logOperationWarn("reply.create.validation_failed", { authorId, message: result.message });
      return { ok: false, message: result.message };
    }

    revalidatePath("/");
    revalidatePath(`/post/${parentPostId}`);
    logOperationInfo("reply.create.success", { authorId, parentPostId });
    return { ok: true, message: null };
  } catch (error) {
    logOperationError("reply.create.failed", error, { authorId, parentPostId });
    return initialError;
  }
}
