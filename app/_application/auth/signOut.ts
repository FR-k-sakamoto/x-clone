import type { AuthRepository } from "@/app/_domain/auth/AuthRepository";

export async function signOut(repo: AuthRepository, callbackUrl?: string) {
  await repo.signOut(callbackUrl);
}

