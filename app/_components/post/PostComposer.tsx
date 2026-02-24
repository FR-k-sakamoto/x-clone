"use client";

import { useActionState, useEffect } from "react";

import { createPostAction } from "@/app/_actions/post/actions";
import type { CreatePostState } from "@/app/_actions/post/actions";
import { usePostDraft } from "@/app/_hooks/post/usePostDraft";

const initialState: CreatePostState = { ok: false, message: null };

export function PostComposer() {
  const [state, action, pending] = useActionState(createPostAction, initialState);
  const { body, setBody, remaining, isOver, isEmpty, maxLength } = usePostDraft();

  useEffect(() => {
    if (!pending && state.ok) {
      setBody("");
      window.dispatchEvent(new CustomEvent("timeline:refresh-top"));
    }
  }, [pending, setBody, state.ok]);

  const disabled = pending || isOver || isEmpty;

  return (
    <form action={action} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <label className="block text-sm font-medium text-zinc-900">いまどうしてる？</label>
      <textarea
        name="body"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
        placeholder="160文字以内で投稿"
      />

      <div className="flex items-center justify-between">
        <p className={`text-xs ${isOver ? "text-red-600" : "text-zinc-500"}`}>
          {remaining}/{maxLength}
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post"}
        </button>
      </div>

      {state.message ? <p className="text-sm text-red-600">{state.message}</p> : null}
    </form>
  );
}
