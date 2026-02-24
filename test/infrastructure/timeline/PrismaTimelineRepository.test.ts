import { describe, expect, it, vi } from "vitest";

import { TimelineCursor } from "@/app/_domain/timeline/TimelineCursor";
import { TimelineMode } from "@/app/_domain/timeline/TimelineMode";
import { TimelineViewerUserId } from "@/app/_domain/timeline/TimelineViewerUserId";
import { PrismaTimelineRepository } from "@/app/_infrastructure/timeline/PrismaTimelineRepository";

function createPrismaMock() {
  return {
    follow: {
      findMany: vi.fn(),
    },
    post: {
      findMany: vi.fn(),
    },
    repost: {
      findMany: vi.fn(),
    },
  };
}

describe("PrismaTimelineRepositoryの永続化処理", () => {
  it("followingモードでフォロー先がなければ空を返し投稿取得を行わない", async () => {
    const prisma = createPrismaMock();
    prisma.follow.findMany.mockResolvedValue([]);
    const repo = new PrismaTimelineRepository(prisma as never);

    const result = await repo.listPage({
      viewerUserId: TimelineViewerUserId.fromString("viewer-1"),
      mode: TimelineMode.fromString("following"),
      limit: 20,
      cursor: null,
    });

    expect(result).toEqual({ events: [], nextCursor: null });
    expect(prisma.follow.findMany).toHaveBeenCalledWith({
      where: { followerId: "viewer-1" },
      select: { followingId: true },
    });
    expect(prisma.post.findMany).not.toHaveBeenCalled();
    expect(prisma.repost.findMany).not.toHaveBeenCalled();
  });

  it("allモードで投稿とリポストを取得して新しい順に返す", async () => {
    const prisma = createPrismaMock();
    prisma.post.findMany.mockResolvedValue([
      {
        id: "p1",
        authorId: "author-1",
        body: "first",
        createdAt: new Date("2026-02-20T01:00:00.000Z"),
        author: { handle: "alice" },
      },
    ]);
    prisma.repost.findMany.mockResolvedValue([
      {
        userId: "user-2",
        postId: "p2",
        createdAt: new Date("2026-02-20T03:00:00.000Z"),
        user: { handle: "bob" },
        post: {
          authorId: "author-2",
          author: { handle: "charlie" },
          body: "second",
        },
      },
    ]);
    const repo = new PrismaTimelineRepository(prisma as never);

    const result = await repo.listPage({
      viewerUserId: TimelineViewerUserId.fromString("viewer-1"),
      mode: TimelineMode.fromString("all"),
      limit: 20,
      cursor: null,
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 80,
      select: {
        id: true,
        authorId: true,
        body: true,
        createdAt: true,
        author: {
          select: { handle: true },
        },
      },
    });
    expect(prisma.repost.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ createdAt: "desc" }, { userId: "desc" }, { postId: "desc" }],
      take: 80,
      select: {
        userId: true,
        postId: true,
        createdAt: true,
        user: {
          select: {
            handle: true,
          },
        },
        post: {
          select: {
            authorId: true,
            author: {
              select: { handle: true },
            },
            body: true,
          },
        },
      },
    });
    expect(result.nextCursor).toBeNull();
    expect(result.events.map((event) => event.postId)).toEqual(["p2", "p1"]);
  });

  it("followingモードではフォロー先だけを条件に含める", async () => {
    const prisma = createPrismaMock();
    prisma.follow.findMany.mockResolvedValue([{ followingId: "u1" }, { followingId: "u2" }]);
    prisma.post.findMany.mockResolvedValue([]);
    prisma.repost.findMany.mockResolvedValue([]);
    const repo = new PrismaTimelineRepository(prisma as never);

    await repo.listPage({
      viewerUserId: TimelineViewerUserId.fromString("viewer-1"),
      mode: TimelineMode.fromString("following"),
      limit: 10,
      cursor: null,
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { authorId: { in: ["u1", "u2"] } },
      })
    );
    expect(prisma.repost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: { in: ["u1", "u2"] } },
      })
    );
  });

  it("カーソル指定時は同時刻の同一イベントを除外して次ページを返す", async () => {
    const prisma = createPrismaMock();
    const t3 = new Date("2026-02-20T03:00:00.000Z");
    const t2 = new Date("2026-02-20T02:00:00.000Z");
    const t1 = new Date("2026-02-20T01:00:00.000Z");

    prisma.post.findMany.mockResolvedValue([
      {
        id: "p3",
        authorId: "author-3",
        body: "newest",
        createdAt: t3,
        author: { handle: "h3" },
      },
      {
        id: "p2",
        authorId: "author-2",
        body: "middle",
        createdAt: t2,
        author: { handle: "h2" },
      },
      {
        id: "p1",
        authorId: "author-1",
        body: "old",
        createdAt: t1,
        author: { handle: "h1" },
      },
    ]);
    prisma.repost.findMany.mockResolvedValue([]);
    const repo = new PrismaTimelineRepository(prisma as never);
    const cursor = TimelineCursor.fromParts({
      createdAt: t3,
      sortKey: "post:p3:author-3",
    });

    const result = await repo.listPage({
      viewerUserId: TimelineViewerUserId.fromString("viewer-1"),
      mode: TimelineMode.fromString("all"),
      limit: 1,
      cursor,
    });

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { createdAt: { lte: t3 } },
      })
    );
    expect(result.events).toHaveLength(1);
    expect(result.events[0].postId).toBe("p2");
    expect(result.nextCursor).not.toBeNull();
  });
});
