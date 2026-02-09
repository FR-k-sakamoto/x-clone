# アーキテクチャ方針

## レイヤ責務(アプリ配下)
- `app/_domain`
- 純粋な TypeScript クラス/型のみ
- Entity / ValueObject / Repository Interface を配置
- React / Next.js の機能(Hooks, API)は絶対に import しない

- `app/_application`
- ユースケース(UserStories)
- Domain オブジェクトを操作する関数/クラス

- `app/_infrastructure`
- 外部接続の具体実装
- API クライアント(fetch/axios)、Supabase、LocalStorage、リポジトリ実装

- `app/_components`
- プレゼンテーション
- UI のみを担当し、ドメインロジックは書かない

- `app/_hooks`
- アプリケーション層と UI 層の橋渡し

## Next.js 固有の責務
- Server Actions
- Application Layer のエントリーポイント
- ユースケース呼び出しをここに集約する

- RSC(Server Components)
- Infrastructure からデータ取得
- Domain インスタンス生成
- Client Component へ渡す
