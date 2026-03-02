# ワークフロー運用

## Git Worktree 運用
- ドメイン(機能単位)ごとに Worktree を作成し、並列開発する
- 依存がある場合は、共通ドメインのインターフェースを先に定義する

### Worktree 作成手順(例)
- `git worktree add ../x-clone-{domain} feature/{domain}/{task}`
- 例: `git worktree add ../x-clone-auth feature/auth/login`

## ブランチ戦略
- `main`: デプロイ用
- `develop`: 開発用
- `feature/{domain-name}/{task}`: 作業用(必ず `develop` から派生)

### feature ブランチ作成手順
- `git checkout develop`
- `git pull`
- `git checkout -b feature/{domain-name}/{task}`

## 共有事項
- Phase 進行は `docs/PHASES.md` のチェックリストで管理する
- 作業完了時は確認依頼を行い、承認後にチェックを付ける
