"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";

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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        listings
          .map((l) => l.category)
          .filter((c): c is string => Boolean(c))
      )
    );
    return ["All", ...unique];
  }, [listings]);

  const filteredListings = useMemo(() => {
    if (selectedCategory === "All") return listings;
    return listings.filter((l) => l.category === selectedCategory);
  }, [listings, selectedCategory]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl w-full px-6 py-10">
        <p className="text-warm-silver">Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl w-full px-6 py-10">
        <p className="text-pomegranate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-6 py-10">
      <div className="mb-8">
        <div className="clay-label text-warm-silver mb-2">Marketplace</div>
        <h1 className="text-[32px] font-semibold tracking-[-0.64px] text-clay-black mb-1">
          Listings
        </h1>
        <p className="text-warm-silver">
          Browse available listings around Istanbul.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-clay-black text-white border border-clay-black"
                  : "bg-white text-warm-charcoal border border-oat hover:border-clay-black hover:text-clay-black"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredListings.length === 0 ? (
        <div className="border border-dashed border-oat rounded-xl p-8 bg-white">
          <p className="text-warm-silver">
            No listings found for this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}