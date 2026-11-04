"use server";

import bcrypt from "bcryptjs";
import { SignUpFormValues, signUpSchema } from "~/schemas/auth";
import { db } from "~/server/db";

export async function signUp(data: SignUpFormValues) {
  try {
    const validatedData = await signUpSchema.parseAsync(data);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        credits: 1000000,
      },
    });

    return { success: "Akun berhasil dibuat! Silakan masuk." };
  } catch (error: any) {
    if (
      error?.name === "ZodError" &&
      Array.isArray(error?.errors) &&
      error.errors.length > 0
    ) {
      return { error: error.errors[0].message };
    }

    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }
}
