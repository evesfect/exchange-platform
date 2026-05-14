// components/UserMenu.tsx

import Link from "next/link";
import { logoutUser } from "@/app/actions/auth";

type UserMenuProps = {
  initial: string;
};

const menuItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Liked Products", href: "/liked" },
  { title: "My Listings", href: "/my-listings" },
  { title: "Past Purchases", href: "/purchases" },
  { title: "Offers", href: "/offers" },
  { title: "Cart", href: "/cart" },
  { title: "Settings", href: "/settings" },
];

export default function UserMenu({ initial }: UserMenuProps) {
  return (
    <details className="relative">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-oat font-semibold transition hover:bg-oat/70 [&::-webkit-details-marker]:hidden">
        {initial}
      </summary>

      <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-oat bg-white p-2 shadow-lg">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-lg px-4 py-2 text-sm hover:bg-oat/40"
          >
            {item.title}
          </Link>
        ))}

        <div className="my-2 border-t border-oat" />

        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2 text-left text-sm text-pomegranate-400 hover:bg-oat/40"
          >
            Log Out
          </button>
        </form>
      </div>
    </details>
  );
}