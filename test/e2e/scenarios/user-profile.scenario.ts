import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "playwright-scenario-recorder";
import { loginAsSeedAlice } from "../helpers/session";
import { resetUserBio } from "../helpers/cleanup";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: User Profile", async ({ page }) => {
  test.setTimeout(60000);
  await loginAsSeedAlice(page);

  const recorder = new ScenarioRecorder(page, "user-profile", "ユーザープロフィール", OUTPUT_DIR);

  await recorder.step(
    "Bobのプロフィールを表示",
    "`/u/bob` にアクセスし、Bobの公開プロフィールページを表示します。",
    async (p) => {
      await p.goto("/u/bob");
      await expect(p.getByText("@bob")).toBeVisible();
    }
  );

  await recorder.step(
    "Bobをフォロー",
    "**Follow** ボタンをクリックしてBobをフォローします。",
    async (p) => {
      const followBtn = p.getByRole("button", { name: "Follow" });
      if (await followBtn.isVisible().catch(() => false)) {
        await followBtn.click();
        await expect(p.getByRole("button", { name: "Following" })).toBeVisible({ timeout: 5000 });
      }
    },
    {
      highlightTarget: page.getByRole("button", { name: "Following" }),
    }
  );

  await recorder.step(
    "Bobのフォローを解除",
    "**Following** ボタンをクリックしてフォローを解除します。",
    async (p) => {
      const unfollowBtn = p.getByRole("button", { name: "Following" });
      if (await unfollowBtn.isVisible().catch(() => false)) {
        await unfollowBtn.click();
        await expect(p.getByRole("button", { name: "Follow" })).toBeVisible({ timeout: 5000 });
      }
    },
    {
      highlightTarget: page.getByRole("button", { name: "Follow" }),
    }
  );

  await recorder.step(
    "プロフィール編集ページへ遷移",
    "`/profile` にアクセスし、自分のプロフィール編集ページを表示します。",
    async (p) => {
      await p.goto("/profile");
      await expect(p.getByRole("heading", { name: "Edit profile" })).toBeVisible();
    }
  );

  await recorder.step(
    "自己紹介を更新",
    "自己紹介欄に新しいテキストを入力し、**Update profile** ボタンをクリックして保存します。",
    async (p) => {
      const bioField = p.locator('textarea[name="bio"]');
      await bioField.clear();
      await bioField.fill("Updated bio from E2E scenario test");
      await p.getByRole("button", { name: "Update profile" }).click();
      await expect(p.getByRole("status")).toBeVisible({ timeout: 10000 });
    },
    {
      highlightTarget: page.getByRole("button", { name: "Update profile" }),
    }
  );

  await recorder.step(
    "更新内容を確認",
    "`/u/alice` にアクセスし、自己紹介が正しく更新されていることを確認します。",
    async (p) => {
      await p.goto("/u/alice");
      await expect(p.getByText("Updated bio from E2E scenario test")).toBeVisible();
    }
  );

  recorder.generateMarkdown();

  await resetUserBio("alice", "");
});
