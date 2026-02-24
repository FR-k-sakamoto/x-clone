import { describe, expect, it } from "vitest";

import { PostBody } from "@/app/_domain/post/PostBody";

describe("PostBody", () => {
  it("入力を正規化して値を保持する", () => {
    const postBody = PostBody.fromString("  hello\r\nworld\u0000  ");
    expect(postBody.toString()).toBe("hello\nworld");
  });

  it("空文字はエラーになる", () => {
    expect(() => PostBody.fromString(" \n\t ")).toThrowError("PostBody must be non-empty.");
  });
});
