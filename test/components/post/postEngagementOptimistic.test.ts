import { describe, expect, it } from "vitest";

import {
  toggleLikeState,
  toggleRepostState,
  type PostEngagementState,
} from "@/app/_components/post/postEngagementOptimistic";

function buildState(overrides: Partial<PostEngagementState> = {}): PostEngagementState {
  return {
    likedByMe: false,
    likeCount: 3,
    repostedByMe: false,
    repostCount: 2,
    ...overrides,
  };
}

describe("toggleLikeState", () => {
  it("いいね時にフラグを反転し、件数を加算する", () => {
    const next = toggleLikeState(buildState({ likedByMe: false, likeCount: 3 }));
    expect(next).toMatchObject({ likedByMe: true, likeCount: 4 });
  });

  it("いいね解除時に件数が 0 未満にならない", () => {
    const next = toggleLikeState(buildState({ likedByMe: true, likeCount: 0 }));
    expect(next).toMatchObject({ likedByMe: false, likeCount: 0 });
  });
});

describe("toggleRepostState", () => {
  it("リポスト時にフラグを反転し、件数を加算する", () => {
    const next = toggleRepostState(buildState({ repostedByMe: false, repostCount: 2 }));
    expect(next).toMatchObject({ repostedByMe: true, repostCount: 3 });
  });

  it("リポスト解除時に件数が 0 未満にならない", () => {
    const next = toggleRepostState(buildState({ repostedByMe: true, repostCount: 0 }));
    expect(next).toMatchObject({ repostedByMe: false, repostCount: 0 });
  });
});
