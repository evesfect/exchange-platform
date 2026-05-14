"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
  id: number;
  listingId: number;
  senderId: number;
  senderEmail: string | null;
  message: string;
  createdAt: string;
};

type ListingChatProps = {
  listingId: number;
  currentUserId: number;
};

export default function ListingChat({
  listingId,
  currentUserId,
}: ListingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function fetchMessages() {
    try {
      const response = await fetch(`/api/listings/${listingId}/chat`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load chat messages");
      }

      setMessages(data.messages);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [listingId]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();

    const trimmedMessage = input.trim();

    if (!trimmedMessage) return;

    setSending(true);

    try {
      const response = await fetch(`/api/listings/${listingId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setInput("");
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        Live Chat for Current Bidding
      </h2>

      <div className="mb-3 h-72 overflow-y-auto rounded-md border bg-gray-50 p-3">
        {loading && (
          <p className="text-sm text-gray-500">Loading chat messages...</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-sm text-gray-500">
            No messages yet. Start the conversation.
          </p>
        )}

        {!loading &&
          messages.map((chat) => {
            const isOwnMessage = chat.senderId === currentUserId;

            return (
              <div
                key={chat.id}
                className={`mb-3 flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-900"
                  }`}
                >
                  <p className="mb-1 text-xs opacity-75">
                    {isOwnMessage ? "You" : chat.senderEmail || "User"}
                  </p>

                  <p>{chat.message}</p>

                  <p className="mt-1 text-xs opacity-70">
                    {new Date(chat.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          disabled={sending}
        />

        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}