import Link from "next/link";
import Countdown from "@/components/Countdown";

type Listing = {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  category: string | null;
  condition: string | null;
  deliveryMethod: string | null;
  sellerName: string | null;
  location: string | null;
  biddingStartsAt: string | null;
  biddingEndsAt: string | null;
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const now = new Date();
  const biddingActive =
    listing.biddingStartsAt &&
    listing.biddingEndsAt &&
    now >= new Date(listing.biddingStartsAt) &&
    now <= new Date(listing.biddingEndsAt);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block h-full no-underline group"
    >
      <div className="h-full border border-oat rounded-xl overflow-hidden bg-white clay-shadow transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative">
          {listing.imageUrl && (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-[220px] object-cover block"
            />
          )}
          {biddingActive && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-emerald-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Countdown endsAt={listing.biddingEndsAt!} />
            </div>
          )}
        </div>

        <div className="p-5">
          <span className="inline-block mb-3 px-3 py-1 rounded-[11px] bg-oat-light text-xs font-semibold text-warm-charcoal border border-oat">
            {listing.category ?? "General"}
          </span>

          <h3 className="text-lg font-semibold leading-snug tracking-tight mb-2 text-clay-black">
            {listing.title}
          </h3>

          <p className="text-xl font-bold mb-2 text-clay-black">
            ₺{listing.price}
          </p>

          <p className="text-sm text-warm-charcoal mb-1">
            {listing.location}
          </p>

          <p className="text-xs text-warm-silver">
            {listing.condition ?? "N/A"} • {listing.deliveryMethod ?? "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}