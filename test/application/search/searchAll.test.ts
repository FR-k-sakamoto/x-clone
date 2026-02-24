import { describe, expect, it, vi } from "vitest";

import { searchAll } from "@/app/_application/search/searchAll";
import type { SearchRepository } from "@/app/_domain/search/SearchRepository";
import { SearchPostResult, SearchUserResult } from "@/app/_domain/search/SearchResult";

function createRepoMock() {
  return {
    searchUsers: vi.fn(),
    searchPosts: vi.fn(),
  } satisfies SearchRepository;
}

describe("検索統合ユースケース", () => {
  it("クエリが空のときは検索せず空配列を返す", async () => {
    const repo = createRepoMock();

    const result = await searchAll({ searchRepo: repo }, { query: "   " });

    expect(result).toEqual({ query: "", users: [], posts: [] });
    expect(repo.searchUsers).not.toHaveBeenCalled();
    expect(repo.searchPosts).not.toHaveBeenCalled();
  });

  it("ユーザー/投稿検索を実行してマージ結果を返す", async () => {
    const repo = createRepoMock();
    const createdAt = new Date("2026-02-24T01:23:45.000Z");
    repo.searchUsers.mockResolvedValue([
      new SearchUserResult("u1", "alice", "Alice", "bio"),
    ]);
    repo.searchPosts.mockResolvedValue([
      new SearchPostResult("p1", "u1", "alice", "hello", createdAt),
    ]);

    const result = await searchAll({ searchRepo: repo }, { query: "  alice  " });

    expect(repo.searchUsers).toHaveBeenCalledTimes(1);
    const userArgs = repo.searchUsers.mock.calls[0][0];
    expect(userArgs.query.toString()).toBe("alice");
    expect(userArgs.limit).toBe(8);

    expect(repo.searchPosts).toHaveBeenCalledTimes(1);
    const postArgs = repo.searchPosts.mock.calls[0][0];
    expect(postArgs.query.toString()).toBe("alice");
    expect(postArgs.limit).toBe(20);

    expect(result).toEqual({
      query: "alice",
      users: [{ userId: "u1", handle: "alice", name: "Alice", bio: "bio" }],
      posts: [
        {
          postId: "p1",
          authorId: "u1",
          authorHandle: "alice",
          body: "hello",
          createdAtIso: createdAt.toISOString(),
        },
      ],
    });
  });
});
