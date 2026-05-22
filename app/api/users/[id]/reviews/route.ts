import { NextResponse } from "next/server";
import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { sellerReviews, users } from "@/lib/schema";
import { getSession } from "@/lib/session";

// GET /api/users/[id]/reviews - Fetch all reviews for a seller
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sellerId = Number(id);

  if (Number.isNaN(sellerId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    // Fetch all reviews for this seller with reviewer details
    const reviews = await db
      .select({
        id: sellerReviews.id,
        rating: sellerReviews.rating,
        comment: sellerReviews.comment,
        createdAt: sellerReviews.createdAt,
        reviewerEmail: users.email,
      })
      .from(sellerReviews)
      .leftJoin(users, eq(sellerReviews.reviewerId, users.id))
      .where(eq(sellerReviews.sellerId, sellerId))
      .orderBy(desc(sellerReviews.createdAt));

    // Calculate average rating
    const avgResult = await db
      .select({
        avgRating: sql<number>`COALESCE(AVG(${sellerReviews.rating}), 0)`,
        totalReviews: sql<number>`COUNT(*)`,
      })
      .from(sellerReviews)
      .where(eq(sellerReviews.sellerId, sellerId));

    const { avgRating, totalReviews } = avgResult[0] || { avgRating: 0, totalReviews: 0 };

    return NextResponse.json({
      reviews,
      avgRating: Number(avgRating).toFixed(1),
      totalReviews: Number(totalReviews),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/reviews - Submit a review for a seller
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sellerId = Number(id);

  if (Number.isNaN(sellerId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  // Prevent users from reviewing themselves
  if ((session.userId as number) === sellerId) {
    return NextResponse.json(
      { error: "You cannot review yourself" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { rating, comment } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this seller
    const existingReview = await db
      .select()
      .from(sellerReviews)
      .where(
        and(
          eq(sellerReviews.reviewerId, session.userId as number),
          eq(sellerReviews.sellerId, sellerId)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this seller" },
        { status: 400 }
      );
    }

    // Create new review
    const [newReview] = await db
      .insert(sellerReviews)
      .values({
        reviewerId: session.userId as number,
        sellerId,
        rating: Number(rating),
        comment: comment || null,
      })
      .returning();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
