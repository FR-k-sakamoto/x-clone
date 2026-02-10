import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { signUpWithEmailPassword } from "@/app/signup/actions";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Sign up
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          メールアドレスとパスワードでアカウントを作成します。
        </p>

        <form action={signUpWithEmailPassword} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              Name
            </label>
            <input
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
              placeholder="8 characters or more"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-700">
          すでにアカウントがある場合は{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>

        <div className="mt-10 text-sm">
          <Link href="/" className="text-zinc-700 underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

