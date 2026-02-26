import { expect, test } from "@playwright/test";

import { loginAsSeedAlice } from "./helpers/session";

test.describe.serial("ログイン後ドメイン網羅", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeedAlice(page);
  });

  test("auth: サインアウトできる", async ({ page }) => {
    await page.goto("/");
    const signOutButton = page.getByRole("button", { name: "Sign out" });
    await expect(signOutButton).toBeVisible({ timeout: 10000 });
    await signOutButton.click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Go to login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("timeline/post: タイムライン切替と投稿作成ができる", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "フォロー中" }).click();
    await expect(page.getByRole("button", { name: "フォロー中" })).toBeVisible();
    await page.getByRole("button", { name: "すべて" }).click();

    const uniqueText = `e2e-post-${Date.now()}`;
    const composer = page.getByPlaceholder("160文字以内で投稿");
    await composer.fill(uniqueText);
    await page.getByRole("button", { name: "Post" }).click();

    await expect(composer).toHaveValue("");
    await page.goto("/");
    await expect(page.getByText(uniqueText)).toBeVisible({ timeout: 10000 });
  });

  test("reaction/repost/reply: 反応操作と返信作成ができる", async ({ page }) => {
    await page.goto("/");

    const threadLink = page.getByRole("link", { name: "返信を見る" }).first();
    await expect(threadLink).toBeVisible();
    const card = threadLink.locator("xpath=ancestor::li[1]");

    const likeButton = card.getByRole("button", { name: /いいね/ });
    const likeBefore = await likeButton.getAttribute("aria-label");
    await likeButton.click();
    await expect(likeButton).toHaveAttribute(
      "aria-label",
      likeBefore === "いいねする" ? "いいねを解除" : "いいねする"
    );

    const repostButton = card.getByRole("button", { name: /リポスト/ });
    const repostBefore = await repostButton.getAttribute("aria-label");
    await repostButton.click();
    await expect(repostButton).toHaveAttribute(
      "aria-label",
      repostBefore === "リポストする" ? "リポストを解除" : "リポストする"
    );

    await threadLink.click();
    await expect(page.getByRole("heading", { name: "Thread" })).toBeVisible();

    const replyText = `e2e-reply-${Date.now()}`;
    const replyComposer = page.getByPlaceholder("160文字以内で返信");
    await replyComposer.fill(replyText);
    await page.getByRole("button", { name: "Reply" }).click();

    await expect(replyComposer).toHaveValue("");
    await expect(page.getByText(replyText)).toBeVisible();
  });

  test("search: 検索結果に seed ユーザーが表示される", async ({ page }) => {
    await page.goto("/search?q=alice");

    await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("link", { name: "@alice" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Users \(/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Posts \(/ })).toBeVisible();
  });

  test("follow/profile: フォロー切替とプロフィール更新ができる", async ({ page }) => {
    await page.goto("/u/bob");

    const followButton = page.getByRole("button", { name: /フォロー/ });
    await expect(followButton).toBeVisible();
    const before = await followButton.textContent();
    await followButton.click();
    await expect(followButton).not.toHaveText(before ?? "");

    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "Edit profile" })).toBeVisible();

    const bio = `e2e-bio-${Date.now()}`;
    const bioField = page.locator('textarea[name="bio"]');
    await bioField.fill(bio);
    await page.getByRole("button", { name: "Update profile" }).click();

    await expect(page.getByRole("status")).toHaveText("プロフィールを更新しました。");
    await page.goto("/u/alice");
    await expect(page.getByText(bio)).toBeVisible();
  });
});
