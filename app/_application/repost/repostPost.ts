import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import type { RepostRepository } from "@/app/_domain/repost/RepostRepository";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export type RepostPostResult = { ok: true } | { ok: false; message: string };

export async function repostPost(
  deps: { repostRepo: RepostRepository },
  input: { userId: string; postId: string }
): Promise<RepostPostResult> {
  let userId: RepostUserId;
  let postId: RepostPostId;
  try {
    userId = RepostUserId.fromString(input.userId);
    postId = RepostPostId.fromString(input.postId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  const exists = await deps.repostRepo.exists({ userId, postId });
  if (exists) return { ok: true };

  await deps.repostRepo.create({ userId, postId });
  return { ok: true };
}
