import type { PrismaClient } from "@prisma/client";

import type { EmailPasswordUserRepository } from "@/app/_domain/auth/EmailPasswordUserRepository";
import { Email } from "@/app/_domain/auth/Email";
import { generateUniqueHandle } from "@/app/_infrastructure/auth/handle";

export class PrismaEmailPasswordUserRepository
  implements EmailPasswordUserRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async existsByEmail(email: Email): Promise<boolean> {
    const existing = await this.prisma.user.findUnique({
      where: { email: email.toString() },
      select: { id: true },
    });
    return !!existing;
  }

  async createUser(params: {
    email: Email;
    name: string;
    passwordHash: string;
  }): Promise<void> {
    const handle = await generateUniqueHandle(
      this.prisma,
      params.email.toString(),
      params.name
    );

    await this.prisma.user.create({
      data: {
        email: params.email.toString(),
        name: params.name,
        handle,
        passwordHash: params.passwordHash,
      },
    });
  }
}

