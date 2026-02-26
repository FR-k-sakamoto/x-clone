import { expect, test } from "@playwright/test";

import { loginAsSeedAlice } from "./helpers/session";

test.describe("文字数バリデーション", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeedAlice(page);
  });

  test("投稿本文が160文字を超えると Post が無効化される", async ({ page }) => {
    await page.goto("/");

    const tooLong = "a".repeat(161);
    const composer = page.getByPlaceholder("160文字以内で投稿");
    await composer.fill(tooLong);

    await expect(page.getByText("-1/160")).toBeVisible();
    await expect(page.getByRole("button", { name: "Post" })).toBeDisabled();
  });

  test("返信本文が160文字を超えると Reply が無効化される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "返信を見る" }).first().click();
    await expect(page.getByRole("heading", { name: "Thread" })).toBeVisible();

    const tooLong = "b".repeat(161);
    const composer = page.getByPlaceholder("160文字以内で返信");
    await composer.fill(tooLong);

    await expect(page.getByText("-1/160")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reply" })).toBeDisabled();
  });
});
