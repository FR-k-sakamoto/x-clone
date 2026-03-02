"use client";

import { useMemo, useState } from "react";

import { ReplyBody } from "@/app/_domain/reply/ReplyBody";

export function useReplyDraft(initialValue = "") {
  const [body, setBody] = useState(initialValue);
  const maxLength = ReplyBody.getMaxLength();

  const summary = useMemo(() => {
    const remaining = maxLength - body.length;
    return {
      remaining,
      isOver: remaining < 0,
      isEmpty: body.trim().length === 0,
    };
  }, [body, maxLength]);

  return {
    body,
    setBody,
    maxLength,
    ...summary,
  };
}
