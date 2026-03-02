import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "playwright-scenario-recorder";
import { loginAsSeedAlice } from "../helpers/session";
import { deletePostsByBody } from "../helpers/cleanup";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: Reply Thread", async ({ page }) => {
  await loginAsSeedAlice(page);

  const recorder = new ScenarioRecorder(page, "reply-thread", "返信スレッド", OUTPUT_DIR);

  await recorder.step(
    "スレッドを開く",
    "投稿の **返信を見る** リンクをクリックし、スレッドページへ遷移します。",
    async (p) => {
      await p.goto("/");
      const replyLink = p.getByRole("link", { name: "返信を見る" }).first();
      await expect(replyLink).toBeVisible();
      await replyLink.click();
      await expect(p.getByRole("heading", { name: "Thread" })).toBeVisible();
    },
    {
      waitAfter: 500,
    }
  );

  await recorder.step(
    "返信テキストを入力",
    "返信コンポーザーにテキストを入力します。",
    async (p) => {
      await p.getByPlaceholder("160文字以内で返信").fill("E2Eテスト返信です！");
    },
    {
      highlightTarget: page.getByPlaceholder("160文字以内で返信"),
    }
  );

  await recorder.step(
    "返信を送信",
    "**Reply** ボタンをクリックして返信を送信します。",
    async (p) => {
      await p.getByRole("button", { name: "Reply" }).click();
    },
    {
      waitAfter: 1000,
      highlightTarget: page.getByRole("button", { name: "Reply" }),
    }
  );

  await recorder.step(
    "返信の表示を確認",
    "スレッド内に投稿した返信が表示されていることを確認します。",
    async (p) => {
      await expect(p.getByText("E2Eテスト返信です！").first()).toBeVisible({ timeout: 5000 });
    }
  );

  recorder.generateMarkdown();

  await deletePostsByBody("E2Eテスト返信です！");
});
