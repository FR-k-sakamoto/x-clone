"use client";

import { useActionState, useMemo, useState } from "react";

import type { SignUpState } from "@/app/signup/actions";
import { signUpWithEmailPassword } from "@/app/signup/actions";

const initialState: SignUpState = { ok: false, message: null };

export function SignupForm() {
  const [state, action, pending] = useActionState(signUpWithEmailPassword, initialState);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const disabled = useMemo(
    () => pending || email.trim().length === 0 || name.trim().length === 0,
    [pending, email, name]
  );

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-800">Name</label>
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">Email</label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
