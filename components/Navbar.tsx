// components/Navbar.tsx

import Link from "next/link";
import { getSession } from "@/lib/session";
import UserMenu from "@/components/UserMenu";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function Navbar() {
  const session = await getSession();

  let userInitial = "U";
  let userEmail = "";

  if (session?.userId) {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(session.userId)));

    if (userRecord.length > 0) {
      userEmail = userRecord[0].email;
      userInitial = userRecord[0].email.charAt(0).toUpperCase();
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-oat bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            MaviPazar
          </span>
        </Link>

        {/* Right: Nav links + CTA */}
        <div className="flex items-center gap-6">
          <Link
            href="/listings"
            className="text-[15px] font-medium text-clay-black transition hover:text-matcha-600"
          >
            Browse
          </Link>

           {session ? (
            <>
              <UserMenu initial={userInitial} />

              <Link
                href="/listings/create"
                className="clay-hover rounded-xl bg-clay-black px-5 py-2 text-sm font-medium text-white"
              >
                Sell
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium text-clay-black transition hover:text-matcha-600"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="text-[15px] font-medium text-clay-black transition hover:text-matcha-600"
              >
                Sign Up
              </Link>

              <Link
                href="/listings/create"
                className="clay-hover rounded-xl bg-clay-black px-5 py-2 text-sm font-medium text-white"
              >
                Sell
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}