import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings } from "@/lib/schema";

export async function GET() {
  try {
    const allListings = await db.select().from(listings);

    return NextResponse.json(allListings, { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}