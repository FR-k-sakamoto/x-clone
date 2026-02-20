import Link from "next/link";
import { getServerSession } from "next-auth";

import { AuthButtons } from "@/app/_components/auth/AuthButtons";
import { PostComposer } from "@/app/_components/post/PostComposer";
import { PostList } from "@/app/_components/post/PostList";
import { getRecentPosts } from "@/app/_application/post/getRecentPosts";
import { getLikeSummaries } from "@/app/_application/reaction/getLikeSummaries";
import { getRecentRepostTimelineEvents } from "@/app/_application/repost/getRecentRepostTimelineEvents";
import { getRepostSummaries } from "@/app/_application/repost/getRepostSummaries";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaPostRepository } from "@/app/_infrastructure/post/PrismaPostRepository";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";
import { PrismaRepostRepository } from "@/app/_infrastructure/repost/PrismaRepostRepository";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const [posts, repostEvents] = session?.user
    ? await Promise.all([
        getRecentPosts({ postRepo: new PrismaPostRepository(prisma) }, { limit: 30 }),
        getRecentRepostTimelineEvents(
          { repostRepo: new PrismaRepostRepository(prisma) },
          { limit: 30 }
        ),
      ])
    : [[], []];

  const timelineItems = [...posts.map((post) => ({
    postId: post.getId().toString(),
    eventCreatedAt: post.getCreatedAt(),
    eventType: "post" as const,
    reposterHandle: null as string | null,
  })), ...repostEvents.map((event) => ({
    postId: event.postId,
    eventCreatedAt: event.repostedAt,
    eventType: "repost" as const,
    reposterHandle: event.reposter.handle,
  }))].sort((a, b) => b.eventCreatedAt.getTime() - a.eventCreatedAt.getTime()).slice(0, 40);

  const postDataByIdMap = new Map<string, { authorId: string; body: string }>();
  for (const post of posts) {
    postDataByIdMap.set(post.getId().toString(), {
      authorId: post.getAuthorId().toString(),
      body: post.getBody().toString(),
    });
  }
  for (const event of repostEvents) {
    if (!postDataByIdMap.has(event.postId)) {
      postDataByIdMap.set(event.postId, {
        authorId: event.post.authorId,
        body: event.post.body,
      });
    }
  }
  const postsById = Object.fromEntries(postDataByIdMap);

  const postIds = Array.from(new Set(timelineItems.map((item) => item.postId)));
  const [likeSummaries, repostSummaries] = session?.user
    ? await Promise.all([
        getLikeSummaries(
          { likeRepo: new PrismaLikeRepository(prisma) },
          {
            viewerUserId: session.user.id,
            postIds,
          }
        ),
        getRepostSummaries(
          { repostRepo: new PrismaRepostRepository(prisma) },
          {
            viewerUserId: session.user.id,
            postIds,
          }
        ),
      ])
    : [[], []];
  const likeSummaryByPostId = new Map(
    likeSummaries.map((summary) => [summary.postId, summary])
  );
  const repostSummaryByPostId = new Map(
    repostSummaries.map((summary) => [summary.postId, summary])
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              X Clone
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Phase 3: Post ドメイン作業中
            </p>
          </div>

          <AuthButtons />
        </header>

        <main className="mt-12 rounded-xl border border-zinc-200 bg-white p-6">
          {!session?.user ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-700">
                現在ログインしていません。
              </p>
              <Link
                href="/login"
                className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-zinc-700">ログイン中</p>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">id</dt>
                  <dd className="font-mono text-zinc-900">
                    {session.user.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">handle</dt>
                  <dd className="font-mono text-zinc-900">
                    {session.user.handle ?? "(not set)"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">name</dt>
                  <dd className="text-zinc-900">{session.user.name}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">email</dt>
                  <dd className="text-zinc-900">{session.user.email}</dd>
                </div>
              </dl>
            </div>
          )}
        </main>

        {session?.user ? (
          <div className="mt-8 space-y-4">
            <PostComposer />
            <PostList
              events={timelineItems.map((item) => ({
                eventKey:
                  item.eventType === "repost"
                    ? `repost:${item.postId}:${item.reposterHandle ?? "unknown"}:${item.eventCreatedAt.toISOString()}`
                    : `post:${item.postId}`,
                postId: item.postId,
                eventCreatedAtIso: item.eventCreatedAt.toISOString(),
                eventType: item.eventType,
                reposterHandle: item.reposterHandle,
                likeCount: likeSummaryByPostId.get(item.postId)?.likeCount ?? 0,
                likedByMe: likeSummaryByPostId.get(item.postId)?.likedByMe ?? false,
                repostCount: repostSummaryByPostId.get(item.postId)?.repostCount ?? 0,
                repostedByMe: repostSummaryByPostId.get(item.postId)?.repostedByMe ?? false,
              }))}
              postsById={postsById}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
