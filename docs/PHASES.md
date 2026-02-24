# 開発フェーズ一覧(チェックリスト)

## Phase 0: 目的・スコープ確認
- [x] CODEX.md の目的/スコープ/非スコープを確認
- [x] 非機能要件(性能/可用性/セキュリティ/監視)の優先度を合意
- [x] 受け入れ基準(簡易)の確認

## Phase 1: ワークフロー/リポジトリ準備
- [x] Git Worktree 運用ルールを共有(作成は Phase 3 開始時)
- [x] ブランチ戦略の徹底(`main`/`develop`/`feature/{domain-name}/{task}`)
- [x] develop から feature ブランチを派生する手順を共有

## Phase 2: アーキテクチャ土台
- [x] ディレクトリ構成を `app/` 配下に整備(`_domain`/`_application`/`_infrastructure`/`_components`/`_hooks`)
- [x] Domain 層の方針(React/Next.js の import 禁止)を明文化
- [x] Server Actions と RSC の責務境界を確認

## Phase 2.5: DB設計/マイグレーション/シード(Prisma)
- [x] ドメインモデルに基づくテーブル/カラム設計
- [x] Prisma スキーマ定義
- [x] Supabase CLI を利用し、Docker で DB を構築
- [x] マイグレーション作成/適用
- [x] 初期シード投入(開発用ユーザー/投稿など)
- [x] DB 変更手順の共有(生成/適用/ロールバック)

## Phase 3: 実装(ドメイン別)
### Auth ドメイン
- [x] Domain: 認証用 Entity/ValueObject/Repository Interface を定義
- [x] Application: メール/パスワードのサインアップユースケース実装
- [x] Application: サインアップ/ログイン/ログアウトのユースケース実装(メール/パスワード)
- [x] Infrastructure: NextAuth(Credentials) + Prisma 接続実装
- [x] Components/Hooks: 認証 UI とフロー接続(ログイン/サインアップ)

### User/Profile ドメイン
- [x] Domain: User/Profile Entity/ValueObject 定義
- [x] Application: プロフィール取得/更新ユースケース実装
- [x] Infrastructure: User/Profile リポジトリ実装
- [x] Components/Hooks: プロフィール表示/編集 UI

### Post(投稿)ドメイン
- [x] Domain: Post Entity/ValueObject(文字数上限160)定義
- [x] Application: 投稿作成/編集/削除ユースケース実装
- [x] Infrastructure: Post リポジトリ実装
- [x] Components/Hooks: 投稿フォーム/投稿表示 UI

### Timeline ドメイン
- [x] Domain: Timeline 用モデル定義
- [x] Application: 最新順/フォローのみ取得ユースケース実装
- [x] Infrastructure: タイムライン取得実装
- [x] Components/Hooks: 無限スクロール UI

### Reaction(いいね)ドメイン
- [x] Domain: Like Entity/ValueObject 定義
- [x] Application: いいね/解除ユースケース実装
- [x] Infrastructure: Like リポジトリ実装
- [x] Components/Hooks: いいね UI

### Repost(リポスト)ドメイン
- [x] Domain: Repost Entity/ValueObject 定義
- [x] Application: リポスト作成/解除ユースケース実装
- [x] Infrastructure: Repost リポジトリ実装
- [x] Components/Hooks: リポスト UI

### Reply(返信)ドメイン
- [x] Domain: Reply/Thread Entity/ValueObject 定義
- [x] Application: 返信作成/スレッド取得ユースケース実装
- [x] Infrastructure: Reply リポジトリ実装
- [x] Components/Hooks: 返信 UI/スレッド表示

### Follow ドメイン
- [x] Domain: Follow Entity/ValueObject 定義
- [x] Application: フォロー/解除ユースケース実装
- [x] Infrastructure: Follow リポジトリ実装
- [x] Components/Hooks: フォロー UI

### Search ドメイン
- [x] Domain: Search Query/Result ValueObject 定義
- [x] Application: 投稿/ユーザー検索ユースケース実装
- [x] Infrastructure: 検索実装
- [x] Components/Hooks: 検索 UI

## Phase 4: UI/UX 仕上げ
- [x] 主要操作が 3 クリック以内で到達できる導線確認
- [x] 楽観的 UI の実装確認
- [x] モバイル/デスクトップ対応確認

## Phase 5: 品質/セキュリティ
- [ ] 主要操作ログの記録
- [ ] 入力サニタイズ(XSS/CSRF)の確認
- [ ] エラー時の UI 表示確認

## Phase 6: 受け入れ/デプロイ
- [ ] 受け入れ基準の確認
- [ ] デプロイ準備(Render 設定)
- [ ] リリース手順の整理

## Phase 7: Optional(発展)ドメイン
- [ ] Domain: ハッシュタグ/ブックマーク/通知/非公開アカウント/画像投稿のモデル定義
- [ ] Application: 各ユースケース実装
- [ ] Infrastructure: 各リポジトリ実装
- [ ] Components/Hooks: 各 UI 実装
