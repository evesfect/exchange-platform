"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Check your email</h1>
            <p className="text-warm-charcoal mb-6">
              If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link.
            </p>
            <Link
              href="/login"
              className="text-sm font-medium text-clay-black hover:text-matcha-600 transition"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Forgot password?
          </h1>
          <p className="text-warm-silver">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-pomegranate-400/10 text-pomegranate-400 text-sm p-3 rounded-xl font-medium border border-pomegranate-400/20">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="clay-label text-warm-charcoal">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="clay-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-hover w-full rounded-xl bg-clay-black py-3 text-base font-medium text-white disabled:opacity-50 mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-warm-silver mt-2">
              <Link
                href="/login"
                className="text-clay-black font-medium hover:text-matcha-600 transition"
              >
                ← Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
