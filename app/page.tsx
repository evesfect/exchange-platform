// app/page.tsx
import Link from "next/link";

const quickCategories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Furniture",
  "Others",
];

export default function HomePage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <div className="mx-auto max-w-6xl px-10 py-20 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Small label */}
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              Trusted second-hand marketplace for Istanbul
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Find great deals.
              <br />
              <span className="text-blue-600">Sell what you no longer need.</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Buy and sell pre-owned electronics, books, fashion, furniture, and
              more across Istanbul in one simple marketplace.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg md:flex-row">
              <input
                type="text"
                placeholder="Search for phones, books, furniture..."
                className="flex-1 rounded-xl border border-slate-200 px-5 py-4 text-base outline-none transition focus:border-blue-500"
              />
              <button className="rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700">
                Search
              </button>
            </div>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/listings"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Browse Listings
              </Link>
              <Link
                href="/listings/create"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Start Selling
              </Link>
            </div>

            {/* Quick categories */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href={`/listings?category=${category.toLowerCase()}`}
                  className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      </section>
    </main>
  );
}