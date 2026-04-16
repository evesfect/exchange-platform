import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "@/lib/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = Number(id);

    if (Number.isNaN(listingId)) {
      return NextResponse.json(
        { error: "Invalid listing id" },
        { status: 400 }
      );
    }

    const listing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));

    if (listing.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}