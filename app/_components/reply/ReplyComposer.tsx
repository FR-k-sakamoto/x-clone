"use client";

import { useActionState, useEffect } from "react";

import { createReplyAction } from "@/app/_actions/reply/actions";
import type { CreateReplyState } from "@/app/_actions/reply/actions";
import { useReplyDraft } from "@/app/_hooks/reply/useReplyDraft";

const initialState: CreateReplyState = { ok: false, message: null };

export function ReplyComposer(props: { parentPostId: string }) {
  const [state, action, pending] = useActionState(createReplyAction, initialState);
  const { body, setBody, remaining, isOver, isEmpty, maxLength } = useReplyDraft();

  useEffect(() => {
    if (!pending && state.ok) {
      setBody("");
      window.dispatchEvent(
        new CustomEvent("thread:refresh", {
          detail: { rootPostId: props.parentPostId },
        })
      );
    }
  }, [pending, props.parentPostId, setBody, state.ok]);

  const disabled = pending || isOver || isEmpty;

  return (
    <form action={action} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <input type="hidden" name="parentPostId" value={props.parentPostId} />
      <label className="block text-sm font-medium text-zinc-900">返信する</label>
      <textarea
        name="body"
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
        placeholder="160文字以内で返信"
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
          {pending ? "Replying..." : "Reply"}
        </button>
      </div>

      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
