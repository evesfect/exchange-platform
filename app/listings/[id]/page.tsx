"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  createdAt: string;
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchListing() {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/listings/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch listing");
        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [params]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-warm-silver">Loading listing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-pomegranate-400">{error}</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-warm-silver">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <Link
          href="/listings"
          className="text-sm font-medium text-warm-charcoal hover:text-clay-black transition"
        >
          ← Back to listings
        </Link>
      </div>

      <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Image */}
        <div>
          {listing.imageUrl && (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full max-h-[500px] object-cover rounded-3xl block clay-shadow"
            />
          )}
        </div>

        {/* Details Card */}
        <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
          <span className="inline-block mb-4 px-3 py-1 rounded-[11px] bg-oat-light text-xs font-semibold text-warm-charcoal border border-oat">
            {listing.category ?? "General"}
          </span>

          <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.64px] text-clay-black mb-3">
            {listing.title}
          </h1>

          <p className="text-[28px] font-bold text-clay-black mb-6">
            ₺{listing.price}
          </p>

          <div className="grid gap-3 mb-6 text-[15px] text-warm-charcoal">
            <p>
              <strong className="text-clay-black">Location:</strong>{" "}
              {listing.location ?? "N/A"}
            </p>
            <p>
              <strong className="text-clay-black">Condition:</strong>{" "}
              {listing.condition ?? "N/A"}
            </p>
            <p>
              <strong className="text-clay-black">Delivery:</strong>{" "}
              {listing.deliveryMethod ?? "N/A"}
            </p>
            <p>
              <strong className="text-clay-black">Seller:</strong>{" "}
              {listing.sellerName ?? "N/A"}
            </p>
          </div>

          <hr className="border-oat mb-6" />

          <div className="clay-label text-warm-silver mb-3">Description</div>
          <p className="text-warm-charcoal leading-relaxed">
            {listing.description}
          </p>
        </div>
      </div>
    </div>
  );
}