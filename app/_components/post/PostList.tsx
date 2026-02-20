import { toggleLikeAction } from "@/app/_actions/reaction/actions";
import { LikeButton } from "@/app/_components/reaction/LikeButton";
import { toggleRepostAction } from "@/app/_actions/repost/actions";
import { RepostButton } from "@/app/_components/repost/RepostButton";

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
  body: string;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono">{post.authorId.slice(0, 8)}</span>
              <time dateTime={event.eventCreatedAtIso}>{formatDate(event.eventCreatedAtIso)}</time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">{post.body}</p>
            <div className="mt-3 flex items-center gap-4">
              <form action={toggleLikeAction}>
                <input type="hidden" name="postId" value={event.postId} />
                <input type="hidden" name="intent" value={event.likedByMe ? "unlike" : "like"} />
                <LikeButton likedByMe={event.likedByMe} likeCount={event.likeCount} />
              </form>
              <form action={toggleRepostAction}>
                <input type="hidden" name="postId" value={event.postId} />
                <input
                  type="hidden"
                  name="intent"
                  value={event.repostedByMe ? "unrepost" : "repost"}
                />
                <RepostButton repostedByMe={event.repostedByMe} repostCount={event.repostCount} />
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
