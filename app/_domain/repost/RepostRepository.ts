import { RepostPostId } from "@/app/_domain/repost/RepostPostId";
import { RepostUserId } from "@/app/_domain/repost/RepostUserId";

export type RepostTimelineEvent = {
  postId: string;
  repostedAt: Date;
  reposter: {
    userId: string;
    handle: string;
    name: string;
  };
  post: {
    authorId: string;
    body: string;
    createdAt: Date;
  };
};

export interface RepostRepository {
  exists(params: { userId: RepostUserId; postId: RepostPostId }): Promise<boolean>;
  create(params: { userId: RepostUserId; postId: RepostPostId }): Promise<void>;
  remove(params: { userId: RepostUserId; postId: RepostPostId }): Promise<void>;
  countByPostIds(postIds: RepostPostId[]): Promise<Map<string, number>>;
  findRepostedPostIds(params: {
    userId: RepostUserId;
    postIds: RepostPostId[];
  }): Promise<Set<string>>;
  listRecentTimelineEvents(limit: number): Promise<RepostTimelineEvent[]>;
}
