"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/app/_infrastructure/db/prisma";
import { generateUniqueHandle } from "@/app/_infrastructure/auth/handle";

function mustString(fd: FormData, key: string) {
  const v = fd.get(key);
  if (typeof v !== "string") throw new Error(`${key} is required.`);
  return v;
}

export async function signUpWithEmailPassword(formData: FormData) {
  const emailRaw = mustString(formData, "email").trim().toLowerCase();
  const nameRaw = mustString(formData, "name").trim();
  const password = mustString(formData, "password");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    throw new Error("Invalid email.");
  }
  if (nameRaw.length === 0) throw new Error("Invalid name.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const existing = await prisma.user.findUnique({
    where: { email: emailRaw },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Email already in use.");
  }

  const handle = await generateUniqueHandle(prisma, emailRaw, nameRaw);
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email: emailRaw,
      name: nameRaw,
      handle,
      passwordHash,
    },
  });

  redirect("/login");
}

