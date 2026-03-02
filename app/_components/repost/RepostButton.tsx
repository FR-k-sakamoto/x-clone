"use client";

import { useFormStatus } from "react-dom";

import { useRepostPresentation } from "@/app/_hooks/repost/useRepostPresentation";

export function RepostButton(props: { repostedByMe: boolean; repostCount: number }) {
  const { pending } = useFormStatus();
  const presentation = useRepostPresentation(props.repostedByMe, props.repostCount);

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
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10l-3-3" />
          <path d="M17 17H7l3 3" />
          <path d="M17 7v7" />
          <path d="M7 17v-7" />
        </svg>
        <span>{presentation.countText}</span>
      </span>
    </button>
  );
}
