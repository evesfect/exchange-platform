"use client";

import { useEffect, useState } from "react";
import StarRating from "./StarRating";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerEmail: string;
}

interface ReviewsData {
  reviews: Review[];
  avgRating: string;
  totalReviews: number;
}

interface ReviewsListProps {
  sellerId: number;
  refreshTrigger?: number;
}

export default function ReviewsList({ sellerId, refreshTrigger }: ReviewsListProps) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${sellerId}/reviews`);
      const reviewsData = await response.json();

      if (!response.ok) {
        setError("Failed to load reviews");
        return;
      }

      setData(reviewsData);
    } catch (err) {
      setError("An error occurred while loading reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sellerId, refreshTrigger]);

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!data || data.totalReviews === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review this seller!
      </div>
    );
  }

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{data.avgRating}</div>
            <div className="text-sm text-gray-600">out of 5</div>
          </div>
          <div>
            <StarRating rating={Number(data.avgRating)} readonly size="lg" />
            <div className="text-sm text-gray-600 mt-1">
              {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">All Reviews</h3>
        {data.reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-sm font-medium">{review.rating}/5</span>
                </div>
                <div className="text-sm text-gray-600">
                  By {maskEmail(review.reviewerEmail)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
