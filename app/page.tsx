import Link from "next/link";
import { getServerSession } from "next-auth";

import { AuthButtons } from "@/app/_components/auth/AuthButtons";
import { PostComposer } from "@/app/_components/post/PostComposer";
import { PostList } from "@/app/_components/post/PostList";
import { getRecentPosts } from "@/app/_application/post/getRecentPosts";
import { getLikeSummaries } from "@/app/_application/reaction/getLikeSummaries";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaPostRepository } from "@/app/_infrastructure/post/PrismaPostRepository";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = session?.user
    ? await getRecentPosts({ postRepo: new PrismaPostRepository(prisma) }, { limit: 30 })
    : [];
  const likeSummaries = session?.user
    ? await getLikeSummaries(
        { likeRepo: new PrismaLikeRepository(prisma) },
        {
          viewerUserId: session.user.id,
          postIds: posts.map((post) => post.getId().toString()),
        }
      )
    : [];
  const likeSummaryByPostId = new Map(
    likeSummaries.map((summary) => [summary.postId, summary])
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
              posts={posts.map((post) => ({
                id: post.getId().toString(),
                authorId: post.getAuthorId().toString(),
                body: post.getBody().toString(),
                createdAtIso: post.getCreatedAt().toISOString(),
                likeCount: likeSummaryByPostId.get(post.getId().toString())?.likeCount ?? 0,
                likedByMe: likeSummaryByPostId.get(post.getId().toString())?.likedByMe ?? false,
              }))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
