import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "playwright-scenario-recorder";
import { loginWithCredentials } from "../helpers/session";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: Authentication Flow", async ({ page }) => {
  test.setTimeout(60000);
  const recorder = new ScenarioRecorder(page, "auth-flow", "認証フロー", OUTPUT_DIR);

  await recorder.step(
    "サインアップページを表示",
    "`/signup` にアクセスし、サインアップページを表示します。",
    async (p) => {
      await p.goto("/signup");
      await expect(p.getByRole("heading", { name: "Sign up" })).toBeVisible();
    }
  );

  await recorder.step(
    "サインアップフォームを入力",
    "名前・メールアドレス・パスワードを入力します。**Create account** ボタンが操作対象です。",
    async (p) => {
      await p.getByPlaceholder("Your name").fill("Test User");
      await p.getByPlaceholder("you@example.com").fill("testuser-scenario@example.com");
      await p.getByPlaceholder("8 characters or more").fill("password1234");
    },
    {
      highlightTarget: page.getByRole("button", { name: "Create account" }),
    }
  );

  await recorder.step(
    "ログインページへ遷移",
    "`/login` にアクセスし、ログインページを表示します。",
    async (p) => {
      await p.goto("/login");
      await expect(p.getByRole("heading", { name: "Sign in" })).toBeVisible();
    }
  );

  await recorder.step(
    "ログインを実行",
    "`alice@example.com` のメールアドレスとパスワードを入力し、**Sign in** ボタンをクリックしてログインします。",
    async (p) => {
      await loginWithCredentials(p, "alice@example.com", "password1234");
      await expect(p.getByRole("button", { name: "Sign out" })).toBeVisible({ timeout: 10000 });
    }
  );

  await recorder.step(
    "ホーム画面の表示を確認",
    "ログイン後、ホーム画面に投稿コンポーザーが表示されていることを確認します。",
    async (p) => {
      await expect(p.getByPlaceholder("160文字以内で投稿")).toBeVisible({ timeout: 10000 });
    },
    {
      highlightTarget: page.getByPlaceholder("160文字以内で投稿"),
    }
  );

  recorder.generateMarkdown();
});
