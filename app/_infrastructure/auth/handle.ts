import type { PrismaClient } from "@prisma/client";

function slugifyHandleBase(raw: string): string {
  const base = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);

  return base.length > 0 ? base : "user";
}

function handleCandidates(email: string | null | undefined, name: string | null | undefined): string[] {
  const localPart = email?.split("@")[0];
  const base = slugifyHandleBase(localPart ?? name ?? "user");

  // Most-likely wins first, then fallbacks with suffix.
  const candidates = [base];
  for (let i = 0; i < 8; i++) {
    const suffix = Math.random().toString(36).slice(2, 6);
    candidates.push(`${base}_${suffix}`.slice(0, 24));
  }
  return candidates;
}

export async function generateUniqueHandle(prisma: PrismaClient, email?: string | null, name?: string | null) {
  for (const candidate of handleCandidates(email, name)) {
    const existing = await prisma.user.findUnique({ where: { handle: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }

  // Extremely unlikely to hit here; last resort.
  return `user_${crypto.randomUUID().slice(0, 8)}`;
}

