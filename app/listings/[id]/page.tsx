"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import SetBiddingForm from "@/components/SetBiddingForm";
import PlaceBidForm from "@/components/PlaceBidForm";
import BidsList from "@/components/BidsList";

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
  userId: number | null;
  biddingStartsAt: string | null;
  biddingEndsAt: string | null;
  createdAt: string;
};

type Bid = {
  id: number;
  amount: string;
  createdAt: string;
  userId: number;
  userEmail: string;
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [resolvedId, setResolvedId] = useState<string>("");

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setCurrentUserId(data.userId);
      } catch {}
    }
    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchListing() {
      try {
        const resolvedParams = await params;
        setResolvedId(resolvedParams.id);
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

  const fetchBids = useCallback(async () => {
    if (!resolvedId) return;
    try {
      const res = await fetch(`/api/listings/${resolvedId}/bids`);
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      }
    } catch {}
  }, [resolvedId]);

  useEffect(() => {
    if (resolvedId && listing?.biddingStartsAt) {
      fetchBids();
    }
  }, [resolvedId, listing?.biddingStartsAt, fetchBids]);

  const isOwner = currentUserId !== null && listing?.userId === currentUserId;

  const now = new Date();
  const biddingActive =
    listing?.biddingStartsAt &&
    listing?.biddingEndsAt &&
    now >= new Date(listing.biddingStartsAt) &&
    now <= new Date(listing.biddingEndsAt);

  const biddingScheduled =
    listing?.biddingStartsAt &&
    listing?.biddingEndsAt &&
    now < new Date(listing.biddingStartsAt);

  const biddingEnded =
    listing?.biddingStartsAt &&
    listing?.biddingEndsAt &&
    now > new Date(listing.biddingEndsAt);

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

      {/* Bidding Section */}
      <div className="mt-8 bg-white border border-oat rounded-3xl p-8 clay-shadow">
        {/* Countdown & Status */}
        {listing.biddingEndsAt && (
          <div className="mb-6 flex items-center gap-3">
            {biddingActive && (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-600">Bidding Active</span>
                <span className="mx-2 text-warm-silver">•</span>
                <Countdown endsAt={listing.biddingEndsAt} />
              </>
            )}
            {biddingScheduled && (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-amber-600">
                  Bidding starts {new Date(listing.biddingStartsAt!).toLocaleString()}
                </span>
              </>
            )}
            {biddingEnded && (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm font-medium text-red-500">Bidding Ended</span>
              </>
            )}
          </div>
        )}

        {/* Owner: Set bidding period */}
        {isOwner && !listing.biddingStartsAt && (
          <SetBiddingForm
            listingId={listing.id}
            onSuccess={() => window.location.reload()}
          />
        )}

        {isOwner && listing.biddingStartsAt && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-warm-charcoal">
              You set the bidding period from{" "}
              <strong>{new Date(listing.biddingStartsAt).toLocaleString()}</strong> to{" "}
              <strong>{new Date(listing.biddingEndsAt!).toLocaleString()}</strong>
            </p>
            <button
              onClick={async () => {
                const res = await fetch(`/api/listings/${listing.id}/bidding`, { method: "DELETE" });
                if (res.ok) window.location.reload();
              }}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition"
            >
              Cancel Bidding
            </button>
          </div>
        )}

        {/* Non-owner: Place bid */}
        {!isOwner && biddingActive && currentUserId && (
          <PlaceBidForm listingId={listing.id} onSuccess={fetchBids} />
        )}

        {!isOwner && biddingActive && !currentUserId && (
          <p className="text-sm text-warm-charcoal">
            <Link href="/login" className="text-clay-black font-medium underline">
              Log in
            </Link>{" "}
            to place a bid.
          </p>
        )}

        {/* All users: Show bids */}
        {listing.biddingStartsAt && (
          <div className="mt-6">
            <BidsList
              bids={bids}
              currentUserId={currentUserId}
              listingId={listing.id}
              onBidCancelled={fetchBids}
            />
          </div>
        )}

        {!listing.biddingStartsAt && !isOwner && (
          <p className="text-sm text-warm-silver">No bidding available for this listing yet.</p>
        )}
      </div>
    </div>
  );
}