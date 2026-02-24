import type { PrismaClient } from "@prisma/client";

import type { SearchRepository } from "@/app/_domain/search/SearchRepository";
import type { SearchQuery } from "@/app/_domain/search/SearchQuery";
import { SearchPostResult, SearchUserResult } from "@/app/_domain/search/SearchResult";

export class PrismaSearchRepository implements SearchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async searchUsers(params: { query: SearchQuery; limit: number }): Promise<SearchUserResult[]> {
    const q = params.query.toString();

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { handle: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
          { bio: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: [{ handle: "asc" }],
      take: params.limit,
      select: {
        id: true,
        handle: true,
        name: true,
        bio: true,
      },
    });

    return users.map(
      (user) =>
        new SearchUserResult(user.id, user.handle, user.name, user.bio ?? "")
    );
  }

  async searchPosts(params: { query: SearchQuery; limit: number }): Promise<SearchPostResult[]> {
    const q = params.query.toString();

    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          { body: { contains: q, mode: "insensitive" } },
          { author: { handle: { contains: q, mode: "insensitive" } } },
          { author: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      orderBy: [{ createdAt: "desc" }],
      take: params.limit,
      select: {
        id: true,
        authorId: true,
        body: true,
        createdAt: true,
        author: {
          select: {
            handle: true,
          },
        },
      },
    });

    return posts.map(
      (post) =>
        new SearchPostResult(
          post.id,
          post.authorId,
          post.author.handle,
          post.body,
          post.createdAt
        )
    );
  }
}
