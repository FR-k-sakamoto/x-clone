"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";

import { toggleLikeAction } from "@/app/_actions/reaction/actions";
import { toggleRepostAction } from "@/app/_actions/repost/actions";
import {
  type PostEngagementState,
  toggleLikeState,
  toggleRepostState,
} from "@/app/_components/post/postEngagementOptimistic";
import { useLikePresentation } from "@/app/_hooks/reaction/useLikePresentation";
import { useRepostPresentation } from "@/app/_hooks/repost/useRepostPresentation";

type OptimisticAction = { type: "toggle-like" } | { type: "toggle-repost" };

export function PostEngagementActions(props: {
  postId: string;
  initialLikedByMe: boolean;
  initialLikeCount: number;
  initialRepostedByMe: boolean;
  initialRepostCount: number;
}) {
  const [state, setState] = useState<PostEngagementState>({
    likedByMe: props.initialLikedByMe,
    likeCount: props.initialLikeCount,
    repostedByMe: props.initialRepostedByMe,
    repostCount: props.initialRepostCount,
  });
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticState, applyOptimistic] = useOptimistic(
    state,
    (currentState, action: OptimisticAction): PostEngagementState => {
      if (action.type === "toggle-like") return toggleLikeState(currentState);
      return toggleRepostState(currentState);
    }
  );
  const likePresentation = useLikePresentation(optimisticState.likedByMe, optimisticState.likeCount);
  const repostPresentation = useRepostPresentation(
    optimisticState.repostedByMe,
    optimisticState.repostCount
  );

  const onLikeClick = () => {
    if (isPending) return;

    const intent = optimisticState.likedByMe ? "unlike" : "like";
    applyOptimistic({ type: "toggle-like" });
    setFetchErrorMessage(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("postId", props.postId);
        formData.set("intent", intent);
        await toggleLikeAction(formData);
        setState((currentState) => toggleLikeState(currentState));
      } catch {
        setState((currentState) => ({ ...currentState }));
        setFetchErrorMessage("リアクション更新に失敗しました。");
      }
    });
  };

  const onRepostClick = () => {
    if (isPending) return;

    const intent = optimisticState.repostedByMe ? "unrepost" : "repost";
    applyOptimistic({ type: "toggle-repost" });
    setFetchErrorMessage(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("postId", props.postId);
        formData.set("intent", intent);
        await toggleRepostAction(formData);
        setState((currentState) => toggleRepostState(currentState));
      } catch {
        setState((currentState) => ({ ...currentState }));
        setFetchErrorMessage("リポスト更新に失敗しました。");
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onLikeClick}
          disabled={isPending}
          aria-label={likePresentation.ariaLabel}
          className={`text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${likePresentation.className}`}
        >
          <span className="inline-flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill={optimisticState.likedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 21s-6.716-4.348-9.167-8.154C1.002 10.012 1.73 6.386 4.794 5.1 7.043 4.156 9.438 5.01 12 7.37 14.562 5.01 16.957 4.156 19.206 5.1c3.064 1.286 3.792 4.912 1.961 7.746C18.716 16.652 12 21 12 21z" />
            </svg>
            <span>{likePresentation.countText}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onRepostClick}
          disabled={isPending}
          aria-label={repostPresentation.ariaLabel}
          className={`text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${repostPresentation.className}`}
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
            <span>{repostPresentation.countText}</span>
          </span>
        </button>

        <Link
          href={`/post/${props.postId}`}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          返信を見る
        </Link>
      </div>

      {fetchErrorMessage ? (
        <p className="text-xs text-red-600" role="alert">
          {fetchErrorMessage}
        </p>
      ) : null}
    </div>
  );
}
