import { expect, test } from "@playwright/test";

import { loginAsSeedAlice, loginAsSeedBob } from "./helpers/session";

test("フォロー中タイムラインにフォロー相手の投稿が表示される", async ({ page }) => {
  const uniqueBobPost = `bob-following-${Date.now()}`;

  await loginAsSeedBob(page);
  await page.getByPlaceholder("160文字以内で投稿").fill(uniqueBobPost);
  await page.getByRole("button", { name: "Post" }).click();
  await expect(page.getByText(uniqueBobPost)).toBeVisible({ timeout: 10000 });

  const signOutButton = page.getByRole("button", { name: "Sign out" });
  await expect(signOutButton).toBeVisible({ timeout: 10000 });
  await signOutButton.click();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();

  await loginAsSeedAlice(page);
  await page.goto("/u/bob");
  const followButton = page.getByRole("button", { name: /フォロー/ });
  await expect(followButton).toBeVisible();
  if ((await followButton.textContent())?.trim() === "Follow") {
    await followButton.click();
    await expect(followButton).toHaveText("Following");
  }

  await page.goto("/");
  await page.getByRole("button", { name: "フォロー中" }).click();
  await expect(page.getByText(uniqueBobPost)).toBeVisible({ timeout: 10000 });
});

test("存在しない投稿IDではエラーメッセージと導線が表示される", async ({ page }) => {
  await page.goto("/post/not-a-uuid");

  const invalidIdMessage = page.getByText("投稿IDが不正です。");
  const notFoundMessage = page.getByText("投稿が見つかりません。");
  await expect(invalidIdMessage.or(notFoundMessage)).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("プロフィール更新で重複ハンドルを弾く", async ({ page }) => {
  await loginAsSeedAlice(page);
  await page.goto("/profile");

  await page.locator('input[name="handle"]').fill("bob");
  await page.getByRole("button", { name: "Update profile" }).click();
  await expect(page.getByRole("status")).toHaveText("このハンドルは既に使用されています。");
});

test("検索画面の空状態と0件状態を表示できる", async ({ page }) => {
  await page.goto("/search");
  await expect(page.getByText("キーワードを入力して検索してください。")).toBeVisible();

  const noHitQuery = `no-hit-${Date.now()}`;
  await page.goto(`/search?q=${noHitQuery}`);
  await expect(page.getByText("一致するユーザーは見つかりませんでした。")).toBeVisible();
  await expect(page.getByText("一致する投稿は見つかりませんでした。")).toBeVisible();
});

test("いいね更新失敗時にロールバックされエラー表示される", async ({ page, context }) => {
  await loginAsSeedAlice(page);
  await page.goto("/");

  const likeButton = page.getByRole("button", { name: /いいね/ }).first();
  await expect(likeButton).toBeVisible();
  const before = await likeButton.getAttribute("aria-label");
  await context.setOffline(true);
  await likeButton.click();
  await context.setOffline(false);

  await expect(page.getByText("リアクション更新に失敗しました。")).toBeVisible();
  await expect(likeButton).toHaveAttribute("aria-label", before ?? "いいねする");
});
