"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/listings");

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

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

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "32px 24px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ color: "#6b7280" }}>Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "32px 24px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ color: "#dc2626" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "32px 24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "32px",
            color: "#111827",
          }}
        >
          Listings
        </h1>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          Browse available listings around Istanbul.
        </p>
      </div>

      {listings.length === 0 ? (
        <div
          style={{
            padding: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            background: "#ffffff",
          }}
        >
          <p style={{ margin: 0, color: "#6b7280" }}>No listings available.</p>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}