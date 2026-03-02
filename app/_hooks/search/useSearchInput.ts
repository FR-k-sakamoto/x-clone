"use client";

import { useMemo, useState } from "react";

import { SearchQuery } from "@/app/_domain/search/SearchQuery";

export function useSearchInput(initialValue: string) {
  const [query, setQuery] = useState(initialValue);
  const maxLength = SearchQuery.getMaxLength();

  const summary = useMemo(() => {
    const remaining = maxLength - query.length;
    return {
      remaining,
      isOver: remaining < 0,
      isEmpty: query.trim().length === 0,
    };
  }, [maxLength, query]);

  return {
    query,
    setQuery,
    maxLength,
    ...summary,
  };
}
