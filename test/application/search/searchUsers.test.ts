import { describe, expect, it, vi } from "vitest";

import { searchUsers } from "@/app/_application/search/searchUsers";
import type { SearchRepository } from "@/app/_domain/search/SearchRepository";
import { SearchUserResult } from "@/app/_domain/search/SearchResult";

function createRepoMock() {
  return {
    searchUsers: vi.fn(),
    searchPosts: vi.fn(),
  } satisfies SearchRepository;
}

describe("ユーザー検索ユースケース", () => {
  it("不正なクエリなら空配列を返して検索しない", async () => {
    const repo = createRepoMock();

    const result = await searchUsers({ searchRepo: repo }, { query: "   " });

    expect(result).toEqual([]);
    expect(repo.searchUsers).not.toHaveBeenCalled();
  });

  it("limitを1-50に丸めて結果を変換する", async () => {
    const repo = createRepoMock();
    repo.searchUsers.mockResolvedValue([
      new SearchUserResult("u1", "alice", "Alice", ""),
      new SearchUserResult("u2", "bob", "Bob", "bio"),
    ]);

    const result = await searchUsers(
      { searchRepo: repo },
      { query: "alice", limit: 999 }
    );

    expect(repo.searchUsers).toHaveBeenCalledTimes(1);
    const args = repo.searchUsers.mock.calls[0][0];
    expect(args.query.toString()).toBe("alice");
    expect(args.limit).toBe(50);

    expect(result).toEqual([
      { userId: "u1", handle: "alice", name: "Alice", bio: "" },
      { userId: "u2", handle: "bob", name: "Bob", bio: "bio" },
    ]);
  });
});
