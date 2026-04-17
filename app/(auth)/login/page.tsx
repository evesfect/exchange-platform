// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-warm-silver">Log in to manage your exchanges</p>
        </div>

        <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
          <form action={formAction} className="flex flex-col gap-5">
            {state?.error && (
              <div className="bg-pomegranate-400/10 text-pomegranate-400 text-sm p-3 rounded-xl font-medium border border-pomegranate-400/20">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="clay-label text-warm-charcoal">Email</label>
              <input
                name="email"
                placeholder="Enter your email"
                type="email"
                required
                className="clay-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="clay-label text-warm-charcoal">Password</label>
              <input
                name="password"
                placeholder="Enter your password"
                type="password"
                required
                className="clay-input"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="clay-hover w-full rounded-xl bg-clay-black py-3 text-base font-medium text-white disabled:opacity-50 mt-2"
            >
              {isPending ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-warm-silver mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-clay-black font-medium hover:text-matcha-600 transition"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}