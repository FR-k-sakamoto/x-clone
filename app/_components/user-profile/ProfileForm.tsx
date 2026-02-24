"use client";

import { useActionState, useState } from "react";

import type { UpdateProfileState } from "@/app/profile/actions";
import { updateProfile } from "@/app/profile/actions";

const initialState: UpdateProfileState = { ok: false, message: null };

export function ProfileForm(props: { initialName: string; initialHandle: string; initialBio: string }) {
  const [state, action, pending] = useActionState(updateProfile, initialState);
  const [name, setName] = useState(props.initialName);
  const [handle, setHandle] = useState(props.initialHandle);
  const [bio, setBio] = useState(props.initialBio);

  const disabled = pending || name.trim().length === 0 || handle.trim().length === 0;

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-800">Name</label>
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          maxLength={50}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">Handle</label>
        <input
          name="handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          maxLength={24}
          required
        />
        <p className="mt-1 text-xs text-zinc-500">英小文字・数字・アンダースコアのみ</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-800">Bio</label>
        <textarea
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-2 min-h-[120px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
          maxLength={160}
        />
        <p className="mt-1 text-xs text-zinc-500">{bio.length}/160</p>
      </div>

      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Updating..." : "Update profile"}
      </button>
    </form>
  );
}
