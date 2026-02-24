import { FollowFollowerId } from "@/app/_domain/follow/FollowFollowerId";
import { FollowFollowingId } from "@/app/_domain/follow/FollowFollowingId";
import type { FollowRepository } from "@/app/_domain/follow/FollowRepository";

export type FollowSummary = {
  targetUserId: string;
  followedByMe: boolean;
};

export async function getFollowSummaries(
  deps: { followRepo: FollowRepository },
  input: { viewerUserId: string; targetUserIds: string[] }
): Promise<FollowSummary[]> {
  if (input.targetUserIds.length === 0) return [];

  let viewerUserId: FollowFollowerId;
  try {
    viewerUserId = FollowFollowerId.fromString(input.viewerUserId);
  } catch {
    return input.targetUserIds.map((targetUserId) => ({ targetUserId, followedByMe: false }));
  }

  const followingIds = input.targetUserIds
    .map((value) => {
      try {
        return FollowFollowingId.fromString(value);
      } catch {
        return null;
      }
    })
    .filter((value): value is FollowFollowingId => value !== null);

  if (followingIds.length === 0) {
    return input.targetUserIds.map((targetUserId) => ({ targetUserId, followedByMe: false }));
  }

  const followedSet = await deps.followRepo.findFollowedUserIds({
    followerId: viewerUserId,
    followingIds,
  });

  return input.targetUserIds.map((targetUserId) => ({
    targetUserId,
    followedByMe: followedSet.has(targetUserId),
  }));
}
