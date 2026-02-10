import type { AuthRepository } from "@/app/_domain/auth/AuthRepository";

export async function signInWithEmailPassword(
  repo: AuthRepository,
  params: { email: string; password: string; callbackUrl?: string }
) {
  await repo.signInWithEmailPassword(params.email, params.password, params.callbackUrl);
}

