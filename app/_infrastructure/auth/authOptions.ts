import type { NextAuthOptions } from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/_infrastructure/db/prisma";

const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "x-clone-dev-nextauth-secret");

if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is required in production.");
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error("[next-auth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[next-auth][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[next-auth][debug]", code, metadata);
    },
  },
  // Credentials provider requires JWT sessions in NextAuth v4.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              handle: true,
              passwordHash: true,
            },
          });
          if (!user?.passwordHash) return null;

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          // NextAuth expects a plain object with `id`.
          const u: NextAuthUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            handle: user.handle,
          };
          return u;
        } catch (err) {
          console.error("[auth][credentials][authorize]", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, `user` is available; persist in token for later requests.
      if (user) {
        const u = user as NextAuthUser;
        (token as JWT).id = u.id;
        (token as JWT).handle = u.handle;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token as JWT).id ?? "";
        session.user.handle = (token as JWT).handle;
      }
      return session;
    },
  },
};
