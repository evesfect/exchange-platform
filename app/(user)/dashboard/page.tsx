import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";

function getDisplayName(email: string) {
  const name = email.split("@")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const dashboardItems = [
  { title: "Liked Products", description: "View products you saved or liked.", href: "/liked" },
  { title: "My Listings", description: "Manage your posted products.", href: "/my-listings" },
  { title: "Past Purchases", description: "View your previous purchases.", href: "/purchases" },
  { title: "Offers", description: "View and manage incoming offers.", href: "/offers" },
  { title: "Cart", description: "View items you plan to buy.", href: "/cart" },
  { title: "Settings", description: "Manage your account preferences.", href: "/settings" },
];

export default async function DashboardPage() {
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
  const displayName = getDisplayName(user.email);

  return (
    <main className="mx-auto max-w-5xl w-full px-6 py-10">
      <div className="border-b border-oat pb-6 mb-8">
        <div className="clay-label text-warm-silver mb-2">Account</div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-warm-silver mt-1">
          Manage your marketplace activity in one place.
        </p>
      </div>

      <section className="bg-matcha-300/15 border border-matcha-600/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-matcha-600/20 flex items-center justify-center font-semibold text-matcha-800">
            {displayName.charAt(0)}
          </div>

          <div>
            <h2 className="font-semibold text-lg text-matcha-800">
              {displayName}
            </h2>
            <p className="text-sm text-matcha-600">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="border border-oat rounded-xl p-5 hover:bg-oat/30 transition"
          >
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-warm-silver mt-1">{item.description}</p>
          </Link>
        ))}
      </section>

      <section className="border border-dashed border-oat rounded-xl p-8 text-center mt-8">
        <h3 className="font-semibold">Recent Activity</h3>
        <p className="text-sm text-warm-silver mt-1">No recent activity yet.</p>
      </section>
    </main>
  );
}