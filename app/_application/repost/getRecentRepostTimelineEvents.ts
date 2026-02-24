import type { RepostRepository, RepostTimelineEvent } from "@/app/_domain/repost/RepostRepository";

export async function getRecentRepostTimelineEvents(
  deps: { repostRepo: RepostRepository },
  input?: { limit?: number }
): Promise<RepostTimelineEvent[]> {
  const requestedLimit = input?.limit ?? 30;
  const limit = Math.max(1, Math.min(requestedLimit, 100));
  return deps.repostRepo.listRecentTimelineEvents(limit);
}
