import Link from "next/link";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-5xl w-full px-6 py-10">
        <div className="mb-6 text-sm text-warm-silver">
            <Link href="/dashboard" className="hover:text-clay-black">
                Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span>Cart</span>
        </div>

      <div className="border-b border-oat pb-6 mb-8">
        <div className="clay-label text-warm-silver mb-2">Account</div>
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
        <p className="text-warm-silver mt-1">
          Products in your cart will appear here.
        </p>
      </div>

      <div className="border border-dashed border-oat rounded-xl p-12 text-center">
        <p className="text-warm-silver">No products in your cart yet.</p>
      </div>
    </main>
  );
}