import { useShopStore } from "../../store/useShopStore";
import { useSidebarStore } from "../../store/useSidebarStore";
import { RxCross1 } from "react-icons/rx";

const WishlistSidebarContent: React.FC = () => {
  const wishlist = useShopStore((state) => state.wishlist);
  const products = useShopStore((state) => state.products);
  const addToCart = useShopStore((state) => state.addToCart);
  const removeFromWishlist = useShopStore((state) => state.removeFromWishlist);
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

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
            <p className="text-sm text-gray-600">${product.price}</p>
            <button
              onClick={() => {
                addToCart(product.id);
                closeSidebar();
                setTimeout(() => {
                  openSidebar("cart");
                }, 200);
              }}
              className="text-green-600 uppercase text-xs font-thin mt-1 hover:text-yellow-700 transition-colors duration-300"
            >
              Add to cart
            </button>
          </div>
          <button
            onClick={() => removeFromWishlist(product.id)}
            className="absolute top-0 right-0 p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <RxCross1 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default WishlistSidebarContent;
