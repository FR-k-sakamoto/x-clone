import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export type LikePostResult = { ok: true } | { ok: false; message: string };

export async function likePost(
  deps: { likeRepo: LikeRepository },
  input: { userId: string; postId: string }
): Promise<LikePostResult> {
  let userId: LikeUserId;
  let postId: LikePostId;
  try {
    userId = LikeUserId.fromString(input.userId);
    postId = LikePostId.fromString(input.postId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  const exists = await deps.likeRepo.exists({ userId, postId });
  if (exists) return { ok: true };

  await deps.likeRepo.create({ userId, postId });
  return { ok: true };
}
