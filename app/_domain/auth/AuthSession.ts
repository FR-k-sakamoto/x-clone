import { AuthUser } from "@/app/_domain/auth/AuthUser";

export class AuthSession {
  constructor(
    private readonly user: AuthUser,
    private readonly expiresAt: Date
  ) {}

  getUser() {
    return this.user;
  }

  getExpiresAt() {
    return this.expiresAt;
  }
}

