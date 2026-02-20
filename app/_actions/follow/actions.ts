"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { followUser } from "@/app/_application/follow/followUser";
import { unfollowUser } from "@/app/_application/follow/unfollowUser";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaFollowRepository } from "@/app/_infrastructure/follow/PrismaFollowRepository";

export async function toggleFollowAction(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  const followerId = session?.user?.id;
  if (!followerId) return;

  const followingIdRaw = formData.get("followingId");
  const intentRaw = formData.get("intent");
  const profileHandleRaw = formData.get("profileHandle");
  const followingId = typeof followingIdRaw === "string" ? followingIdRaw : "";
  const intent = intentRaw === "unfollow" ? "unfollow" : "follow";
  const profileHandle = typeof profileHandleRaw === "string" ? profileHandleRaw : "";

  const followRepo = new PrismaFollowRepository(prisma);

  if (intent === "unfollow") {
    await unfollowUser({ followRepo }, { followerId, followingId });
  } else {
    await followUser({ followRepo }, { followerId, followingId });
  }

  revalidatePath("/");
  if (profileHandle) {
    revalidatePath(`/u/${profileHandle}`);
  }
}
