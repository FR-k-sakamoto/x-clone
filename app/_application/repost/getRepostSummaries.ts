import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import type { RepostRepository } from "@/app/_domain/repost/RepostRepository";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export type RepostSummary = {
  postId: string;
  repostCount: number;
  repostedByMe: boolean;
};

export async function getRepostSummaries(
  deps: { repostRepo: RepostRepository },
  input: { postIds: string[]; viewerUserId: string }
): Promise<RepostSummary[]> {
  if (input.postIds.length === 0) return [];

  let viewerUserId: RepostUserId;
  try {
    viewerUserId = RepostUserId.fromString(input.viewerUserId);
  } catch {
    return input.postIds.map((postId) => ({
      postId,
      repostCount: 0,
      repostedByMe: false,
    }));
  }

  const postIds = input.postIds
    .map((value) => {
      try {
        return RepostPostId.fromString(value);
      } catch {
        return null;
      }
    })
    .filter((value): value is RepostPostId => value !== null);

  if (postIds.length === 0) {
    return input.postIds.map((postId) => ({
      postId,
      repostCount: 0,
      repostedByMe: false,
    }));
  }

  const [countMap, repostedSet] = await Promise.all([
    deps.repostRepo.countByPostIds(postIds),
    deps.repostRepo.findRepostedPostIds({ userId: viewerUserId, postIds }),
  ]);

  return input.postIds.map((postId) => ({
    postId,
    repostCount: countMap.get(postId) ?? 0,
    repostedByMe: repostedSet.has(postId),
  }));
}
