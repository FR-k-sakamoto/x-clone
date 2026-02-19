import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { AuthSession } from "@/app/_domain/auth/AuthSession";
import { AuthUser } from "@/app/_domain/auth/AuthUser";
import { AuthUserId } from "@/app/_domain/auth/AuthUserId";
import { Email } from "@/app/_domain/auth/Email";
import type { AuthRepository } from "@/app/_domain/auth/AuthRepository";

export class NextAuthAuthRepositoryServer implements AuthRepository {
  async getCurrentSession(): Promise<AuthSession | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.name) return null;

    const user = new AuthUser(
      AuthUserId.fromString(session.user.id),
      Email.fromString(session.user.email),
      session.user.name,
      session.user.image
    );
    return new AuthSession(user, new Date(session.expires));
  }

  async signInWithEmailPassword(): Promise<void> {
    throw new Error("signInWithEmailPassword is a client-side flow with NextAuth v4.");
  }

  async signOut(): Promise<void> {
    throw new Error("signOut is a client-side flow with NextAuth v4.");
  }
}
