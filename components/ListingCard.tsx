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
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          height: "100%",
        }}
      >
        {listing.imageUrl && (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        <div style={{ padding: "16px" }}>
          <div
            style={{
              display: "inline-block",
              marginBottom: "10px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: "#f3f4f6",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            {listing.category ?? "General"}
          </div>

          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "18px",
              lineHeight: 1.3,
              color: "#111827",
            }}
          >
            {listing.title}
          </h3>

          <p
            style={{
              fontWeight: 700,
              fontSize: "20px",
              margin: "0 0 8px 0",
              color: "#111827",
            }}
          >
            ₺{listing.price}
          </p>

          <p
            style={{
              margin: "0 0 8px 0",
              color: "#4b5563",
              fontSize: "14px",
            }}
          >
            {listing.location}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {listing.condition ?? "N/A"} • {listing.deliveryMethod ?? "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}