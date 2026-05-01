import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings, bids, users } from "@/lib/schema";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = Number(id);
    if (Number.isNaN(listingId)) {
      return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
    }

    const allBids = await db
      .select({
        id: bids.id,
        amount: bids.amount,
        createdAt: bids.createdAt,
        userId: bids.userId,
        userEmail: users.email,
      })
      .from(bids)
      .innerJoin(users, eq(bids.userId, users.id))
      .where(eq(bids.listingId, listingId))
      .orderBy(desc(bids.amount));

    return NextResponse.json(allBids, { status: 200 });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const listingId = Number(id);
    if (Number.isNaN(listingId)) {
      return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
    }

    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check bidding is active
    const now = new Date();
    if (!listing.biddingStartsAt || !listing.biddingEndsAt) {
      return NextResponse.json({ error: "Bidding is not enabled for this listing" }, { status: 400 });
    }
    if (now < listing.biddingStartsAt || now > listing.biddingEndsAt) {
      return NextResponse.json({ error: "Bidding is not currently active" }, { status: 400 });
    }

    // Owner cannot bid on their own listing
    if (listing.userId === session.userId) {
      return NextResponse.json({ error: "Owner cannot bid on their own listing" }, { status: 403 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Valid bid amount is required" }, { status: 400 });
    }

    const [newBid] = await db
      .insert(bids)
      .values({
        listingId,
        userId: session.userId as number,
        amount: String(amount),
      })
      .returning();

    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
