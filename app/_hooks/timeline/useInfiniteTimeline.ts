"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { TimelineListItem } from "@/app/_application/timeline/getTimelinePage";
import { TimelineMode } from "@/app/_domain/timeline/TimelineMode";

type TimelineApiResponse = {
  mode: "all" | "following";
  items: TimelineListItem[];
  nextCursor: string | null;
};

function mergeByEventKey(params: {
  previous: TimelineListItem[];
  incoming: TimelineListItem[];
  strategy: "append" | "prepend";
}) {
  if (params.strategy === "append") {
    const seen = new Set(params.previous.map((item) => item.eventKey));
    return [...params.previous, ...params.incoming.filter((item) => !seen.has(item.eventKey))];
  }

  const seen = new Set(params.incoming.map((item) => item.eventKey));
  return [...params.incoming, ...params.previous.filter((item) => !seen.has(item.eventKey))];
}

export function useInfiniteTimeline(params: {
  initialItems: TimelineListItem[];
  initialCursor: string | null;
  initialMode: "all" | "following";
}) {
  const [mode, setModeState] = useState<"all" | "following">(params.initialMode);
  const [items, setItems] = useState<TimelineListItem[]>(params.initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(params.initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = nextCursor !== null;

  const fetchPage = useCallback(
    async ({
      cursor,
      nextMode,
      strategy,
    }: {
      cursor: string | null;
      nextMode: "all" | "following";
      strategy: "replace" | "append" | "prepend";
    }) => {
      if (isLoading) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const url = new URL("/api/timeline", window.location.origin);
        url.searchParams.set("mode", nextMode);
        if (cursor) url.searchParams.set("cursor", cursor);

        const response = await fetch(url, { method: "GET", cache: "no-store" });
        if (!response.ok) {
          throw new Error("タイムラインの取得に失敗しました。");
        }

        const body = (await response.json()) as TimelineApiResponse;
        setItems((prev) => {
          if (strategy === "replace") return body.items;
          return mergeByEventKey({
            previous: prev,
            incoming: body.items,
            strategy,
          });
        });
        setNextCursor(body.nextCursor);
      } catch {
        setErrorMessage("タイムラインの読み込みに失敗しました。時間をおいて再試行してください。");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    void fetchPage({ cursor: nextCursor, nextMode: mode, strategy: "append" });
  }, [fetchPage, hasMore, isLoading, mode, nextCursor]);

  const setMode = useCallback(
    (value: "all" | "following") => {
      const parsed = TimelineMode.fromString(value).toString();
      if (parsed === mode) return;
      setModeState(parsed);
      setItems([]);
      setNextCursor(null);
      void fetchPage({ cursor: null, nextMode: parsed, strategy: "replace" });
    },
    [fetchPage, mode]
  );

  useEffect(() => {
    const onRefreshTop = () => {
      void fetchPage({ cursor: null, nextMode: mode, strategy: "prepend" });
    };

    window.addEventListener("timeline:refresh-top", onRefreshTop);
    return () => window.removeEventListener("timeline:refresh-top", onRefreshTop);
  }, [fetchPage, mode]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadMore();
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  const modeLabel = useMemo(
    () => ({
      all: "すべて",
      following: "フォロー中",
    }),
    []
  );

  return {
    mode,
    modeLabel,
    setMode,
    items,
    hasMore,
    isLoading,
    errorMessage,
    sentinelRef,
    retry: loadMore,
  };
}
