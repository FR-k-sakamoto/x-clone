import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

export type UnfollowUserResult = { ok: true } | { ok: false; message: string };

export async function unfollowUser(
  deps: { followRepo: FollowRepository },
  input: { followerId: string; followingId: string }
): Promise<UnfollowUserResult> {
  let followerId: FollowFollowerId;
  let followingId: FollowFollowingId;
  try {
    followerId = FollowFollowerId.fromString(input.followerId);
    followingId = FollowFollowingId.fromString(input.followingId);
  } catch {
    return { ok: false, message: "不正な入力です。" };
  }

  await deps.followRepo.remove({ followerId, followingId });
  return { ok: true };
}
