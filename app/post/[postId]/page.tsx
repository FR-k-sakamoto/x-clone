import Link from "next/link";
import { getServerSession } from "next-auth";

import { getReplyThread } from "@/app/_application/reply/getReplyThread";
import { ReplyComposer } from "@/app/_components/reply/ReplyComposer";
import { ReplyThread } from "@/app/_components/reply/ReplyThread";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaReplyRepository } from "@/app/_infrastructure/reply/PrismaReplyRepository";

export default async function PostDetailPage(props: { params: Promise<{ postId: string }> }) {
  const { postId } = await props.params;
  const session = await getServerSession(authOptions);

  const result = await getReplyThread(
    { replyRepo: new PrismaReplyRepository(prisma) },
    { rootPostId: postId }
  );

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Post</h1>
          <p className="mt-4 text-sm text-red-600">{result.message}</p>
          <Link href="/" className="mt-6 inline-block text-sm text-zinc-700 underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Thread</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">
            Back to home
          </Link>
        </header>

        {session?.user ? <ReplyComposer parentPostId={result.rootPost.postId} /> : null}

        {!session?.user ? (
          <p className="text-xs text-zinc-500">
            返信するには <Link href="/login" className="underline">ログイン</Link> してください。
          </p>
        ) : null}

        <ReplyThread
          rootPostId={result.rootPost.postId}
          initialRootPost={result.rootPost}
          initialReplies={result.replies}
        />
      </div>
    </div>
  );
}
