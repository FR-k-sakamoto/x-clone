"use client";

import { useFollowPresentation } from "@/app/_hooks/follow/useFollowPresentation";

export function FollowButton(props: {
  followedByMe: boolean;
  pending?: boolean;
  onClick?: () => void;
}) {
  const presentation = useFollowPresentation(props.followedByMe);

  return (
    <button
      type="button"
      disabled={props.pending}
      onClick={props.onClick}
      aria-label={presentation.ariaLabel}
      className={`rounded-full border px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${presentation.className}`}
    >
      {presentation.text}
    </button>
  );
}
