// app/(auth)/login/page.tsx
'use client';

import { Button, Input, Card } from "@heroui/react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  // Hook up the server action to track its state and pending status
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-4">
        <div className="flex flex-col items-center pb-4 pt-2 px-4">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-default-500 text-sm">Log in to manage your exchanges</p>
        </div>
        
        {/* Use the new formAction */}
        <form action={formAction} className="flex flex-col gap-4 px-4 pb-4">
          
          {/* Display the error if the server action returns one */}
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
            <Input name="password" placeholder="Enter your password" type="password" required />
          </div>
          
          <Button type="submit" variant="primary" className="w-full mt-2" isDisabled={isPending}>
            {isPending ? "Logging in..." : "Log In"}
          </Button>
          
          <div className="text-center text-sm mt-4">
            Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link>
          </div>
        </form>
      </Card>
    </main>
  );
}