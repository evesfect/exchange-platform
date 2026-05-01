import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { bids } from "@/lib/schema";
import { getSession } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; bidId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bidId } = await params;
    const bidIdNum = Number(bidId);
    if (Number.isNaN(bidIdNum)) {
      return NextResponse.json({ error: "Invalid bid id" }, { status: 400 });
    }

    const [bid] = await db
      .select()
      .from(bids)
      .where(eq(bids.id, bidIdNum));

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    if (bid.userId !== session.userId) {
      return NextResponse.json({ error: "You can only cancel your own bids" }, { status: 403 });
    }

    await db.delete(bids).where(and(eq(bids.id, bidIdNum), eq(bids.userId, session.userId as number)));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling bid:", error);
    return NextResponse.json({ error: "Failed to cancel bid" }, { status: 500 });
  }
}
