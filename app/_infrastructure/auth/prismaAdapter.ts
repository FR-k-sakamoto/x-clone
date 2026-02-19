import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import type { Adapter, AdapterUser } from "next-auth/adapters";

import { generateUniqueHandle } from "@/app/_infrastructure/auth/handle";

type Awaitable<T> = T | PromiseLike<T>;

function withFallback<TArgs extends unknown[], TResult>(
  name: string,
  fn: (...args: TArgs) => Awaitable<TResult>,
  fallback: TResult
) {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (err) {
      // Avoid taking down the whole auth surface area when DB isn't reachable.
      console.error(`[auth][adapter][${name}]`, err);
      return fallback;
    }
  };
}

/**
 * Our `User` table has required fields (`handle`, `name`, `email`) that the
 * stock Prisma adapter doesn't know about. Override `createUser` so OAuth
 * sign-in can still create a valid user row.
 */
export function xClonePrismaAdapter(prisma: PrismaClient): Adapter {
  const base = PrismaAdapter(prisma);

  return {
    ...base,
    getSessionAndUser: base.getSessionAndUser
      ? withFallback("getSessionAndUser", base.getSessionAndUser, null)
      : undefined,
    getUser: base.getUser
      ? withFallback("getUser", base.getUser, null)
      : undefined,
    getUserByEmail: base.getUserByEmail
      ? withFallback("getUserByEmail", base.getUserByEmail, null)
      : undefined,
    getUserByAccount: base.getUserByAccount
      ? withFallback("getUserByAccount", base.getUserByAccount, null)
      : undefined,
    updateSession: base.updateSession
      ? withFallback("updateSession", base.updateSession, null)
      : undefined,
    async createUser(data: Omit<AdapterUser, "id">) {
      if (!data.email) {
        throw new Error("NextAuth attempted to create a user without an email.");
      }

      const name = data.name ?? data.email.split("@")[0] ?? "user";
      const handle = await generateUniqueHandle(prisma, data.email, name);

      const created = await prisma.user.create({
        data: {
          handle,
          name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
          // Keep legacy column in sync for now.
          imageUrl: data.image,
          passwordHash: null,
        },
      });

      const adapterUser: AdapterUser = {
        id: created.id,
        name: created.name,
        email: created.email,
        emailVerified: created.emailVerified,
        image: created.image,
      };
      return adapterUser;
    },
  };
}
