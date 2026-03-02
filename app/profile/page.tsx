import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getUserProfile } from "@/app/_application/user-profile/getUserProfile";
import { ProfileForm } from "@/app/_components/user-profile/ProfileForm";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { PrismaUserProfileRepository } from "@/app/_infrastructure/user-profile/PrismaUserProfileRepository";
import { prisma } from "@/app/_infrastructure/db/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userProfileRepo = new PrismaUserProfileRepository(prisma);
  const result = await getUserProfile({ userProfileRepo }, { userId: session.user.id });
  if (!result.ok) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Profile</h1>
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
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Edit profile</h1>
        <p className="mt-2 text-sm text-zinc-600">表示名、ハンドル、自己紹介を更新できます。</p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <ProfileForm
            initialName={result.profile.name}
            initialHandle={result.profile.handle}
            initialBio={result.profile.bio}
          />
        </div>

        <Link href="/" className="mt-6 inline-block text-sm text-zinc-700 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
