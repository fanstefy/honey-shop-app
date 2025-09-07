import { useState, useEffect } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import {
  Review,
  ReviewFormData,
  getReviewsForProduct,
  addReview,
  updateReview,
  deleteReview,
  hasUserReviewedProduct,
  calculateAverageRating,
} from "../../services/reviewService";
import { useTranslation } from "react-i18next";

interface ReviewsProps {
  productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [lastDocument, setLastDocument] = useState<DocumentSnapshot | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { t } = useTranslation();

  // Učitaj početne reviews
  const loadReviews = async (reset = false) => {
    try {
      const { reviews: newReviews, lastDocument: newLastDoc } =
        await getReviewsForProduct(
          productId,
          5,
          reset ? undefined : lastDocument || undefined
        );

      if (reset) {
        setReviews(newReviews);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
      }

      setLastDocument(newLastDoc ?? null);
      setHasMoreReviews(newReviews.length === 5);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  // Učitaj prosečnu ocenu
  const loadAverageRating = async () => {
    try {
      const { averageRating: avg, totalReviews: total } =
        await calculateAverageRating(productId);
      setAverageRating(avg);
      setTotalReviews(total);
    } catch (error) {
      console.error("Error loading average rating:", error);
    }
  };

  // Proveri da li je korisnik već ostavio review
  const checkUserReview = async () => {
    if (!currentUser) {
      setHasUserReviewed(false);
      return;
    }

    try {
      const hasReviewed = await hasUserReviewedProduct(
        productId,
        currentUser.uid
      );
      setHasUserReviewed(hasReviewed);
    } catch (error) {
      console.error("Error checking user review:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadReviews(true),
        loadAverageRating(),
        checkUserReview(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [productId, currentUser]);

  // Dodaj novi review
  const handleAddReview = async (reviewData: ReviewFormData) => {
    if (!currentUser) return;

    try {
      await addReview(
        productId,
        currentUser.uid,
        currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Anonymous",
        currentUser.email || "",
        reviewData
      );

      // Refresh podatke
      await Promise.all([
        loadReviews(true),
        loadAverageRating(),
        checkUserReview(),
      ]);

      setShowForm(false);
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  };

  // Ažuriraj review
  const handleEditReview = async (
    reviewId: string,
    reviewData: ReviewFormData
  ) => {
    try {
      await updateReview(reviewId, reviewData);

      // Ažuriraj lokalno
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, ...reviewData } : review
        )
      );

      // Refresh prosečnu ocenu
      await loadAverageRating();
    } catch (error) {
      console.error("Error editing review:", error);
      throw error;
    }
  };

  // Obriši review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);

      // Ukloni iz lokalnog state-a
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));

      // Refresh podatke
      await Promise.all([loadAverageRating(), checkUserReview()]);
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  };

  // Učitaj više reviews
  const loadMoreReviews = async () => {
    if (!hasMoreReviews || loadingMore) return;

    setLoadingMore(true);
    await loadReviews(false);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {averageRating}
            </div>
            <StarRating rating={averageRating} size="lg" />
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews}{" "}
              {totalReviews !== 1
                ? t("productDetails:reviews")
                : t("productDetails:review")}
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        {currentUser && !hasUserReviewed && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            {showForm
              ? t("productDetails:cancel")
              : t("productDetails:writeReview")}
          </button>
        )}

        {hasUserReviewed && currentUser && (
          <p className="text-green-600 font-medium">
            ✓ {t("productDetails:alreadyReviewedProduct")}
          </p>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {t("productDetails:customerReviews")} ({totalReviews})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t("productDetails:noReviewsYet")}</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreReviews && (
              <div className="text-center mt-6">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  {loadingMore
                    ? t("productDetails:loading")
                    : t("productDetails:loadMoreReviews")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
