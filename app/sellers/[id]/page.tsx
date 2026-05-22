"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";

type SellerInfo = {
  id: number;
  email: string;
};

export default function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [resolvedId, setResolvedId] = useState<string>("");
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

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
    async function fetchSeller() {
      try {
        const resolvedParams = await params;
        setResolvedId(resolvedParams.id);
        const response = await fetch(`/api/users/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch seller");
        const data = await response.json();
        setSeller(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load seller profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchSeller();
  }, [params]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-warm-silver">Loading seller profile...</p>
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

  if (!seller) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-warm-silver">Seller not found.</p>
      </div>
    );
  }

  const isOwnProfile = currentUserId !== null && seller.id === currentUserId;
  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`;
  };

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

      <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow mb-8">
        <h1 className="text-3xl font-semibold text-clay-black mb-2">
          Seller Profile
        </h1>
        <p className="text-warm-charcoal">
          <strong>Seller:</strong> {maskEmail(seller.email)}
        </p>
      </div>

      <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
        <h2 className="text-2xl font-semibold text-clay-black mb-6">
          Reviews
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Review Form */}
          <div>
            {currentUserId && !isOwnProfile && (
              <ReviewForm
                sellerId={seller.id}
                onReviewSubmitted={() => setReviewRefreshTrigger(prev => prev + 1)}
              />
            )}
            {!currentUserId && (
              <div className="bg-oat-light border border-oat rounded-lg p-6 text-center">
                <p className="text-warm-charcoal">
                  Please{" "}
                  <Link href="/login" className="font-medium underline text-clay-black">
                    log in
                  </Link>{" "}
                  to leave a review for this seller.
                </p>
              </div>
            )}
            {isOwnProfile && (
              <div className="bg-oat-light border border-oat rounded-lg p-6 text-center">
                <p className="text-warm-charcoal">
                  You cannot review yourself.
                </p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div>
            <ReviewsList
              sellerId={seller.id}
              refreshTrigger={reviewRefreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
