import { NextResponse } from "next/server";

import { getReplyThread } from "@/app/_application/reply/getReplyThread";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaReplyRepository } from "@/app/_infrastructure/reply/PrismaReplyRepository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId") ?? "";

  const result = await getReplyThread(
    { replyRepo: new PrismaReplyRepository(prisma) },
    { rootPostId: postId }
  );

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 404 });
  }

  return NextResponse.json(result);
}
