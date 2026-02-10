/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password1234', 12);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      handle: 'alice',
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      handle: 'bob',
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash,
    },
  });

  const post = await prisma.post.create({
    data: {
      authorId: alice.id,
      body: 'Hello from seed data!',
    },
  });

  await prisma.like.create({
    data: {
      userId: bob.id,
      postId: post.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
