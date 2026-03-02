import type { AuthRepository } from "@/app/_domain/auth/AuthRepository";

export async function getCurrentSession(repo: AuthRepository) {
  return repo.getCurrentSession();
}
