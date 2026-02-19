"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({
  initialError,
}: {
  initialError?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  const disabled = useMemo(
    () => submitting || email.trim().length === 0 || password.length === 0,
    [submitting, email, password]
  );

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const res = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/",
            redirect: false,
          });
          if (!res || res.error) {
            setError("メールアドレスまたはパスワードが違います。");
            setSubmitting(false);
            return;
          }
          window.location.href = res.url ?? "/";
        } catch {
          setError("ログインに失敗しました。");
          setSubmitting(false);
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

