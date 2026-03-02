import { expect, test } from "@playwright/test";

test("未ログインで /profile にアクセスすると /login にリダイレクトされる", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("未ログインではユーザープロフィールにログイン案内が表示される", async ({ page }) => {
  await page.goto("/u/bob");
  await expect(page.getByText("フォローするには")).toBeVisible();
  await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();
});

test("未ログインでは投稿詳細にログイン案内が表示される", async ({ page }) => {
  await page.goto("/search?q=Hello");
  await page.getByRole("link", { name: "スレッドを見る" }).first().click();

  await expect(page.getByRole("heading", { name: "Thread" })).toBeVisible();
  await expect(page.getByText("返信するには")).toBeVisible();
  await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();
});
