"use client";

type Bid = {
  id: number;
  amount: string;
  createdAt: string;
  userEmail: string;
};

export default function BidsList({ bids }: { bids: Bid[] }) {
  if (bids.length === 0) {
    return <p className="text-sm text-warm-silver">No bids yet.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-clay-black">
        Bids ({bids.length})
      </h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {bids.map((bid, i) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              i === 0
                ? "border-emerald-300 bg-emerald-50"
                : "border-oat bg-white"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-clay-black">
                {bid.userEmail}
              </p>
              <p className="text-xs text-warm-silver">
                {new Date(bid.createdAt).toLocaleString()}
              </p>
            </div>
            <p className={`text-base font-bold ${i === 0 ? "text-emerald-600" : "text-clay-black"}`}>
              ₺{bid.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
