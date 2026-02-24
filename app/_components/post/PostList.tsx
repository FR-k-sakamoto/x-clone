import Link from "next/link";

import { PostEngagementActions } from "@/app/_components/post/PostEngagementActions";

export type PostListItem = {
  eventKey: string;
  postId: string;
  eventCreatedAtIso: string;
  eventType: "post" | "repost";
  reposterHandle: string | null;
  likeCount: number;
  likedByMe: boolean;
  repostCount: number;
  repostedByMe: boolean;
};

export type PostListPostData = {
  authorId: string;
  authorHandle: string;
  body: string;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function PostList({
  events,
  postsById,
}: {
  events: PostListItem[];
  postsById: Record<string, PostListPostData>;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        まだ投稿がありません。
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const post = postsById[event.postId];
        if (!post) return null;

        return (
          <li key={event.eventKey} className="rounded-xl border border-zinc-200 bg-white p-4">
            {event.eventType === "repost" && event.reposterHandle ? (
              <p className="mb-2 text-xs font-medium text-emerald-700">
                @{event.reposterHandle} がリポスト
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <Link href={`/u/${post.authorHandle}`} className="font-mono hover:underline">
                @{post.authorHandle}
              </Link>
              <time dateTime={event.eventCreatedAtIso}>{formatDate(event.eventCreatedAtIso)}</time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">{post.body}</p>
            <div className="mt-3">
              <PostEngagementActions
                postId={event.postId}
                initialLikedByMe={event.likedByMe}
                initialLikeCount={event.likeCount}
                initialRepostedByMe={event.repostedByMe}
                initialRepostCount={event.repostCount}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
