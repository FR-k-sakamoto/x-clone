import Link from "next/link";
import { getServerSession } from "next-auth";

import { getFollowSummaries } from "@/app/_application/follow/getFollowSummaries";
import { getUserProfileByHandle } from "@/app/_application/user-profile/getUserProfileByHandle";
import { FollowToggleButton } from "@/app/_components/follow/FollowToggleButton";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaFollowRepository } from "@/app/_infrastructure/follow/PrismaFollowRepository";
import { PrismaUserProfileRepository } from "@/app/_infrastructure/user-profile/PrismaUserProfileRepository";

export default async function UserProfilePage(props: { params: Promise<{ handle: string }> }) {
  const { handle } = await props.params;
  const session = await getServerSession(authOptions);

  const userProfileRepo = new PrismaUserProfileRepository(prisma);
  const result = await getUserProfileByHandle({ userProfileRepo }, { handle });

  if (!result.ok) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-xl px-6 py-16">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Profile</h1>
          <p className="mt-4 text-sm text-red-600">{result.message}</p>
          <Link href="/" className="mt-6 inline-block text-sm text-zinc-700 underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const viewerUserId = session?.user?.id ?? null;
  const isSelf = viewerUserId === result.profile.userId;

  const followedByMe = viewerUserId && !isSelf
    ? (
        await getFollowSummaries(
          { followRepo: new PrismaFollowRepository(prisma) },
          {
            viewerUserId,
            targetUserIds: [result.profile.userId],
          }
        )
      )[0]?.followedByMe ?? false
    : false;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{result.profile.name}</h1>
              <p className="mt-1 font-mono text-sm text-zinc-600">@{result.profile.handle}</p>
            </div>
            {viewerUserId && !isSelf ? (
              <FollowToggleButton
                followingId={result.profile.userId}
                initialFollowedByMe={followedByMe}
                profileHandle={result.profile.handle}
              />
            ) : null}
          </div>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
            {result.profile.bio || "自己紹介は未設定です。"}
          </p>
        </div>

        {!viewerUserId ? (
          <p className="mt-4 text-xs text-zinc-500">
            フォローするには <Link href="/login" className="underline">ログイン</Link> してください。
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-4 text-sm">
          <Link href="/" className="text-zinc-700 underline">Back to home</Link>
          {isSelf ? <Link href="/profile" className="text-zinc-700 underline">Edit profile</Link> : null}
        </div>
      </div>
    </div>
  );
}
