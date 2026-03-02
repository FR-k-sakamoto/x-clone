"use client";

import { useMemo } from "react";

export function useRepostPresentation(repostedByMe: boolean, repostCount: number) {
  return useMemo(
    () => ({
      ariaLabel: repostedByMe ? "リポストを解除" : "リポストする",
      countText: `(${repostCount})`,
      className: repostedByMe
        ? "text-emerald-600 hover:text-emerald-700"
        : "text-zinc-600 hover:text-zinc-900",
    }),
    [repostedByMe, repostCount]
  );
}
