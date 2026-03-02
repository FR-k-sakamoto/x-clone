import bcrypt from "bcryptjs";

import type { PasswordHasher } from "@/app/_domain/auth/PasswordHasher";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 12);
  }
}

