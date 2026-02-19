import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    // Our Prisma `User` model includes this field.
    handle?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      handle?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    handle?: string;
  }
}
