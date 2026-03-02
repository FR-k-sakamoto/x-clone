import Link from "next/link";

import type { PostSearchItem } from "@/app/_application/search/searchPosts";
import type { UserSearchItem } from "@/app/_application/search/searchUsers";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function SearchResults(props: { query: string; users: UserSearchItem[]; posts: PostSearchItem[] }) {
  if (props.query.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
        キーワードを入力して検索してください。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Users ({props.users.length})</h2>
        {props.users.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">一致するユーザーは見つかりませんでした。</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {props.users.map((user) => (
              <li key={user.userId} className="rounded-lg border border-zinc-200 p-3">
                <Link href={`/u/${user.handle}`} className="font-mono text-sm text-zinc-900 hover:underline">
                  @{user.handle}
                </Link>
                <p className="mt-1 text-sm font-medium text-zinc-900">{user.name}</p>
                <p className="mt-1 text-xs text-zinc-600">{user.bio || "自己紹介は未設定です。"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Posts ({props.posts.length})</h2>
        {props.posts.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">一致する投稿は見つかりませんでした。</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {props.posts.map((post) => (
              <li key={post.postId} className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <Link href={`/u/${post.authorHandle}`} className="font-mono hover:underline">
                    @{post.authorHandle}
                  </Link>
                  <time dateTime={post.createdAtIso}>{formatDate(post.createdAtIso)}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-900">{post.body}</p>
                <Link href={`/post/${post.postId}`} className="mt-2 inline-block text-xs font-medium text-zinc-600 hover:text-zinc-900">
                  スレッドを見る
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
