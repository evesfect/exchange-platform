"use client";

import { useState } from "react";

export default function SetBiddingForm({
  listingId,
  onSuccess,
}: {
  listingId: number;
  onSuccess: () => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("23:59");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    const startsAt = `${startDate}T${startTime}`;
    const endsAt = `${endDate}T${endTime}`;

    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/bidding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startsAt, endsAt }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to set bidding period");
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-clay-black">Start Bidding</h3>
      <div className="space-y-1.5">
        <label className="clay-label text-warm-charcoal">Start Date</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="clay-input flex-1"
            required
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="clay-input w-32"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="clay-label text-warm-charcoal">End Date</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="clay-input flex-1"
            required
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="clay-input w-32"
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="clay-hover rounded-xl bg-clay-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Setting..." : "Start Bidding Period"}
      </button>
    </form>
  );
}
