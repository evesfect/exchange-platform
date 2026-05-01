import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings, bids } from "@/lib/schema";
import { getSession } from "@/lib/session";

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

    if (listing.userId !== session.userId) {
      return NextResponse.json({ error: "Only the owner can set bidding period" }, { status: 403 });
    }

    const body = await request.json();
    const { startsAt, endsAt } = body;

    if (!startsAt || !endsAt) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (endDate <= startDate) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    await db
      .update(listings)
      .set({ biddingStartsAt: startDate, biddingEndsAt: endDate })
      .where(eq(listings.id, listingId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error setting bidding period:", error);
    return NextResponse.json({ error: "Failed to set bidding period" }, { status: 500 });
  }
}

export async function DELETE(
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

    if (listing.userId !== session.userId) {
      return NextResponse.json({ error: "Only the owner can cancel bidding" }, { status: 403 });
    }

    // Remove all bids and clear bidding period
    await db.delete(bids).where(eq(bids.listingId, listingId));
    await db
      .update(listings)
      .set({ biddingStartsAt: null, biddingEndsAt: null })
      .where(eq(listings.id, listingId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling bidding:", error);
    return NextResponse.json({ error: "Failed to cancel bidding" }, { status: 500 });
  }
}
