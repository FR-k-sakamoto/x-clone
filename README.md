X(旧Twitter)クローンの開発用リポジトリです。

## Getting Started

ローカルDB(Supabase)を起動:

```bash
npx supabase start
```

初回 or スキーマ変更後にマイグレーション/シード:

```bash
npx prisma migrate dev
npx prisma db seed --config prisma.config.ts
```

開発サーバ起動:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Auth(メール/パスワード)
- サインアップ: `http://localhost:3000/signup`
- ログイン: `http://localhost:3000/login`

シードユーザー:
- `alice@example.com` / `password1234`
- `bob@example.com` / `password1234`

`.env` の `NEXTAUTH_SECRET` はローカルでも必須です。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy
Render を想定(詳細は `CODEX.md` / `docs/` 配下)。
