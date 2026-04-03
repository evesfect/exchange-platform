// app/(auth)/register/page.tsx
'use client';

import { Button, Input, Card } from "@heroui/react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { useActionState } from "react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-4">
        <div className="flex flex-col items-center pb-4 pt-2 px-4">
          <h1 className="text-2xl font-bold">Join the Community</h1>
          <p className="text-default-500 text-sm">Create an account to start exchanging</p>
        </div>
        
        <form action={formAction} className="flex flex-col gap-4 px-4 pb-4">
          
          {state?.error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-md font-medium">
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" placeholder="Enter your email" type="email" required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input name="password" placeholder="Create a password" type="password" required />
          </div>
          
          <Button type="submit" variant="primary" className="w-full mt-2" isDisabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
          
          <div className="text-center text-sm mt-4">
            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
          </div>
        </form>
      </Card>
    </main>
  );
}