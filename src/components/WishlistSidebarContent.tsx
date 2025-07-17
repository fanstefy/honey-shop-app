import { FaTrash } from "react-icons/fa";
import { useShopStore } from "../store/useShopStore";
import { useSidebarStore } from "../store/useSidebarStore";

const WishlistSidebarContent: React.FC = ({}) => {
  const wishlist = useShopStore((state) => state.wishlist);
  const products = useShopStore((state) => state.products);
  const addToCart = useShopStore((state) => state.addToCart);
  const removeFromWishlist = useShopStore((state) => state.removeFromWishlist);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  const wishlistItems = products?.filter((product) =>
    wishlist.includes(product.id)
  );

  if (!wishlistItems || wishlistItems.length === 0) {
    return <p className="text-gray-500">Your wishlist is empty.</p>;
  }

  return (
    <ul className="space-y-4">
      {wishlistItems.map((product) => (
        <li key={product.id} className="flex items-start relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.price}</p>
            <button
              onClick={() => {
                addToCart(product.id);
                openSidebar("cart");
              }}
              className="text-green-600 hover:underline text-sm mt-1"
            >
              Add to cart
            </button>
          </div>
          <button
            onClick={() => removeFromWishlist(product.id)}
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default WishlistSidebarContent;
