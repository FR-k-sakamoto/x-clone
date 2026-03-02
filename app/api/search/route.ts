import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { searchAll } from "@/app/_application/search/searchAll";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaSearchRepository } from "@/app/_infrastructure/search/PrismaSearchRepository";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    logOperationWarn("search.get.unauthorized");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  const result = await searchAll(
    { searchRepo: new PrismaSearchRepository(prisma) },
    { query: q }
  );

  logOperationInfo("search.get.success", {
    userId,
    queryLength: q.trim().length,
    users: result.users.length,
    posts: result.posts.length,
  });
  return NextResponse.json(result);
}
