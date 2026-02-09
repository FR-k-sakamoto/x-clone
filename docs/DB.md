# DB 設計/マイグレーション/シード(Phase 2.5)

## 方針
- DB は Supabase(Postgres) を利用する
- ローカル開発は Supabase CLI + Docker で起動する
- ORM は Prisma を利用する

## ローカル DB セットアップ(Supabase CLI + Docker)
1. Supabase CLI のインストール
- `npm i -D supabase`

2. Docker 起動(Desktop など)

3. 初期化
- `npx supabase init`

4. ローカル起動
- `npx supabase start`

## Prisma 設定
- `prisma/schema.prisma` を編集
- `prisma.config.ts` で接続先を参照する
- `prisma.config.ts` 先頭で `dotenv/config` を読み込む
- 環境変数を設定(例)
- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- `DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- `PRISMA_CLIENT_ENGINE_TYPE=binary`

## マイグレーション手順
- `npx prisma migrate dev -n init`
- `npx supabase db reset`

## シード手順
- `npx prisma db seed --config prisma.config.ts`

## シード設定
- `prisma.config.ts` の `migrations.seed` に `node prisma/seed.js` を指定
- `prisma/seed.js` で `dotenv/config` を読み込み、`DATABASE_URL` を参照する
- Prisma v7 では adapter が必要なため `@prisma/adapter-pg` を使用する

## 変更手順(生成/適用/ロールバック)
- 変更
- `prisma/schema.prisma` を更新
- 生成/適用
- `npx prisma migrate dev -n {change-name}`
- ロールバック
- `npx supabase db reset`

## 補足
- Supabase の `supabase/migrations/` と Prisma の `prisma/migrations/` を二重管理しない
- Prisma の `prisma/migrations/` を正とし、Supabase はローカル起動とリセット用途で使う
