"use client";

import { useEffect, useState } from "react";

export default function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const end = new Date(endsAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        setExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let str = "";
      if (days > 0) str += `${days}d `;
      if (hours > 0) str += `${hours}h `;
      if (minutes > 0) str += `${minutes}m `;
      str += `${seconds}s`;
      setTimeLeft(str.trim());
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <span className={`font-mono text-sm ${expired ? "text-red-500" : "text-emerald-600"}`}>
      {expired ? "⏱ Bidding ended" : `⏱ ${timeLeft}`}
    </span>
  );
}
