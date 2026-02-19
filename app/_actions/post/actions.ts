"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { createPost } from "@/app/_application/post/createPost";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaPostRepository } from "@/app/_infrastructure/post/PrismaPostRepository";

export type CreatePostState = { ok: boolean; message: string | null };

const initialError: CreatePostState = {
  ok: false,
  message: "投稿に失敗しました。",
};

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, message: "投稿にはログインが必要です。" };
  }

  const bodyRaw = formData.get("body");
  const body = typeof bodyRaw === "string" ? bodyRaw : "";

  const postRepo = new PrismaPostRepository(prisma);

  try {
    const result = await createPost({ postRepo }, { authorId: userId, body });
    if (!result.ok) return { ok: false, message: result.message };

    revalidatePath("/");
    return { ok: true, message: null };
  } catch (error) {
    console.error("[post][create][action]", error);
    return initialError;
  }
}
