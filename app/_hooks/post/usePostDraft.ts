"use client";

import { useMemo, useState } from "react";

const MAX_LENGTH = 160;

export function usePostDraft(initialValue = "") {
  const [body, setBody] = useState(initialValue);

  const length = useMemo(() => [...body].length, [body]);
  const remaining = MAX_LENGTH - length;
  const isOver = remaining < 0;
  const isEmpty = body.trim().length === 0;

  return {
    body,
    setBody,
    length,
    remaining,
    isOver,
    isEmpty,
    maxLength: MAX_LENGTH,
  };
}
