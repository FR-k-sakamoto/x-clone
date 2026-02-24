"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { repostPost } from "@/app/_application/repost/repostPost";
import { unrepostPost } from "@/app/_application/repost/unrepostPost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaRepostRepository } from "@/app/_infrastructure/repost/PrismaRepostRepository";

export async function toggleRepostAction(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return;

  const postIdRaw = formData.get("postId");
  const intentRaw = formData.get("intent");
  const postId = typeof postIdRaw === "string" ? postIdRaw : "";
  const intent = intentRaw === "unrepost" ? "unrepost" : "repost";

  const repostRepo = new PrismaRepostRepository(prisma);

  if (intent === "unrepost") {
    await unrepostPost({ repostRepo }, { userId, postId });
  } else {
    await repostPost({ repostRepo }, { userId, postId });
  }

  revalidatePath("/");
}
