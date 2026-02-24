"use server";

import { redirect } from "next/navigation";

import { signUpWithEmailPassword as signUpUseCase } from "@/app/_application/auth/signUpWithEmailPassword";
import { BcryptPasswordHasher } from "@/app/_infrastructure/auth/BcryptPasswordHasher";
import { PrismaEmailPasswordUserRepository } from "@/app/_infrastructure/auth/PrismaEmailPasswordUserRepository";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { logOperationError, logOperationInfo, logOperationWarn } from "@/app/_infrastructure/logging/operationLogger";
import { assertServerActionCsrf } from "@/app/_infrastructure/security/assertServerActionCsrf";

export type SignUpState = { ok: boolean; message: string | null };

function getString(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export async function signUpWithEmailPassword(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  await assertServerActionCsrf();

  const email = getString(formData, "email");
  const name = getString(formData, "name");
  const password = getString(formData, "password");

  const userRepo = new PrismaEmailPasswordUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  let result: Awaited<ReturnType<typeof signUpUseCase>>;

  try {
    result = await signUpUseCase(
      { userRepo, passwordHasher },
      { email, name, password }
    );
  } catch (err) {
    logOperationError("auth.signup.failed", err);
    return { ok: false, message: "サインアップに失敗しました。" };
  }

  if (result.ok) {
    logOperationInfo("auth.signup.success");
    redirect("/login");
  }

  logOperationWarn("auth.signup.validation_failed", { message: result.message });
  return { ok: false, message: result.message };
}
