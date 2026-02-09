# 開発フェーズ一覧(チェックリスト)

## Phase 0: 目的・スコープ確認
- [ ] CODEX.md の目的/スコープ/非スコープを確認
- [ ] 非機能要件(性能/可用性/セキュリティ/監視)の優先度を合意
- [ ] 受け入れ基準(簡易)の確認

## Phase 1: ワークフロー/リポジトリ準備
- [ ] Git Worktree 運用を開始(ドメイン単位で作成)
- [ ] ブランチ戦略の徹底(`main`/`develop`/`feature/{domain-name}/{task}`)
- [ ] develop から feature ブランチを派生する手順を共有

## Phase 2: アーキテクチャ土台
- [ ] ディレクトリ構成を `src/` 配下に整備(`domain`/`application`/`infrastructure`/`components`/`hooks`)
- [ ] Domain 層の方針(React/Next.js の import 禁止)を明文化
- [ ] Server Actions と RSC の責務境界を確認

## Phase 2.5: DB設計/マイグレーション/シード(Prisma)
- [ ] ドメインモデルに基づくテーブル/カラム設計
- [ ] Prisma スキーマ定義
- [ ] マイグレーション作成/適用
- [ ] 初期シード投入(開発用ユーザー/投稿など)
- [ ] DB 変更手順の共有(生成/適用/ロールバック)

## Phase 3: 実装(ドメイン別)
### Auth ドメイン
- [ ] Domain: 認証用 Entity/ValueObject/Repository Interface を定義
- [ ] Application: サインアップ/ログイン/ログアウトのユースケース実装
- [ ] Infrastructure: NextAuth + Prisma 接続実装
- [ ] Components/Hooks: 認証 UI とフロー接続

### User/Profile ドメイン
- [ ] Domain: User/Profile Entity/ValueObject 定義
- [ ] Application: プロフィール取得/更新ユースケース実装
- [ ] Infrastructure: User/Profile リポジトリ実装
- [ ] Components/Hooks: プロフィール表示/編集 UI

### Post(投稿)ドメイン
- [ ] Domain: Post Entity/ValueObject(文字数上限160)定義
- [ ] Application: 投稿作成/編集/削除ユースケース実装
- [ ] Infrastructure: Post リポジトリ実装
- [ ] Components/Hooks: 投稿フォーム/投稿表示 UI

### Timeline ドメイン
- [ ] Domain: Timeline 用モデル定義
- [ ] Application: 最新順/フォローのみ取得ユースケース実装
- [ ] Infrastructure: タイムライン取得実装
- [ ] Components/Hooks: 無限スクロール UI

### Reaction(いいね)ドメイン
- [ ] Domain: Like Entity/ValueObject 定義
- [ ] Application: いいね/解除ユースケース実装
- [ ] Infrastructure: Like リポジトリ実装
- [ ] Components/Hooks: いいね UI

### Repost(リポスト)ドメイン
- [ ] Domain: Repost Entity/ValueObject 定義
- [ ] Application: リポスト作成/解除ユースケース実装
- [ ] Infrastructure: Repost リポジトリ実装
- [ ] Components/Hooks: リポスト UI

### Reply(返信)ドメイン
- [ ] Domain: Reply/Thread Entity/ValueObject 定義
- [ ] Application: 返信作成/スレッド取得ユースケース実装
- [ ] Infrastructure: Reply リポジトリ実装
- [ ] Components/Hooks: 返信 UI/スレッド表示

### Follow ドメイン
- [ ] Domain: Follow Entity/ValueObject 定義
- [ ] Application: フォロー/解除ユースケース実装
- [ ] Infrastructure: Follow リポジトリ実装
- [ ] Components/Hooks: フォロー UI

### Search ドメイン
- [ ] Domain: Search Query/Result ValueObject 定義
- [ ] Application: 投稿/ユーザー検索ユースケース実装
- [ ] Infrastructure: 検索実装
- [ ] Components/Hooks: 検索 UI

### Optional(発展)ドメイン
- [ ] Domain: ハッシュタグ/ブックマーク/通知/非公開アカウント/画像投稿のモデル定義
- [ ] Application: 各ユースケース実装
- [ ] Infrastructure: 各リポジトリ実装
- [ ] Components/Hooks: 各 UI 実装

## Phase 4: UI/UX 仕上げ
- [ ] 主要操作が 3 クリック以内で到達できる導線確認
- [ ] 楽観的 UI の実装確認
- [ ] モバイル/デスクトップ対応確認

## Phase 5: 品質/セキュリティ
- [ ] 主要操作ログの記録
- [ ] 入力サニタイズ(XSS/CSRF)の確認
- [ ] エラー時の UI 表示確認

## Phase 6: 受け入れ/デプロイ
- [ ] 受け入れ基準の確認
- [ ] デプロイ準備(Render 設定)
- [ ] リリース手順の整理
