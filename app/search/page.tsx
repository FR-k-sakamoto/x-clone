import Link from "next/link";

import { searchAll } from "@/app/_application/search/searchAll";
import { SearchForm } from "@/app/_components/search/SearchForm";
import { SearchResults } from "@/app/_components/search/SearchResults";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaSearchRepository } from "@/app/_infrastructure/search/PrismaSearchRepository";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  const result = await searchAll(
    { searchRepo: new PrismaSearchRepository(prisma) },
    { query: q }
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-14 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Search</h1>
          <Link href="/" className="text-sm text-zinc-700 underline">
            Back to home
          </Link>
        </header>

        <SearchForm initialQuery={result.query} />
        <SearchResults query={result.query} users={result.users} posts={result.posts} />
      </div>
    </div>
  );
}
