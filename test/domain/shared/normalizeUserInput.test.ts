import { describe, expect, it } from "vitest";

import { normalizeUserInput } from "@/app/_domain/shared/normalizeUserInput";

describe("normalizeUserInput", () => {
  it("前後空白とCRLFを正規化する", () => {
    expect(normalizeUserInput("  hello\r\nworld  ")).toBe("hello\nworld");
  });

  it("制御文字を除去する", () => {
    expect(normalizeUserInput(`ab\u0000cd\u0007ef`)).toBe("abcdef");
  });
});
