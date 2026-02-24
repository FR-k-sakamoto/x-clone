export type PostEngagementState = {
  likedByMe: boolean;
  likeCount: number;
  repostedByMe: boolean;
  repostCount: number;
};

function clampCount(count: number) {
  return Math.max(0, count);
}

export function toggleLikeState(state: PostEngagementState): PostEngagementState {
  const nextLikedByMe = !state.likedByMe;
  const likeDiff = nextLikedByMe ? 1 : -1;

  return {
    ...state,
    likedByMe: nextLikedByMe,
    likeCount: clampCount(state.likeCount + likeDiff),
  };
}

export function toggleRepostState(state: PostEngagementState): PostEngagementState {
  const nextRepostedByMe = !state.repostedByMe;
  const repostDiff = nextRepostedByMe ? 1 : -1;

  return {
    ...state,
    repostedByMe: nextRepostedByMe,
    repostCount: clampCount(state.repostCount + repostDiff),
  };
}
