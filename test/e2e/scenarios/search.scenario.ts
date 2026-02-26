import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "playwright-scenario-recorder";
import { loginAsSeedAlice } from "../helpers/session";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: Search", async ({ page }) => {
  await loginAsSeedAlice(page);

  const recorder = new ScenarioRecorder(page, "search", "検索", OUTPUT_DIR);

  await recorder.step(
    "検索ページを表示",
    "`/search` にアクセスし、検索ページを表示します。",
    async (p) => {
      await p.goto("/search");
      await expect(p.getByRole("heading", { name: "Search" })).toBeVisible();
    }
  );

  await recorder.step(
    "検索キーワードを入力",
    "検索フォームにキーワードを入力します。",
    async (p) => {
      await p.getByPlaceholder("ユーザー・投稿を検索").fill("alice");
    },
    {
      highlightTarget: page.getByPlaceholder("ユーザー・投稿を検索"),
    }
  );

  await recorder.step(
    "検索を実行",
    "**Search** ボタンをクリックして検索を実行します。",
    async (p) => {
      await p.getByRole("button", { name: "Search" }).click();
    },
    {
      waitAfter: 1000,
      highlightTarget: page.getByRole("button", { name: "Search" }),
    }
  );

  await recorder.step(
    "検索結果を確認",
    "検索結果に **Users** セクションと **Posts** セクションが表示されていることを確認します。",
    async (p) => {
      await expect(p.getByRole("heading", { name: /^Users/ })).toBeVisible({ timeout: 5000 });
      await expect(p.getByRole("heading", { name: /^Posts/ })).toBeVisible();
    }
  );

  recorder.generateMarkdown();
});
