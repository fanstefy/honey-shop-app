import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { TiEyeOutline } from "react-icons/ti";
import { useShopStore } from "../store/useShopStore";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/useSidebarStore";

interface ProductItemProps {
  product: {
    id: number;
    name: string;
    image: string;
    backImage?: string;
    price: number;
    discount?: string;
  };
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  hoveredId,
  setHoveredId,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isQuickViewPopupVisible, setIsQuickViewPopupVisible] = useState(false);
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } =
    useShopStore();
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const navigate = useNavigate();

  const isInWishlist = wishlist.includes(product.id);
  const isInCart = cart.find((item) => item.id === product.id);

  const openDetailsPage = () => {
    navigate(`/shop/product/${product.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg flex flex-col justify-self-center items-center relative size-fit group cursor-pointer"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Heart Icon */}
      <button
        className="absolute top-3 right-2 z-10 flex items-center"
        onClick={() =>
          isInWishlist
            ? removeFromWishlist(product.id)
            : addToWishlist(product.id)
        }
        aria-label="wishlist"
        type="button"
      >
        {/* Wishlist label, only visible on icon hover */}
        <span
          className={`
            mr-2 bg-gray-800 text-xs text-white w-max p-[5px] rounded-lg
            absolute right-6
            opacity-0 ${isPopupVisible ? "opacity-100 delay-400" : ""}
            transition-opacity duration-300 ease-in-out pointer-events-none
            before:content-[''] before:absolute before:top-1/2 before:right-[-7px] before:-translate-y-1/2
            before:border-y-8 before:border-y-transparent
            before:border-l-8 before:border-l-gray-800 
            before:border-r-0
          `}
        >
          {isInWishlist ? "Added to wishlist" : "Add to wishlist"}
        </span>
        {wishlist.includes(product.id) ? (
          <AiFillHeart
            size={20}
            className="text-[#eab308] transition-colors duration-300"
            onMouseEnter={() => setIsPopupVisible(true)}
            onMouseLeave={() => setIsPopupVisible(false)}
          />
        ) : (
          <AiOutlineHeart
            size={20}
            className="text-gray-300 transition-colors duration-300 hover:text-[#eab308]"
            onMouseEnter={() => setIsPopupVisible(true)}
            onMouseLeave={() => setIsPopupVisible(false)}
          />
        )}
      </button>
      {/* Quick View Icon - top right, always visible */}
      <button
        className="absolute top-12 right-0 z-10 flex items-center
          text-gray-500 bg-gray-500 h-9 w-9 rounded-full shadow
          transition-all duration-300 justify-center hover:bg-gray-800
          opacity-0 translate-x-6
          group-hover:opacity-100 group-hover:translate-x-0"
        type="button"
        aria-label="Quick view"
        onClick={() => openSidebar("quickview", product)}
        onMouseEnter={() => setIsQuickViewPopupVisible(true)}
        onMouseLeave={() => setIsQuickViewPopupVisible(false)}
      >
        {/* Popup label, only visible on icon hover */}
        <span
          className={`
            mr-2 bg-gray-800 text-xs text-white w-max p-[5px] rounded-lg
            absolute right-10
            opacity-0 ${isQuickViewPopupVisible ? "opacity-100 delay-400" : ""}
            transition-opacity duration-300 ease-in-out pointer-events-none
            before:content-[''] before:absolute before:top-1/2 before:right-[-7px] before:-translate-y-1/2
            before:border-y-8 before:border-y-transparent
            before:border-l-8 before:border-l-gray-800 
            before:border-r-0
          `}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          Quick view
        </span>
        <TiEyeOutline size={22} color="white" />
      </button>
      {/* Cart Icon - bottom right, only visible on card hover */}
      <button
        className="absolute bottom-16 right-0 z-10 flex items-center
          bg-white border-yellow-400 hover:bg-yellow-50
          text-yellow-500 h-9 w-9 rounded-full overflow-visible
          transition-all duration-300 group/cart shadow
          opacity-0 translate-x-6
          group-hover:opacity-100 group-hover:translate-x-0 delay-200"
        type="button"
        onClick={() => (!isInCart ? addToCart(product.id) : openDetailsPage())}
      >
        {/* Expanding span, always behind the icon */}
        <span
          className="
            absolute top-0 right-0 h-9 flex items-center
            bg-[#eab308] rounded-full
            text-xs font-bold uppercase
            text-white
            whitespace-nowrap overflow-hidden
            w-0 pl-0 pr-9
            transition-all duration-300
            z-10
            group-hover/cart:w-36 group-hover/cart:pl-4
          "
          style={{ lineHeight: "36px" }}
          onClick={(e) => console.log("stefan clicked")}
        >
          {isInCart ? "View Details" : "Add to cart"}
        </span>
        {/* Icon wrapper with higher z-index */}
        <span className="absolute top-0 right-0 z-20 bg-white border-2 rounded-full border-[#eab308] flex items-center justify-center h-9 w-9">
          <HiOutlineShoppingBag size={20} />
        </span>
      </button>
      <div
        className="relative w-[250px] h-[250px] mb-4"
        onClick={openDetailsPage}
      >
        {/* Front image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-700 ${
            hoveredId === product.id && product.backImage
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
        {/* Back image (only if exists) */}
        {product.backImage && (
          <img
            src={product.backImage}
            alt={product.name + " back"}
            className={`absolute inset-0 w-full h-full object-cover rounded transition-opacity duration-700 ${
              hoveredId === product.id ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
      <h2 className="text-lg font-semibold text-yellow-700 mb-2">
        {product.name}
      </h2>
      <p className="text-gray-800 font-bold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
      </p>
    </div>
  );
};

export default ProductItem;
