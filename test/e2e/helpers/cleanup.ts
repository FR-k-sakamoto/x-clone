import { prisma } from "../../../app/_infrastructure/db/prisma";

/** テスト中に作成した投稿を本文で検索して削除（Like/Repost → 返信 → 投稿の順） */
export async function deletePostsByBody(body: string) {
  await prisma.like.deleteMany({ where: { post: { body } } });
  await prisma.repost.deleteMany({ where: { post: { body } } });
  await prisma.post.deleteMany({ where: { body, parentId: { not: null } } });
  await prisma.post.deleteMany({ where: { body } });
}

/** ユーザーの bio をリセット */
export async function resetUserBio(handle: string, bio: string) {
  await prisma.user.update({ where: { handle }, data: { bio } });
}
