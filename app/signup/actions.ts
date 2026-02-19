"use server";

import { redirect } from "next/navigation";

import { signUpWithEmailPassword as signUpUseCase } from "@/app/_application/auth/signUpWithEmailPassword";
import { prisma } from "@/app/_infrastructure/db/prisma";
import { PrismaEmailPasswordUserRepository } from "@/app/_infrastructure/auth/PrismaEmailPasswordUserRepository";
import { BcryptPasswordHasher } from "@/app/_infrastructure/auth/BcryptPasswordHasher";

export type SignUpState = { ok: boolean; message: string | null };

function getString(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export async function signUpWithEmailPassword(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = getString(formData, "email");
  const name = getString(formData, "name");
  const password = getString(formData, "password");

  const userRepo = new PrismaEmailPasswordUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();

  try {
    const result = await signUpUseCase(
      { userRepo, passwordHasher },
      { email, name, password }
    );

    if (result.ok) {
      redirect("/login");
    }

    return { ok: false, message: result.message };
  } catch (err) {
    console.error("[auth][signup][action]", err);
    return { ok: false, message: "サインアップに失敗しました。" };
  }
}
