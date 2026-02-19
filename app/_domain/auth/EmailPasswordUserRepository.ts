import { Email } from "@/app/_domain/auth/Email";

export interface EmailPasswordUserRepository {
  existsByEmail(email: Email): Promise<boolean>;
  createUser(params: {
    email: Email;
    name: string;
    passwordHash: string;
  }): Promise<void>;
}

