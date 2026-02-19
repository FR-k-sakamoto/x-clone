"use client";

import { useFormStatus } from "react-dom";

import { useLikePresentation } from "@/app/_hooks/reaction/useLikePresentation";

export function LikeButton(props: { likedByMe: boolean; likeCount: number }) {
  const { pending } = useFormStatus();
  const presentation = useLikePresentation(props.likedByMe, props.likeCount);

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={presentation.ariaLabel}
      className={`text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${presentation.className}`}
    >
      <span className="inline-flex items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill={props.likedByMe ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 21s-6.716-4.348-9.167-8.154C1.002 10.012 1.73 6.386 4.794 5.1 7.043 4.156 9.438 5.01 12 7.37 14.562 5.01 16.957 4.156 19.206 5.1c3.064 1.286 3.792 4.912 1.961 7.746C18.716 16.652 12 21 12 21z" />
        </svg>
        <span>{presentation.countText}</span>
      </span>
    </button>
  );
}
