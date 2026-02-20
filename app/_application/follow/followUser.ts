import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

export type FollowUserResult = { ok: true } | { ok: false; message: string };

export async function followUser(
  deps: { followRepo: FollowRepository },
  input: { followerId: string; followingId: string }
): Promise<FollowUserResult> {
  let followerId: FollowFollowerId;
  let followingId: FollowFollowingId;
  try {
    followerId = FollowFollowerId.fromString(input.followerId);
    followingId = FollowFollowingId.fromString(input.followingId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  if (followerId.toString() === followingId.toString()) {
    return { ok: false, message: "自分自身はフォローできません。" };
  }

  const exists = await deps.followRepo.exists({ followerId, followingId });
  if (exists) return { ok: true };

  await deps.followRepo.create({ followerId, followingId });
  return { ok: true };
}
