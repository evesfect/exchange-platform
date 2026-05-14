// app/(user)/my-listings/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, listings } from "@/lib/schema";
import { getSession } from "@/lib/session";

function getDisplayName(email: string) {
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async function MyListingsPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(session.userId)));

  if (userRecord.length === 0) {
    redirect("/login");
  }

  const user = userRecord[0];
  const sellerName = getDisplayName(user.email);

  const myListings = await db
    .select()
    .from(listings)
    .where(eq(listings.sellerName, sellerName));

  return (
    <main className="mx-auto max-w-5xl w-full px-6 py-10">
      <div className="mb-6 text-sm text-warm-silver">
        <Link href="/dashboard" className="hover:text-clay-black">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>My Listings</span>
      </div>

      <div className="border-b border-oat pb-6 mb-8">
        <div className="clay-label text-warm-silver mb-2">Account</div>

        <h1 className="text-3xl font-semibold tracking-tight">My Listings</h1>

        <p className="text-warm-silver mt-1">
          Products listed by {sellerName}.
        </p>
      </div>

      {myListings.length === 0 ? (
        <div className="border border-dashed border-oat rounded-xl p-12 text-center">
          <p className="text-warm-silver">No products listed yet.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map((item) => (
            <Link
              key={item.id}
              href={`/listings/${item.id}`}
              className="block border border-oat rounded-xl p-5 bg-white transition hover:-translate-y-1 hover:shadow-md hover:border-clay-black"
            >
              <div className="clay-label text-warm-silver mb-2">
                {item.category}
              </div>

              <h2 className="font-semibold text-lg">{item.title}</h2>

              <p className="text-xl font-semibold mt-2">₺{item.price}</p>

              <p className="text-sm text-warm-silver mt-2">
                {item.location}
              </p>

              <p className="text-sm text-warm-silver mt-1">
                {item.condition} • {item.deliveryMethod}
              </p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}