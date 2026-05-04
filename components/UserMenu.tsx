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
    <div className="relative group">
      <button
        type="button"
        className="h-11 w-11 rounded-full bg-oat flex items-center justify-center font-semibold hover:bg-oat/70 transition"
      >
        {initial}
      </button>

      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-11 z-50 w-56 rounded-xl border border-oat bg-white shadow-lg p-2 transition">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-lg px-4 py-2 text-sm hover:bg-oat/40"
          >
            {item.title}
          </Link>
        ))}

        <form action={logoutUser}>
          <button
            type="submit"
            className="w-full text-left rounded-lg px-4 py-2 text-sm hover:bg-oat/40 text-pomegranate-400"
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
}