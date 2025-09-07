import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StarRating from "./StarRating";
import { ReviewFormData } from "../../services/reviewService";
import { useTranslation } from "react-i18next";

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: ReviewFormData;
  isEditing?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  if (!currentUser) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">
          {t("productDetails:needToBeLoggedIn")}
        </p>
        <button className="text-yellow-600 hover:text-yellow-700 font-semibold">
          {t("producetDetails:login")}
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
      if (!isEditing) {
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing
          ? t("productDetails:editYourReview")
          : t("productDetails:writeReview")}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("productDetails:rating")} *
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("productDetails:yourReview")} *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder={t("productDetails:shareYourExperience")}
          required
          minLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("productDetails:minimumTenChars")} ({comment.length}/10)
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors duration-300"
        >
          {isSubmitting
            ? t("productDetails:submiting")
            : isEditing
            ? t("productDetails:updateReview")
            : t("productDetails:submitReview")}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-300"
          >
            {t("productDetails:cancel")}
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
