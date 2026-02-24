import type { PrismaClient } from "@prisma/client";

import { TimelineCursor } from "@/app/_domain/timeline/TimelineCursor";
import type { TimelineEvent, TimelinePage, TimelineRepository } from "@/app/_domain/timeline/TimelineRepository";
import type { TimelineMode } from "@/app/_domain/timeline/TimelineMode";
import type { TimelineViewerUserId } from "@/app/_domain/timeline/TimelineViewerUserId";

function toSortKey(event: TimelineEvent) {
  return `${event.eventType}:${event.postId}:${event.eventActorId}`;
}

function compareEventsDesc(a: TimelineEvent, b: TimelineEvent) {
  const timeDiff = b.eventCreatedAt.getTime() - a.eventCreatedAt.getTime();
  if (timeDiff !== 0) return timeDiff;
  return toSortKey(b).localeCompare(toSortKey(a));
}

function isStrictlyOlderThanCursor(event: TimelineEvent, cursor: TimelineCursor) {
  const eventTime = event.eventCreatedAt.getTime();
  const cursorTime = cursor.getCreatedAt().getTime();

  if (eventTime < cursorTime) return true;
  if (eventTime > cursorTime) return false;
  return toSortKey(event) < cursor.getSortKey();
}

export class PrismaTimelineRepository implements TimelineRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private async findFollowingIds(viewerUserId: TimelineViewerUserId): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: viewerUserId.toString() },
      select: { followingId: true },
    });
    return rows.map((row) => row.followingId);
  }

  async listPage(params: {
    viewerUserId: TimelineViewerUserId;
    mode: TimelineMode;
    limit: number;
    cursor: TimelineCursor | null;
  }): Promise<TimelinePage> {
    const mode = params.mode.toString();
    const fetchLimit = Math.max(params.limit * 4, 80);
    const cursorCreatedAt = params.cursor?.getCreatedAt();

    let followingIds: string[] | null = null;
    if (mode === "following") {
      followingIds = await this.findFollowingIds(params.viewerUserId);
      if (followingIds.length === 0) {
        return { events: [], nextCursor: null };
      }
    }

    const [posts, reposts] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          ...(cursorCreatedAt ? { createdAt: { lte: cursorCreatedAt } } : {}),
          ...(followingIds ? { authorId: { in: followingIds } } : {}),
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: fetchLimit,
        select: {
          id: true,
          authorId: true,
          body: true,
          createdAt: true,
          author: {
            select: { handle: true },
          },
        },
      }),
      this.prisma.repost.findMany({
        where: {
          ...(cursorCreatedAt ? { createdAt: { lte: cursorCreatedAt } } : {}),
          ...(followingIds ? { userId: { in: followingIds } } : {}),
        },
        orderBy: [{ createdAt: "desc" }, { userId: "desc" }, { postId: "desc" }],
        take: fetchLimit,
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
      }),
    ]);

    const merged: TimelineEvent[] = [
      ...posts.map((post) => ({
        eventType: "post" as const,
        postId: post.id,
        eventActorId: post.authorId,
        eventCreatedAt: post.createdAt,
        reposterHandle: null,
        post: {
          authorId: post.authorId,
          authorHandle: post.author.handle,
          body: post.body,
        },
      })),
      ...reposts.map((repost) => ({
        eventType: "repost" as const,
        postId: repost.postId,
        eventActorId: repost.userId,
        eventCreatedAt: repost.createdAt,
        reposterHandle: repost.user.handle,
        post: {
          authorId: repost.post.authorId,
          authorHandle: repost.post.author.handle,
          body: repost.post.body,
        },
      })),
    ].sort(compareEventsDesc);

    const filtered = params.cursor
      ? merged.filter((event) => isStrictlyOlderThanCursor(event, params.cursor!))
      : merged;

    const hasMore = filtered.length > params.limit;
    const events = filtered.slice(0, params.limit);
    const last = events.at(-1);

    return {
      events,
      nextCursor:
        hasMore && last
          ? TimelineCursor.fromParts({
              createdAt: last.eventCreatedAt,
              sortKey: toSortKey(last),
            })
          : null,
    };
  }
}
