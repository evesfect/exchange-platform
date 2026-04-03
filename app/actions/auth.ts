// app/actions/auth.ts
'use server';

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
    }).returning();


    await createSession(newUser[0].id);

  } catch (error) {
    return { error: "Something went wrong" };
  }
  
  redirect("/dashboard");
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const userRecord = await db.select().from(users).where(eq(users.email, email));
  if (userRecord.length === 0) return { error: "Invalid credentials" };

  const user = userRecord[0];
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) return { error: "Invalid credentials" };

  await createSession(user.id);

  redirect("/dashboard");
}

export async function logoutUser() {
  await deleteSession();
  redirect("/login");
}