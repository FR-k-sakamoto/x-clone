import type { TimelineCursor } from "@/app/_domain/timeline/TimelineCursor";
import type { TimelineMode } from "@/app/_domain/timeline/TimelineMode";
import type { TimelineViewerUserId } from "@/app/_domain/timeline/TimelineViewerUserId";

export type TimelineEvent = {
  eventType: "post" | "repost";
  postId: string;
  eventActorId: string;
  eventCreatedAt: Date;
  reposterHandle: string | null;
  post: {
    authorId: string;
    authorHandle: string;
    body: string;
  };
};

export type TimelinePage = {
  events: TimelineEvent[];
  nextCursor: TimelineCursor | null;
};

export interface TimelineRepository {
  listPage(params: {
    viewerUserId: TimelineViewerUserId;
    mode: TimelineMode;
    limit: number;
    cursor: TimelineCursor | null;
  }): Promise<TimelinePage>;
}
