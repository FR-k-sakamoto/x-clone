"use client";

import { useMemo } from "react";

export function useFollowPresentation(followedByMe: boolean) {
  return useMemo(
    () => ({
      ariaLabel: followedByMe ? "フォローを解除" : "フォローする",
      text: followedByMe ? "Following" : "Follow",
      className: followedByMe
        ? "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
        : "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800",
    }),
    [followedByMe]
  );
}
