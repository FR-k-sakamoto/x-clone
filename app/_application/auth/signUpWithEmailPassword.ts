import { Email } from "@/app/_domain/auth/Email";
import type { EmailPasswordUserRepository } from "@/app/_domain/auth/EmailPasswordUserRepository";
import type { PasswordHasher } from "@/app/_domain/auth/PasswordHasher";

export type SignUpWithEmailPasswordResult =
  | { ok: true }
  | { ok: false; message: string };

export async function signUpWithEmailPassword(
  deps: {
    userRepo: EmailPasswordUserRepository;
    passwordHasher: PasswordHasher;
  },
  input: { email: string; name: string; password: string }
): Promise<SignUpWithEmailPasswordResult> {
  let email: Email;
  try {
    email = Email.fromString(input.email.trim().toLowerCase());
  } catch {
    return { ok: false, message: "メールアドレスの形式が正しくありません。" };
  }

  const name = input.name.trim();
  if (name.length === 0) return { ok: false, message: "名前を入力してください。" };

  const password = input.password;
  if (password.length < 8) {
    return { ok: false, message: "パスワードは8文字以上にしてください。" };
  }

  const exists = await deps.userRepo.existsByEmail(email);
  if (exists) return { ok: false, message: "このメールアドレスは既に使用されています。" };

  const passwordHash = await deps.passwordHasher.hash(password);
  await deps.userRepo.createUser({ email, name, passwordHash });

  return { ok: true };
}

