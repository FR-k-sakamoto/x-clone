
# E2E シナリオテスト（手順書自動生成）

Playwright で主要画面の操作シナリオを実行し、各ステップのスクリーンショット付き Markdown 手順書を自動生成する仕組みです。

## 概要

| シナリオファイル | 生成される手順書 | 内容 |
|---|---|---|
| `auth-flow.scenario.ts` | `auth-flow.md` | サインアップ・ログイン・ホーム画面表示 |
| `timeline-post.scenario.ts` | `timeline-post.md` | タイムライン閲覧・投稿・いいね・リポスト |
| `reply-thread.scenario.ts` | `reply-thread.md` | スレッド表示・返信投稿 |
| `user-profile.scenario.ts` | `user-profile.md` | プロフィール閲覧・フォロー・プロフィール編集 |
| `search.scenario.ts` | `search.md` | 検索ページ・キーワード検索・結果表示 |

## 使い方

### 前提条件

- PostgreSQL が起動していること
- シードデータが投入済みであること（`npx prisma db seed --config prisma.config.ts`）

### 手順書の生成

```bash
npm run test:e2e:docs
```

`docs/e2e-manual/` 以下に Markdown ファイルとスクリーンショットが出力されます。

```
docs/e2e-manual/
├── auth-flow.md
├── timeline-post.md
├── reply-thread.md
├── user-profile.md
├── search.md
└── screenshots/
    ├── auth-flow/
    │   ├── step-01.png
    │   └── ...
    ├── timeline-post/
    └── ...
```

> `docs/e2e-manual/` は `.gitignore` に登録済みのため、Git には含まれません。

### 通常の E2E テストと一緒に実行する場合

```bash
npm run test:e2e
```

シナリオテストも通常テストと同時に実行されます（`.scenario.ts` は `playwright.config.ts` の `testMatch` に含まれています）。

## 仕組み

### ScenarioRecorder

`test/e2e/helpers/scenario-recorder.ts` に定義されたコアクラスです。

```typescript
const recorder = new ScenarioRecorder(page, "scenario-name", "タイトル", OUTPUT_DIR);

await recorder.step(
  "ステップタイトル",
  "ステップの説明文（Markdown 記法可）",
  async (p) => {
    // Playwright の操作
  },
  {
    waitAfter: 500,                    // スクリーンショット前の追加待機（ms）
    highlightTarget: page.locator(...) // 赤枠でハイライトする要素
  }
);

recorder.generateMarkdown(); // Markdown ファイルを書き出し
```

各 `step()` の内部動作:

1. `action(page)` を実行
2. `waitAfter` があれば指定時間だけ待機
3. `domcontentloaded` を待機
4. `highlightTarget` があれば赤枠（`outline: 3px solid red`）を注入
5. Next.js 開発オーバーレイを非表示にする CSS を注入
6. スクリーンショットを撮影
7. オーバーレイ非表示 CSS と赤枠を除去
8. ステップ情報を記録

### ロケール設定

デフォルトは日本語（`ja`）です。英語に切り替える場合はオプションで指定します。

```typescript
const recorder = new ScenarioRecorder(page, "name", "Title", OUTPUT_DIR, { locale: "en" });
```

## 新しいシナリオを追加する

1. `test/e2e/scenarios/` に `<name>.scenario.ts` を作成
2. テスト名を `"Scenario: ..."` で始める（`test:e2e:docs` の `--grep` フィルタ対象）
3. `ScenarioRecorder` を使ってステップを記述
4. `npm run test:e2e:docs` で生成を確認

```typescript
import { test, expect } from "@playwright/test";
import { ScenarioRecorder } from "../helpers/scenario-recorder";
import { loginAsSeedAlice } from "../helpers/session";
import path from "path";

const OUTPUT_DIR = path.resolve(__dirname, "../../../docs/e2e-manual");

test("Scenario: My Feature", async ({ page }) => {
  await loginAsSeedAlice(page);
  const recorder = new ScenarioRecorder(page, "my-feature", "機能名", OUTPUT_DIR);

  await recorder.step(
    "ページを表示",
    "対象ページにアクセスします。",
    async (p) => {
      await p.goto("/path");
      await expect(p.getByRole("heading", { name: "Page Title" })).toBeVisible();
    }
  );

  recorder.generateMarkdown();
});
```
