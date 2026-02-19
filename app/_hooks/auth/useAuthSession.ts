"use client";

import { useSession } from "next-auth/react";

export function useAuthSession() {
  const { data, status } = useSession();
  return { session: data, status };
}

