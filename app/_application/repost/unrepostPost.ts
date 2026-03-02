import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import type { RepostRepository } from "@/app/_domain/repost/RepostRepository";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export type UnrepostPostResult = { ok: true } | { ok: false; message: string };

export async function unrepostPost(
  deps: { repostRepo: RepostRepository },
  input: { userId: string; postId: string }
): Promise<UnrepostPostResult> {
  let userId: RepostUserId;
  let postId: RepostPostId;
  try {
    userId = RepostUserId.fromString(input.userId);
    postId = RepostPostId.fromString(input.postId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  await deps.repostRepo.remove({ userId, postId });
  return { ok: true };
}
