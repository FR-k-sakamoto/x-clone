import { AuthUserId } from "@/app/_domain/auth/AuthUserId";
import { Email } from "@/app/_domain/auth/Email";

export class AuthUser {
  constructor(
    private readonly id: AuthUserId,
    private readonly email: Email,
    private readonly name: string,
    private readonly imageUrl?: string | null
  ) {
    if (name.trim().length === 0) throw new Error("AuthUser.name must be non-empty.");
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getName() {
    return this.name;
  }

  getImageUrl() {
    return this.imageUrl ?? null;
  }
}

