import { describe, expect, it, vi } from "vitest";

import { getTimelinePage } from "@/app/_application/timeline/getTimelinePage";
import { TimelineCursor } from "@/app/_domain/timeline/TimelineCursor";
import type { TimelineRepository } from "@/app/_domain/timeline/TimelineRepository";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import type { RepostRepository } from "@/app/_domain/repost/RepostRepository";

function createTimelineRepoMock() {
  return {
    listPage: vi.fn(),
  } satisfies TimelineRepository;
}

function createLikeRepoMock() {
  return {
    exists: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    countByPostIds: vi.fn(),
    findLikedPostIds: vi.fn(),
  } satisfies LikeRepository;
}

function createRepostRepoMock() {
  return {
    exists: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    countByPostIds: vi.fn(),
    findRepostedPostIds: vi.fn(),
    listRecentTimelineEvents: vi.fn(),
  } satisfies RepostRepository;
}

describe("タイムラインページ取得ユースケース", () => {
  it("閲覧者IDが不正なときは空の結果を返す", async () => {
    const timelineRepo = createTimelineRepoMock();
    const likeRepo = createLikeRepoMock();
    const repostRepo = createRepostRepoMock();

    const result = await getTimelinePage(
      { timelineRepo, likeRepo, repostRepo },
      { viewerUserId: " " }
    );

    expect(result).toEqual({ mode: "all", items: [], nextCursor: null });
    expect(timelineRepo.listPage).not.toHaveBeenCalled();
  });

  it("limitを1-40に丸めて mode/cursor を解釈してリポジトリへ渡す", async () => {
    const timelineRepo = createTimelineRepoMock();
    const likeRepo = createLikeRepoMock();
    const repostRepo = createRepostRepoMock();
    timelineRepo.listPage.mockResolvedValue({
      events: [],
      nextCursor: null,
    });

    const result = await getTimelinePage(
      { timelineRepo, likeRepo, repostRepo },
      {
        viewerUserId: "viewer-1",
        mode: "following",
        limit: 999,
        cursor: "invalid-cursor",
      }
    );

    expect(result).toEqual({ mode: "following", items: [], nextCursor: null });
    expect(timelineRepo.listPage).toHaveBeenCalledTimes(1);
    const callArg = timelineRepo.listPage.mock.calls[0][0];
    expect(callArg.viewerUserId.toString()).toBe("viewer-1");
    expect(callArg.mode.toString()).toBe("following");
    expect(callArg.limit).toBe(40);
    expect(callArg.cursor).toBeNull();
  });

  it("イベントをlike/repost要約と結合して返す", async () => {
    const timelineRepo = createTimelineRepoMock();
    const likeRepo = createLikeRepoMock();
    const repostRepo = createRepostRepoMock();
    const t1 = new Date("2026-02-20T01:00:00.000Z");
    const t2 = new Date("2026-02-20T02:00:00.000Z");
    const nextCursor = TimelineCursor.fromParts({
      createdAt: t1,
      sortKey: "post:p1:user-1",
    });

    timelineRepo.listPage.mockResolvedValue({
      events: [
        {
          eventType: "post",
          postId: "p1",
          eventActorId: "user-1",
          eventCreatedAt: t1,
          reposterHandle: null,
          post: { authorId: "author-1", authorHandle: "alice", body: "hello" },
        },
        {
          eventType: "repost",
          postId: "p2",
          eventActorId: "user-2",
          eventCreatedAt: t2,
          reposterHandle: "bob",
          post: { authorId: "author-2", authorHandle: "charlie", body: "world" },
        },
        {
          eventType: "repost",
          postId: "p2",
          eventActorId: "user-3",
          eventCreatedAt: t2,
          reposterHandle: "dave",
          post: { authorId: "author-2", authorHandle: "charlie", body: "world" },
        },
      ],
      nextCursor,
    });

    likeRepo.countByPostIds.mockResolvedValue(new Map([["p2", 5]]));
    likeRepo.findLikedPostIds.mockResolvedValue(new Set(["p1"]));
    repostRepo.countByPostIds.mockResolvedValue(new Map([["p1", 2], ["p2", 10]]));
    repostRepo.findRepostedPostIds.mockResolvedValue(new Set(["p2"]));

    const result = await getTimelinePage(
      { timelineRepo, likeRepo, repostRepo },
      { viewerUserId: "viewer-1", mode: "all", limit: 20 }
    );

    expect(likeRepo.countByPostIds).toHaveBeenCalledTimes(1);
    expect(repostRepo.countByPostIds).toHaveBeenCalledTimes(1);
    const likePostIds = likeRepo.countByPostIds.mock.calls[0][0];
    expect(likePostIds.map((id: { toString: () => string }) => id.toString())).toEqual(["p1", "p2"]);

    expect(result.mode).toBe("all");
    expect(result.nextCursor).toBe(nextCursor.toString());
    expect(result.items).toEqual([
      {
        eventKey: `post:p1:user-1:${t1.toISOString()}`,
        postId: "p1",
        eventCreatedAtIso: t1.toISOString(),
        eventType: "post",
        reposterHandle: null,
        authorId: "author-1",
        authorHandle: "alice",
        body: "hello",
        likeCount: 0,
        likedByMe: true,
        repostCount: 2,
        repostedByMe: false,
      },
      {
        eventKey: `repost:p2:user-2:${t2.toISOString()}`,
        postId: "p2",
        eventCreatedAtIso: t2.toISOString(),
        eventType: "repost",
        reposterHandle: "bob",
        authorId: "author-2",
        authorHandle: "charlie",
        body: "world",
        likeCount: 5,
        likedByMe: false,
        repostCount: 10,
        repostedByMe: true,
      },
      {
        eventKey: `repost:p2:user-3:${t2.toISOString()}`,
        postId: "p2",
        eventCreatedAtIso: t2.toISOString(),
        eventType: "repost",
        reposterHandle: "dave",
        authorId: "author-2",
        authorHandle: "charlie",
        body: "world",
        likeCount: 5,
        likedByMe: false,
        repostCount: 10,
        repostedByMe: true,
      },
    ]);
  });
});
