// components/Navbar.tsx
import Link from 'next/link';
import { getSession } from "@/lib/session";
import { logoutUser } from "@/app/actions/auth";

export async function Navbar() {
  // Check if the user is securely logged in
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-10">
        
        {/* Left: Logo / Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-extrabold text-white shadow-md">
            M
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              MaviPazar
            </span>
            <span className="text-sm font-medium text-blue-600">
              Istanbul Marketplace
            </span>
          </div>
        </Link>

        {/* Center: Categories */}
        <div className="hidden lg:flex items-center gap-7 text-base font-medium text-slate-700">
          <Link href="/listings?category=electronics" className="transition hover:text-blue-600">
            Electronics
          </Link>
          <Link href="/listings?category=books" className="transition hover:text-blue-600">
            Books
          </Link>
          <Link href="/listings?category=fashion" className="transition hover:text-blue-600">
            Fashion
          </Link>
          <Link href="/listings?category=sports" className="transition hover:text-blue-600">
            Sports
          </Link>
          <Link href="/listings?category=furniture" className="transition hover:text-blue-600">
            Furniture
          </Link>
          <Link href="/listings?category=others" className="transition hover:text-blue-600">
            Others
          </Link>

          <Link
            href="/listings"
            className="flex items-center gap-2 font-medium text-slate-800 transition hover:text-blue-600"
          >
            <span className="text-lg">⌘</span>
            <span>All Categories</span>
          </Link>
        </div>

        {/* Right: Auth + Sell */}
        <div className="flex shrink-0 items-center gap-5 text-base">
          {session ? (
            // IF LOGGED IN: Show Dashboard and Logout
            <>
              <Link
                href="/dashboard"
                className="font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="font-semibold text-slate-700 transition hover:text-blue-600"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            // IF NOT LOGGED IN: Show Login and Sign Up
            <>
              <Link
                href="/login"
                className="font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Sell Button remains visible to everyone */}
          <Link
            href="/listings/create"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Sell
          </Link>
        </div>
      </div>
    </nav>
  );
}