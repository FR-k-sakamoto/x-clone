import { toggleLikeAction } from "@/app/_actions/reaction/actions";
import { LikeButton } from "@/app/_components/reaction/LikeButton";

export type PostListItem = {
  id: string;
  authorId: string;
  body: string;
  createdAtIso: string;
  likeCount: number;
  likedByMe: boolean;
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

export function PostList({ posts }: { posts: PostListItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        まだ投稿がありません。
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono">{post.authorId.slice(0, 8)}</span>
            <time dateTime={post.createdAtIso}>{formatDate(post.createdAtIso)}</time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">{post.body}</p>
          <form action={toggleLikeAction} className="mt-3">
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="intent" value={post.likedByMe ? "unlike" : "like"} />
            <LikeButton likedByMe={post.likedByMe} likeCount={post.likeCount} />
          </form>
        </li>
      ))}
    </ul>
  );
}
