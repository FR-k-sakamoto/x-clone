"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useSearchInput } from "@/app/_hooks/search/useSearchInput";

export function SearchForm(props: { initialQuery: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { query, setQuery, isOver, isEmpty, maxLength } = useSearchInput(props.initialQuery);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isOver) return;

    const nextQuery = query.trim();
    startTransition(() => {
      if (nextQuery.length === 0) {
        router.push("/search");
      } else {
        router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <label htmlFor="search-query" className="block text-sm font-medium text-zinc-900">
        検索
      </label>
      <input
        id="search-query"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        maxLength={maxLength}
        placeholder="ユーザー・投稿を検索"
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
      />
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isOver ? "text-red-600" : "text-zinc-500"}`}>{query.length}/{maxLength}</p>
        <button
          type="submit"
          disabled={isPending || isOver || isEmpty}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
