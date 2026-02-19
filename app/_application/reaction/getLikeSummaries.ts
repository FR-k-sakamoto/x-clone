import { LikePostId } from "@/app/_domain/reaction/LikePostId";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import { LikeUserId } from "@/app/_domain/reaction/LikeUserId";

export type LikeSummary = {
  postId: string;
  likeCount: number;
  likedByMe: boolean;
};

export async function getLikeSummaries(
  deps: { likeRepo: LikeRepository },
  input: { postIds: string[]; viewerUserId: string }
): Promise<LikeSummary[]> {
  if (input.postIds.length === 0) return [];

  let viewerUserId: LikeUserId;
  try {
    viewerUserId = LikeUserId.fromString(input.viewerUserId);
  } catch {
    return input.postIds.map((postId) => ({ postId, likeCount: 0, likedByMe: false }));
  }

  const postIds = input.postIds
    .map((value) => {
      try {
        return LikePostId.fromString(value);
      } catch {
        return null;
      }
    })
    .filter((value): value is LikePostId => value !== null);

  if (postIds.length === 0) {
    return input.postIds.map((postId) => ({ postId, likeCount: 0, likedByMe: false }));
  }

  const [countMap, likedSet] = await Promise.all([
    deps.likeRepo.countByPostIds(postIds),
    deps.likeRepo.findLikedPostIds({ userId: viewerUserId, postIds }),
  ]);

  return input.postIds.map((postId) => ({
    postId,
    likeCount: countMap.get(postId) ?? 0,
    likedByMe: likedSet.has(postId),
  }));
}
