"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { likePost } from "@/app/_application/reaction/likePost";
import { unlikePost } from "@/app/_application/reaction/unlikePost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";

export async function toggleLikeAction(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return;

  const postIdRaw = formData.get("postId");
  const intentRaw = formData.get("intent");
  const postId = typeof postIdRaw === "string" ? postIdRaw : "";
  const intent = intentRaw === "unlike" ? "unlike" : "like";

  const likeRepo = new PrismaLikeRepository(prisma);

  if (intent === "unlike") {
    await unlikePost({ likeRepo }, { userId, postId });
  } else {
    await likePost({ likeRepo }, { userId, postId });
  }

  revalidatePath("/");
}
