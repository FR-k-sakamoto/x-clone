import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "playwright-scenario-recorder";
import { loginAsSeedAlice } from "../helpers/session";
import { deletePostsByBody } from "../helpers/cleanup";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: Timeline and Post", async ({ page }) => {
  await loginAsSeedAlice(page);

  const recorder = new ScenarioRecorder(page, "timeline-post", "タイムラインと投稿", OUTPUT_DIR);

  await recorder.step(
    "ホームタイムラインを表示",
    "ホーム画面にアクセスし、タイムラインに既存の投稿が表示されていることを確認します。",
    async (p) => {
      await p.goto("/");
      await expect(p.getByRole("button", { name: "すべて" })).toBeVisible();
    }
  );

  await recorder.step(
    "「フォロー中」タブに切り替え",
    "**フォロー中** タブをクリックし、フォロー中のユーザーの投稿のみ表示します。",
    async (p) => {
      await p.getByRole("button", { name: "フォロー中" }).click();
    },
    {
      waitAfter: 500,
      highlightTarget: page.getByRole("button", { name: "フォロー中" }),
    }
  );

  await recorder.step(
    "「すべて」タブに切り替え",
    "**すべて** タブをクリックし、全投稿を表示します。",
    async (p) => {
      await p.getByRole("button", { name: "すべて" }).click();
    },
    {
      waitAfter: 500,
      highlightTarget: page.getByRole("button", { name: "すべて" }),
    }
  );

  await recorder.step(
    "新しい投稿を作成",
    "投稿コンポーザーにメッセージを入力し、**Post** ボタンをクリックして投稿します。",
    async (p) => {
      await p.getByPlaceholder("160文字以内で投稿").fill("E2Eテスト投稿です！");
      await p.getByRole("button", { name: "Post" }).click();
      await p.waitForTimeout(1000);
    },
    {
      highlightTarget: page.getByRole("button", { name: "Post" }),
    }
  );

  await recorder.step(
    "いいねボタンをクリック",
    "投稿の **いいね** ボタンをクリックし、いいねを付けます。",
    async (p) => {
      const likeBtn = p.getByRole("button", { name: "いいねする" }).first();
      await likeBtn.click();
    },
    {
      waitAfter: 500,
      highlightTarget: page.getByRole("button", { name: "いいねを解除" }).first(),
    }
  );

  await recorder.step(
    "リポストボタンをクリック",
    "投稿の **リポスト** ボタンをクリックし、リポストします。",
    async (p) => {
      const repostBtn = p.getByRole("button", { name: "リポストする" }).first();
      await repostBtn.click();
    },
    {
      waitAfter: 500,
      highlightTarget: page.getByRole("button", { name: "リポストを解除" }).first(),
    }
  );

  recorder.generateMarkdown();

  await deletePostsByBody("E2Eテスト投稿です！");
});
