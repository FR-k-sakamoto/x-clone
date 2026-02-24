"use client";

import { useEffect, useState, useTransition } from "react";

import type { PostSearchItem } from "@/app/_application/search/searchPosts";
import type { UserSearchItem } from "@/app/_application/search/searchUsers";
import { SearchResults } from "@/app/_components/search/SearchResults";
import { useSearchInput } from "@/app/_hooks/search/useSearchInput";

type SearchApiResponse = {
  query: string;
  users: UserSearchItem[];
  posts: PostSearchItem[];
};

const EMPTY_RESULT: SearchApiResponse = {
  query: "",
  users: [],
  posts: [],
};

export function DashboardSearchPanel() {
  const { query, setQuery, isOver, maxLength } = useSearchInput("");
  const normalizedQuery = query.trim();
  const activeQuery = isOver ? "" : normalizedQuery;
  const [result, setResult] = useState<SearchApiResponse>(EMPTY_RESULT);
  const [isPending, startTransition] = useTransition();
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeQuery.length === 0) {
      return;
    }

    const controller = new AbortController();
    const timerId = setTimeout(() => {
      setFetchErrorMessage(null);
      startTransition(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(activeQuery)}`, {
            signal: controller.signal,
            cache: "no-store",
          });
          if (!res.ok) {
            throw new Error(`Search request failed: ${res.status}`);
          }
          const data = (await res.json()) as SearchApiResponse;
          if (!controller.signal.aborted) {
            setResult(data);
          }
        } catch (error: unknown) {
          if ((error as Error).name === "AbortError") {
            return;
          }
          setFetchErrorMessage("検索結果の取得に失敗しました。");
        }
      });
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timerId);
    };
  }, [activeQuery]);

  const visibleResult =
    activeQuery.length === 0
      ? EMPTY_RESULT
      : result.query === activeQuery
        ? result
        : { query: activeQuery, users: [], posts: [] };
  const errorMessage = isOver ? "検索文字数が上限を超えています。" : fetchErrorMessage;

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <label htmlFor="dashboard-search-query" className="block text-sm font-medium text-zinc-900">
        検索
      </label>
      <input
        id="dashboard-search-query"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        maxLength={maxLength}
        placeholder="ユーザー・投稿を検索"
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
      />

      <div className="flex items-center justify-between">
        <p className={`text-xs ${isOver ? "text-red-600" : "text-zinc-500"}`}>{query.length}/{maxLength}</p>
        {isPending ? <p className="text-xs text-zinc-500">Searching...</p> : null}
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <SearchResults query={visibleResult.query} users={visibleResult.users} posts={visibleResult.posts} />
    </section>
  );
}
