"use client";

import { useMemo } from "react";

export function useLikePresentation(likedByMe: boolean, likeCount: number) {
  return useMemo(
    () => ({
      ariaLabel: likedByMe ? "いいねを解除" : "いいねする",
      countText: `(${likeCount})`,
      className: likedByMe
        ? "text-rose-600 hover:text-rose-700"
        : "text-zinc-600 hover:text-zinc-900",
    }),
    [likedByMe, likeCount]
  );
}
