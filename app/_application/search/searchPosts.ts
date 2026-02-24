import { SearchQuery } from "@/app/_domain/search/SearchQuery";
import type { SearchRepository } from "@/app/_domain/search/SearchRepository";

export type PostSearchItem = {
  postId: string;
  authorId: string;
  authorHandle: string;
  body: string;
  createdAtIso: string;
};

export async function searchPosts(
  deps: { searchRepo: SearchRepository },
  input: { query: string; limit?: number }
): Promise<PostSearchItem[]> {
  let query: SearchQuery;
  try {
    query = SearchQuery.fromString(input.query);
  } catch {
    return [];
  }

  const limit = Math.max(1, Math.min(input.limit ?? 20, 100));
  const posts = await deps.searchRepo.searchPosts({ query, limit });

  return posts.map((post) => ({
    postId: post.getPostId(),
    authorId: post.getAuthorId(),
    authorHandle: post.getAuthorHandle(),
    body: post.getBody(),
    createdAtIso: post.getCreatedAt().toISOString(),
  }));
}
