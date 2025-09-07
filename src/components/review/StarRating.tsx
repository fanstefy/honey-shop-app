import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = "md",
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = rating >= starValue;
    const isHalfFilled = rating >= starValue - 0.5 && rating < starValue;

    const StarIcon = isFilled
      ? FaStar
      : isHalfFilled
      ? FaStarHalfAlt
      : FaRegStar;

    return (
      <StarIcon
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled || isHalfFilled ? "text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => onRatingChange?.(starValue) : undefined}
      />
    );
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default StarRating;
