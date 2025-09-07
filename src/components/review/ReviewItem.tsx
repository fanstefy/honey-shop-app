import { useState } from "react";
import StarRating from "./StarRating";
import { Review, ReviewFormData } from "../../services/reviewService";
import { useAuth } from "../../contexts/AuthContext";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import { useTranslation } from "react-i18next";

interface ReviewItemProps {
  review: Review;
  onEdit?: (reviewId: string, reviewData: ReviewFormData) => Promise<void>;
  onDelete?: (reviewId: string) => Promise<void>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onEdit,
  onDelete,
}) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUser?.uid === review.userId;
  const { t } = useTranslation();

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = async (reviewData: ReviewFormData) => {
    if (!review.id || !onEdit) return;

    try {
      await onEdit(review.id, reviewData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const handleDelete = async () => {
    if (!review.id || !onDelete) return;

    const confirmDelete = window.confirm(
      t("productDetails:areYouSureYouWantToDeleteReview")
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(review.id);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border-b pb-6 mb-6">
        <ReviewForm
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          initialData={{ rating: review.rating, comment: review.comment }}
          isEditing
        />
      </div>
    );
  }

  return (
    <div className="border-b pb-6 mb-6 last:border-b-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-800">{review.userName}</h4>
            {review.verified && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <FaCheckCircle size={12} />
                {t("productDetails:verifiedPurchase")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 p-1"
              title={t("productDetails:editReview")}
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-500 p-1 disabled:opacity-50"
              title={t("productDetails:deleteReview")}
            >
              <FaTrash size={14} />
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewItem;
