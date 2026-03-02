import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getTimelinePage } from "@/app/_application/timeline/getTimelinePage";
import { authOptions } from "@/app/_infrastructure/auth/authOptions";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { PrismaLikeRepository } from "@/app/_infrastructure/reaction/PrismaLikeRepository";
import { PrismaRepostRepository } from "@/app/_infrastructure/repost/PrismaRepostRepository";
import { PrismaTimelineRepository } from "@/app/_infrastructure/timeline/PrismaTimelineRepository";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    logOperationWarn("timeline.get.unauthorized");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? undefined;
  const cursor = url.searchParams.get("cursor");

  const page = await getTimelinePage(
    {
      timelineRepo: new PrismaTimelineRepository(prisma),
      likeRepo: new PrismaLikeRepository(prisma),
      repostRepo: new PrismaRepostRepository(prisma),
    },
    {
      viewerUserId: userId,
      mode,
      cursor,
      limit: 20,
    }
  );

  logOperationInfo("timeline.get.success", {
    userId,
    mode: page.mode,
    itemCount: page.items.length,
    hasNextCursor: page.nextCursor !== null,
  });
  return NextResponse.json(page);
}
