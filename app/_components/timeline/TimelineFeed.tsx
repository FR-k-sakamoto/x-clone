"use client";

import { useMemo } from "react";

import type { TimelineListItem } from "@/app/_application/timeline/getTimelinePage";
import { PostList } from "@/app/_components/post/PostList";
import { useInfiniteTimeline } from "@/app/_hooks/timeline/useInfiniteTimeline";

export function TimelineFeed(props: {
  initialItems: TimelineListItem[];
  initialCursor: string | null;
  initialMode: "all" | "following";
}) {
  const {
    mode,
    modeLabel,
    setMode,
    items,
    isLoading,
    errorMessage,
    sentinelRef,
    retry,
  } = useInfiniteTimeline({
    initialItems: props.initialItems,
    initialCursor: props.initialCursor,
    initialMode: props.initialMode,
  });

  const events = useMemo(
    () =>
      items.map((item) => ({
        eventKey: item.eventKey,
        postId: item.postId,
        eventCreatedAtIso: item.eventCreatedAtIso,
        eventType: item.eventType,
        reposterHandle: item.reposterHandle,
        likeCount: item.likeCount,
        likedByMe: item.likedByMe,
        repostCount: item.repostCount,
        repostedByMe: item.repostedByMe,
      })),
    [items]
  );

  const postsById = useMemo(
    () =>
      Object.fromEntries(
        items.map((item) => [
          item.postId,
          {
            authorId: item.authorId,
            authorHandle: item.authorHandle,
            body: item.body,
          },
        ])
      ),
    [items]
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            mode === "all"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {modeLabel.all}
        </button>
        <button
          type="button"
          onClick={() => setMode("following")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            mode === "following"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {modeLabel.following}
        </button>
      </div>

      <PostList events={events} postsById={postsById} />

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {isLoading ? (
        <p className="text-center text-xs text-zinc-500">読み込み中...</p>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs text-red-700">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-2 rounded-md border border-red-300 px-3 py-1 text-xs font-medium hover:bg-red-100"
          >
            再試行
          </button>
        </div>
      ) : null}
    </div>
  );
}
