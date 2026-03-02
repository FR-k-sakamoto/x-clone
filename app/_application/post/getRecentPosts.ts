import type { Post } from "@/app/_domain/post/Post";
import type { PostRepository } from "@/app/_domain/post/PostRepository";

export async function getRecentPosts(
  deps: { postRepo: PostRepository },
  input?: { limit?: number }
): Promise<Post[]> {
  const requestedLimit = input?.limit ?? 20;
  const limit = Math.max(1, Math.min(requestedLimit, 100));
  return deps.postRepo.listRecent(limit);
}
