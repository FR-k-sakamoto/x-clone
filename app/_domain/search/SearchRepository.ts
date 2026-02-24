import type { SearchPostResult, SearchUserResult } from "@/app/_domain/search/SearchResult";
import type { SearchQuery } from "@/app/_domain/search/SearchQuery";

export interface SearchRepository {
  searchUsers(params: { query: SearchQuery; limit: number }): Promise<SearchUserResult[]>;
  searchPosts(params: { query: SearchQuery; limit: number }): Promise<SearchPostResult[]>;
}
