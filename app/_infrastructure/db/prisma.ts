import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL for PrismaClient.");
  }

  // This repo uses Prisma Driver Adapters (see `prisma/seed.js`).
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Avoid exhausting connections during Next.js dev HMR.
export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;
