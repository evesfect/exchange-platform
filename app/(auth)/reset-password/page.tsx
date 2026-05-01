"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Invalid Link</h1>
            <p className="text-warm-charcoal mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-clay-black hover:text-matcha-600 transition"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Password Reset!</h1>
            <p className="text-warm-charcoal mb-6">
              Your password has been successfully updated.
            </p>
            <Link
              href="/login"
              className="clay-hover inline-block rounded-xl bg-clay-black px-6 py-3 text-sm font-medium text-white"
            >
              Log In
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
            Set new password
          </h1>
          <p className="text-warm-silver">
            Enter your new password below
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
              <label className="clay-label text-warm-charcoal">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                className="clay-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="clay-label text-warm-charcoal">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                className="clay-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-hover w-full rounded-xl bg-clay-black py-3 text-base font-medium text-white disabled:opacity-50 mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><p className="text-warm-silver">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
