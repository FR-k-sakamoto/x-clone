import { expect, test } from "@playwright/test";

test("ログイン失敗時はエラーを表示してログイン画面に留まる", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("you@example.com").fill("alice@example.com");
  await page.getByPlaceholder("••••••••").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("メールアドレスまたはパスワードが違います。")).toBeVisible();
});

test("ログイン画面の入力状態とサインアップ遷移が動作する", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  const submit = page.getByRole("button", { name: "Sign in" });
  await expect(submit).toBeDisabled();

  await page.getByPlaceholder("you@example.com").fill("alice@example.com");
  await page.getByPlaceholder("••••••••").fill("password1234");
  await expect(submit).toBeEnabled();

  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
});

test("サインアップ画面の入力状態とログイン遷移が動作する", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();

  const submit = page.getByRole("button", { name: "Create account" });
  await expect(submit).toBeDisabled();

  await page.getByPlaceholder("Your name").fill("E2E User");
  await page.getByPlaceholder("you@example.com").fill("e2e-user@example.com");
  await expect(submit).toBeEnabled();

  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("検索画面でクエリを入力すると URL に反映される", async ({ page }) => {
  await page.goto("/search");

  await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();

  const submit = page.getByRole("button", { name: "Search" });
  await expect(submit).toBeDisabled();

  await page.getByLabel("検索").fill("alice");
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page).toHaveURL(/\/search\?q=alice$/);
});
