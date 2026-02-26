import { expect, test } from "@playwright/test";

test("未ログイン時にホームからログイン導線へ遷移できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "X Clone" })).toBeVisible();
  await expect(page.getByText("現在ログインしていません。")).toBeVisible();

  await page.getByRole("link", { name: "Go to login" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
