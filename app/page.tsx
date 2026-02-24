import Link from "next/link";
import { getServerSession } from "next-auth";

import { getTimelinePage } from "@/app/_application/timeline/getTimelinePage";
import { AuthButtons } from "@/app/_components/auth/AuthButtons";
import { PostComposer } from "@/app/_components/post/PostComposer";
import { DashboardSearchPanel } from "@/app/_components/search/DashboardSearchPanel";
import { TimelineFeed } from "@/app/_components/timeline/TimelineFeed";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";
import { PrismaRepostRepository } from "@/app/_infrastructure/repost/PrismaRepostRepository";
import { PrismaTimelineRepository } from "@/app/_infrastructure/timeline/PrismaTimelineRepository";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const initialTimeline = session?.user
    ? await getTimelinePage(
        {
          timelineRepo: new PrismaTimelineRepository(prisma),
          likeRepo: new PrismaLikeRepository(prisma),
          repostRepo: new PrismaRepostRepository(prisma),
        },
        {
          viewerUserId: session.user.id,
          mode: "all",
          limit: 20,
        }
      )
    : {
        mode: "all" as const,
        items: [],
        nextCursor: null,
      };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">X Clone</h1>
            <p className="mt-1 text-sm text-zinc-600">Phase 3: Timeline ドメイン作業中</p>
          </div>

          <div className="flex items-center gap-4">
            <AuthButtons />
          </div>
        </header>

        {!session?.user ? (
          <main className="mt-12 rounded-xl border border-zinc-200 bg-white p-6">
            <div className="space-y-3">
              <p className="text-sm text-zinc-700">現在ログインしていません。</p>
              <Link
                href="/login"
                className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Go to login
              </Link>
            </div>
          </main>
        ) : null}

        {session?.user ? (
          <div className="mt-8 space-y-4">
            <DashboardSearchPanel />
            <PostComposer />
            <TimelineFeed
              initialItems={initialTimeline.items}
              initialCursor={initialTimeline.nextCursor}
              initialMode={initialTimeline.mode}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
