// app/api/listings/[id]/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { chatMessages, users } from "@/lib/schema";
import { getSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    return NextResponse.json(
      { error: "Invalid listing ID" },
      { status: 400 }
    );
  }

  try {
    const messages = await db
      .select({
        id: chatMessages.id,
        listingId: chatMessages.listingId,
        senderId: chatMessages.senderId,
        senderEmail: users.email,
        message: chatMessages.message,
        createdAt: chatMessages.createdAt,
      })
      .from(chatMessages)
      .leftJoin(users, eq(chatMessages.senderId, users.id))
      .where(eq(chatMessages.listingId, listingId))
      .orderBy(asc(chatMessages.createdAt));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);

    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const listingId = Number(id);

  if (Number.isNaN(listingId)) {
    return NextResponse.json(
      { error: "Invalid listing ID" },
      { status: 400 }
    );
  }

  try {
    const session = await getSession();

    if (!session || typeof session.userId !== "number") {
      return NextResponse.json(
        { error: "You must be logged in to send messages" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const insertedMessage = await db
      .insert(chatMessages)
      .values({
        listingId,
        senderId: session.userId,
        message,
      })
      .returning({
        id: chatMessages.id,
        listingId: chatMessages.listingId,
        senderId: chatMessages.senderId,
        message: chatMessages.message,
        createdAt: chatMessages.createdAt,
      });

    return NextResponse.json(
      { message: insertedMessage[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to send chat message:", error);

    return NextResponse.json(
      { error: "Failed to send chat message" },
      { status: 500 }
    );
  }
}