import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { LoginForm } from "@/app/_components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  const sp = (await searchParams) ?? {};
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          X Clone を利用するにはログインしてください。
        </p>

        <div className="mt-8">
          <LoginForm initialError={error ? "ログインに失敗しました。" : null} />
        </div>

        <div className="mt-6 text-sm text-zinc-700">
          アカウントが無い場合は{" "}
          <Link href="/signup" className="underline">
            Sign up
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
