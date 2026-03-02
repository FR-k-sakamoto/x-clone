"use client";

import { getSession, signIn, signOut } from "next-auth/react";

import { AuthSession } from "@/app/_domain/auth/AuthSession";
import { AuthUser } from "@/app/_domain/auth/AuthUser";
import { AuthUserId } from "@/app/_domain/auth/AuthUserId";
import { Email } from "@/app/_domain/auth/Email";
import type { AuthRepository } from "@/app/_domain/auth/AuthRepository";

export class NextAuthAuthRepositoryClient implements AuthRepository {
  async getCurrentSession(): Promise<AuthSession | null> {
    const session = await getSession();
    if (!session?.user?.email || !session.user.name) return null;

    const user = new AuthUser(
      AuthUserId.fromString(session.user.id),
      Email.fromString(session.user.email),
      session.user.name,
      session.user.image
    );
    return new AuthSession(user, new Date(session.expires));
  }

  async signInWithEmailPassword(
    email: string,
    password: string,
    callbackUrl?: string
  ): Promise<void> {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl ?? "/",
    });
  }

  async signOut(callbackUrl?: string): Promise<void> {
    await signOut({ callbackUrl: callbackUrl ?? "/" });
  }
}
