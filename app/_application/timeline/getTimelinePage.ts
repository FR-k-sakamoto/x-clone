import { getLikeSummaries } from "@/app/_application/reaction/getLikeSummaries";
import { getRepostSummaries } from "@/app/_application/repost/getRepostSummaries";
import { TimelineCursor } from "@/app/_domain/timeline/TimelineCursor";
import { TimelineMode } from "@/app/_domain/timeline/TimelineMode";
import type { TimelineRepository } from "@/app/_domain/timeline/TimelineRepository";
import { TimelineViewerUserId } from "@/app/_domain/timeline/TimelineViewerUserId";
import type { LikeRepository } from "@/app/_domain/reaction/LikeRepository";
import type { RepostRepository } from "@/app/_domain/repost/RepostRepository";

export type TimelineListItem = {
  eventKey: string;
  postId: string;
  eventCreatedAtIso: string;
  eventType: "post" | "repost";
  reposterHandle: string | null;
  authorId: string;
  body: string;
  likeCount: number;
  likedByMe: boolean;
  repostCount: number;
  repostedByMe: boolean;
};

export type TimelinePageResult = {
  mode: "all" | "following";
  items: TimelineListItem[];
  nextCursor: string | null;
};

export async function getTimelinePage(
  deps: {
    timelineRepo: TimelineRepository;
    likeRepo: LikeRepository;
    repostRepo: RepostRepository;
  },
  input: {
    viewerUserId: string;
    mode?: string;
    limit?: number;
    cursor?: string | null;
  }
): Promise<TimelinePageResult> {
  let viewerUserId: TimelineViewerUserId;
  try {
    viewerUserId = TimelineViewerUserId.fromString(input.viewerUserId);
  } catch {
    return { mode: "all", items: [], nextCursor: null };
  }

  const mode = TimelineMode.fromString(input.mode);
  const requestedLimit = input.limit ?? 20;
  const limit = Math.max(1, Math.min(requestedLimit, 40));

  let cursor: TimelineCursor | null = null;
  if (input.cursor) {
    try {
      cursor = TimelineCursor.fromString(input.cursor);
    } catch {
      cursor = null;
    }
  }

  const page = await deps.timelineRepo.listPage({
    viewerUserId,
    mode,
    limit,
    cursor,
  });

  const postIds = Array.from(new Set(page.events.map((event) => event.postId)));
  const [likeSummaries, repostSummaries] = await Promise.all([
    getLikeSummaries(
      { likeRepo: deps.likeRepo },
      {
        viewerUserId: viewerUserId.toString(),
        postIds,
      }
    ),
    getRepostSummaries(
      { repostRepo: deps.repostRepo },
      {
        viewerUserId: viewerUserId.toString(),
        postIds,
      }
    ),
  ]);

  const likeSummaryByPostId = new Map(likeSummaries.map((summary) => [summary.postId, summary]));
  const repostSummaryByPostId = new Map(
    repostSummaries.map((summary) => [summary.postId, summary])
  );

  return {
    mode: mode.toString(),
    items: page.events.map((event) => ({
      eventKey: `${event.eventType}:${event.postId}:${event.eventActorId}:${event.eventCreatedAt.toISOString()}`,
      postId: event.postId,
      eventCreatedAtIso: event.eventCreatedAt.toISOString(),
      eventType: event.eventType,
      reposterHandle: event.reposterHandle,
      authorId: event.post.authorId,
      body: event.post.body,
      likeCount: likeSummaryByPostId.get(event.postId)?.likeCount ?? 0,
      likedByMe: likeSummaryByPostId.get(event.postId)?.likedByMe ?? false,
      repostCount: repostSummaryByPostId.get(event.postId)?.repostCount ?? 0,
      repostedByMe: repostSummaryByPostId.get(event.postId)?.repostedByMe ?? false,
    })),
    nextCursor: page.nextCursor?.toString() ?? null,
  };
}
