import { describe, expect, it } from "vitest";

import { SearchQuery } from "@/app/_domain/search/SearchQuery";

describe("SearchQuery", () => {
  it("入力を正規化して値を保持する", () => {
    const query = SearchQuery.fromString("  alice\r\nbob\u0000  ");
    expect(query.toString()).toBe("alice\nbob");
  });

  it("空文字はエラーになる", () => {
    expect(() => SearchQuery.fromString(" \n ")).toThrowError("SearchQuery must be non-empty.");
  });
});
