import { describe, expect, it, vi } from "vitest";

import { searchPosts } from "@/app/_application/search/searchPosts";
import type { SearchRepository } from "@/app/_domain/search/SearchRepository";
import { SearchPostResult } from "@/app/_domain/search/SearchResult";

function createRepoMock() {
  return {
    searchUsers: vi.fn(),
    searchPosts: vi.fn(),
  } satisfies SearchRepository;
}

describe("投稿検索ユースケース", () => {
  it("不正なクエリなら空配列を返して検索しない", async () => {
    const repo = createRepoMock();

    const result = await searchPosts({ searchRepo: repo }, { query: "   " });

    expect(result).toEqual([]);
    expect(repo.searchPosts).not.toHaveBeenCalled();
  });

  it("limitを1-100に丸めて結果を変換する", async () => {
    const repo = createRepoMock();
    const createdAt = new Date("2026-02-24T09:00:00.000Z");
    repo.searchPosts.mockResolvedValue([
      new SearchPostResult("p1", "u1", "alice", "hello", createdAt),
    ]);

    const result = await searchPosts(
      { searchRepo: repo },
      { query: "hello", limit: 999 }
    );

    expect(repo.searchPosts).toHaveBeenCalledTimes(1);
    const args = repo.searchPosts.mock.calls[0][0];
    expect(args.query.toString()).toBe("hello");
    expect(args.limit).toBe(100);

    expect(result).toEqual([
      {
        postId: "p1",
        authorId: "u1",
        authorHandle: "alice",
        body: "hello",
        createdAtIso: createdAt.toISOString(),
      },
    ]);
  });
});
