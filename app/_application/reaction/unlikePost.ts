import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export type UnlikePostResult = { ok: true } | { ok: false; message: string };

export async function unlikePost(
  deps: { likeRepo: LikeRepository },
  input: { userId: string; postId: string }
): Promise<UnlikePostResult> {
  let userId: LikeUserId;
  let postId: LikePostId;
  try {
    userId = LikeUserId.fromString(input.userId);
    postId = LikePostId.fromString(input.postId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  await deps.likeRepo.remove({ userId, postId });
  return { ok: true };
}
