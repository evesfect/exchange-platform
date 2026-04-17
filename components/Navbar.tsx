// components/Navbar.tsx
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutUser } from "@/app/actions/auth";

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-oat bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">MaviPazar</span>
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
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-clay-black transition hover:text-matcha-600"
              >
                Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="text-[15px] font-medium text-warm-charcoal transition hover:text-clay-black"
                >
                  Log Out
                </button>
              </form>
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
            </>
          )}

          <Link
            href="/listings/create"
            className="clay-hover rounded-full bg-clay-black px-5 py-2 text-sm font-medium text-white"
          >
            Sell
          </Link>
        </div>
      </div>
    </nav>
  );
}