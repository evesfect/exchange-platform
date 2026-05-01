"use client";

import { useState } from "react";

export default function PlaceBidForm({
  listingId,
  onSuccess,
}: {
  listingId: number;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to place bid");
        return;
      }

      setAmount("");
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-clay-black">Place a Bid</h3>
      <div className="flex gap-3">
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Your bid (₺)"
          className="clay-input flex-1"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="clay-hover rounded-xl bg-clay-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "..." : "Bid"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
