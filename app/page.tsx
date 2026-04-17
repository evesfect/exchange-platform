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
    <main>
      {/* Hero Section */}
      <section className="border-b border-oat">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Uppercase label */}
            <div className="clay-label text-warm-silver mb-6">
              Istanbul&apos;s Marketplace
            </div>

            {/* Display heading */}
            <h1 className="text-5xl md:text-[80px] font-semibold leading-none tracking-[-3.2px] text-clay-black mb-6">
              Find great deals.
              <br />
              <span className="text-matcha-600">Sell with ease.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl leading-relaxed text-warm-silver max-w-2xl mx-auto mb-10">
              Buy and sell pre-owned electronics, books, fashion, furniture, and
              more across Istanbul in one simple marketplace.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                href="/listings"
                className="clay-hover rounded-xl bg-clay-black px-8 py-3.5 text-base font-medium text-white"
              >
                Browse Listings
              </Link>
              <Link
                href="/listings/create"
                className="clay-hover rounded-xl border border-[#717989] bg-transparent px-8 py-3.5 text-base font-medium text-clay-black"
              >
                Start Selling
              </Link>
            </div>

            {/* Quick category pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href={`/listings?category=${category.toLowerCase()}`}
                  className="rounded-3xl border border-oat bg-white px-4 py-2 text-sm font-medium text-warm-charcoal transition hover:border-matcha-600 hover:text-matcha-600"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Colored Feature Section — Matcha */}
      <section className="bg-matcha-800 text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="clay-label text-matcha-300 mb-4">How it works</div>
            <h2 className="text-4xl md:text-[44px] font-semibold leading-tight tracking-[-1.32px] mb-6">
              Simple, safe, local
            </h2>
            <p className="text-lg leading-relaxed text-matcha-300">
              List your items, connect with buyers in Istanbul, and exchange
              safely. No shipping hassles, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                title: "List it",
                desc: "Create a listing in seconds with photos and details.",
              },
              {
                title: "Connect",
                desc: "Chat with interested buyers and arrange a meetup.",
              },
              {
                title: "Exchange",
                desc: "Meet locally and complete the exchange safely.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm"
              >
                <div className="text-matcha-300 font-semibold text-sm mb-3">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-matcha-300 text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}