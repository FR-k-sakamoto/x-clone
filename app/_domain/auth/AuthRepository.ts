import { AuthSession } from "@/app/_domain/auth/AuthSession";

export interface AuthRepository {
  getCurrentSession(): Promise<AuthSession | null>;
  signInWithEmailPassword(email: string, password: string, callbackUrl?: string): Promise<void>;
  signOut(callbackUrl?: string): Promise<void>;
}
