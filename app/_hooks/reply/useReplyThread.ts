"use client";

import { useCallback, useEffect, useState } from "react";

import type { ReplyThreadNode } from "@/app/_domain/reply/ReplyThread";

type ReplyThreadResponse = {
  ok: true;
  rootPost: ReplyThreadNode;
  replies: ReplyThreadNode[];
};

export function useReplyThread(params: {
  rootPostId: string;
  initialRootPost: ReplyThreadNode;
  initialReplies: ReplyThreadNode[];
}) {
  const [rootPost, setRootPost] = useState(params.initialRootPost);
  const [replies, setReplies] = useState(params.initialReplies);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = new URL("/api/reply/thread", window.location.origin);
      url.searchParams.set("postId", params.rootPostId);

      const response = await fetch(url, { method: "GET", cache: "no-store" });
      if (!response.ok) {
        throw new Error("スレッドの取得に失敗しました。");
      }

      const body = (await response.json()) as ReplyThreadResponse;
      setRootPost(body.rootPost);
      setReplies(body.replies);
    } catch {
      setErrorMessage("スレッドの更新に失敗しました。時間をおいて再試行してください。");
    } finally {
      setIsLoading(false);
    }
  }, [params.rootPostId]);

  useEffect(() => {
    const onRefresh = (event: Event) => {
      const custom = event as CustomEvent<{ rootPostId?: string }>;
      if (custom.detail?.rootPostId !== params.rootPostId) return;
      void refresh();
    };

    window.addEventListener("thread:refresh", onRefresh);
    return () => window.removeEventListener("thread:refresh", onRefresh);
  }, [params.rootPostId, refresh]);

  return { rootPost, replies, isLoading, errorMessage, refresh };
}
