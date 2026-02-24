import type { SearchRepository } from "@/app/_domain/search/SearchRepository";
import { searchPosts, type PostSearchItem } from "@/app/_application/search/searchPosts";
import { searchUsers, type UserSearchItem } from "@/app/_application/search/searchUsers";

export type SearchAllResult = {
  query: string;
  users: UserSearchItem[];
  posts: PostSearchItem[];
};

export async function searchAll(
  deps: { searchRepo: SearchRepository },
  input: { query: string }
): Promise<SearchAllResult> {
  const query = input.query.trim();
  if (query.length === 0) {
    return { query, users: [], posts: [] };
  }

  const [users, posts] = await Promise.all([
    searchUsers({ searchRepo: deps.searchRepo }, { query, limit: 8 }),
    searchPosts({ searchRepo: deps.searchRepo }, { query, limit: 20 }),
  ]);

  return { query, users, posts };
}
