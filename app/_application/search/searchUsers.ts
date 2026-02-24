import { SearchQuery } from "@/app/_domain/search/SearchQuery";
import type { SearchRepository } from "@/app/_domain/search/SearchRepository";

export type UserSearchItem = {
  userId: string;
  handle: string;
  name: string;
  bio: string;
};

export async function searchUsers(
  deps: { searchRepo: SearchRepository },
  input: { query: string; limit?: number }
): Promise<UserSearchItem[]> {
  let query: SearchQuery;
  try {
    query = SearchQuery.fromString(input.query);
  } catch {
    return [];
  }

  const limit = Math.max(1, Math.min(input.limit ?? 10, 50));
  const users = await deps.searchRepo.searchUsers({ query, limit });

  return users.map((user) => ({
    userId: user.getUserId(),
    handle: user.getHandle(),
    name: user.getName(),
    bio: user.getBio(),
  }));
}
