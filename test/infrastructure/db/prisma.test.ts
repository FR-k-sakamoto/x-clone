import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = process.env;

type MockFactories = {
  PrismaClient: ReturnType<typeof vi.fn>;
  PrismaPg: ReturnType<typeof vi.fn>;
};

async function importPrismaModuleWithMocks(
  env: NodeJS.ProcessEnv,
  existingGlobalPrisma?: unknown,
) {
  vi.resetModules();
  vi.clearAllMocks();
  process.env = { ...originalEnv, ...env };

  if (existingGlobalPrisma === undefined) {
    delete (globalThis as { __prisma?: unknown }).__prisma;
  } else {
    (globalThis as { __prisma?: unknown }).__prisma = existingGlobalPrisma;
  }

  const PrismaClient = vi.fn();
  const PrismaPg = vi.fn();

  vi.doMock("@prisma/client", () => ({ PrismaClient }));
  vi.doMock("@prisma/adapter-pg", () => ({ PrismaPg }));

  return {
    modulePromise: import("@/app/_infrastructure/db/prisma"),
    mocks: { PrismaClient, PrismaPg } satisfies MockFactories,
  };
}

describe("Prismaクライアント初期化", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete (globalThis as { __prisma?: unknown }).__prisma;
  });

  afterEach(() => {
    process.env = originalEnv;
    delete (globalThis as { __prisma?: unknown }).__prisma;
    vi.restoreAllMocks();
  });

  it("DATABASE_URLが未設定なら例外を投げる", async () => {
    const { modulePromise } = await importPrismaModuleWithMocks({
      DATABASE_URL: "",
      NODE_ENV: "test",
    });

    await expect(modulePromise).rejects.toThrow("Missing DATABASE_URL for PrismaClient.");
  });

  it("非production環境ではアダプタとクライアントを作成してグローバルにキャッシュする", async () => {
    const connectionString = "postgres://local/test";
    const adapter = { kind: "adapter" };
    const client = { kind: "client" };
    const { modulePromise, mocks } = await importPrismaModuleWithMocks({
      DATABASE_URL: connectionString,
      NODE_ENV: "development",
    });

    mocks.PrismaPg.mockReturnValue(adapter);
    mocks.PrismaClient.mockReturnValue(client);

    const { prisma } = await modulePromise;

    expect(mocks.PrismaPg).toHaveBeenCalledWith({ connectionString });
    expect(mocks.PrismaClient).toHaveBeenCalledWith({ adapter });
    expect(prisma).toBe(client);
    expect((globalThis as { __prisma?: unknown }).__prisma).toBe(client);
  });

  it("production環境ではグローバルにキャッシュしない", async () => {
    const adapter = { kind: "adapter" };
    const client = { kind: "client" };
    const { modulePromise, mocks } = await importPrismaModuleWithMocks({
      DATABASE_URL: "postgres://local/prod",
      NODE_ENV: "production",
    });

    mocks.PrismaPg.mockReturnValue(adapter);
    mocks.PrismaClient.mockReturnValue(client);

    const { prisma } = await modulePromise;

    expect(prisma).toBe(client);
    expect((globalThis as { __prisma?: unknown }).__prisma).toBeUndefined();
  });

  it("既存のグローバルクライアントがあれば新規作成せず再利用する", async () => {
    const existing = { kind: "existing-client" };
    const { modulePromise, mocks } = await importPrismaModuleWithMocks(
      {
        DATABASE_URL: "postgres://local/reused",
        NODE_ENV: "development",
      },
      existing,
    );

    const { prisma } = await modulePromise;

    expect(prisma).toBe(existing);
    expect(mocks.PrismaPg).not.toHaveBeenCalled();
    expect(mocks.PrismaClient).not.toHaveBeenCalled();
  });
});
