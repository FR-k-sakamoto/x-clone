"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthButtons() {
  const { data, status } = useSession();

  if (status === "loading") return null;

  const isAuthed = !!data?.user;

  return (
    <div className="flex items-center gap-3">
      {!isAuthed ? (
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </Link>
      ) : (
        <>
          <Link
            href="/profile"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
