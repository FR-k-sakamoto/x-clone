"use client";

import Link from "next/link";

import type { ReplyThreadNode } from "@/app/_domain/reply/ReplyThread";
import { useReplyThread } from "@/app/_hooks/reply/useReplyThread";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function ReplyThread(props: {
  rootPostId: string;
  initialRootPost: ReplyThreadNode;
  initialReplies: ReplyThreadNode[];
}) {
  const thread = useReplyThread({
    rootPostId: props.rootPostId,
    initialRootPost: props.initialRootPost,
    initialReplies: props.initialReplies,
  });

  return (
    <div className="space-y-3">
      <article className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <Link href={`/u/${thread.rootPost.authorHandle}`} className="font-mono hover:underline">
            @{thread.rootPost.authorHandle}
          </Link>
          <time dateTime={thread.rootPost.createdAtIso}>{formatDate(thread.rootPost.createdAtIso)}</time>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">{thread.rootPost.body}</p>
      </article>

      {thread.replies.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          まだ返信がありません。
        </div>
      ) : (
        <ul className="space-y-3">
          {thread.replies.map((reply) => (
            <li
              key={reply.postId}
              className="rounded-xl border border-zinc-200 bg-white p-4"
              style={{ marginLeft: `${Math.min(reply.depth, 5) * 12}px` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                <Link href={`/u/${reply.authorHandle}`} className="font-mono hover:underline">
                  @{reply.authorHandle}
                </Link>
                <time dateTime={reply.createdAtIso}>{formatDate(reply.createdAtIso)}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">{reply.body}</p>
            </li>
          ))}
        </ul>
      )}

      {thread.isLoading ? <p className="text-center text-xs text-zinc-500">更新中...</p> : null}

      {thread.errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs text-red-700">
          <p>{thread.errorMessage}</p>
          <button
            type="button"
            onClick={thread.refresh}
            className="mt-2 rounded-md border border-red-300 px-3 py-1 text-xs font-medium hover:bg-red-100"
          >
            再試行
          </button>
        </div>
      ) : null}
    </div>
  );
}
