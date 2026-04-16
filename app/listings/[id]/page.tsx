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

        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }

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
      <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#6b7280" }}>Loading listing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#6b7280" }}>Listing not found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/listings"
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          ← Back to listings
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        <div>
          {listing.imageUrl && (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "18px",
                display: "block",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
              }}
            />
          )}
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "24px",
            background: "#ffffff",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: "12px",
              padding: "5px 12px",
              borderRadius: "999px",
              background: "#f3f4f6",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            {listing.category ?? "General"}
          </div>

          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "32px",
              lineHeight: 1.2,
              color: "#111827",
            }}
          >
            {listing.title}
          </h1>

          <p
            style={{
              margin: "0 0 20px 0",
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            ₺{listing.price}
          </p>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginBottom: "24px",
              color: "#374151",
              fontSize: "15px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Location:</strong> {listing.location ?? "N/A"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Condition:</strong> {listing.condition ?? "N/A"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Delivery:</strong> {listing.deliveryMethod ?? "N/A"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Seller:</strong> {listing.sellerName ?? "N/A"}
            </p>
          </div>

          <hr style={{ margin: "0 0 20px 0", borderColor: "#e5e7eb" }} />

          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            Description
          </h2>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
            {listing.description}
          </p>
        </div>
      </div>
    </div>
  );
}