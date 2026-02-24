import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { SignupForm } from "@/app/_components/auth/SignupForm";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Sign up
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          メールアドレスとパスワードでアカウントを作成します。
        </p>

        <SignupForm />

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
