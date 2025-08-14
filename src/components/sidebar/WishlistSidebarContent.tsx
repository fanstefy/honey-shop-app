import { Helmet } from "react-helmet-async";
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
    return (
      <section
        role="region"
        aria-label="Empty wishlist"
        aria-live="polite"
        className="p-4"
      >
        <Helmet>
          <title>Your Wishlist | Nektarika</title>
          <meta
            name="description"
            content="Your wishlist is currently empty."
          />
        </Helmet>
        <p className="text-gray-500">Your wishlist is empty.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="wishlist-title"
      aria-live="polite"
      role="region"
      className="flex flex-col h-full"
    >
      <Helmet>
        <title>Wishlist | Nektarika</title>
        <meta
          name="description"
          content="View and manage your saved honey products from Nektarika."
        />
      </Helmet>

      <h2 id="wishlist-title" className="sr-only">
        Your Wishlist
      </h2>

      {/* Scrollable list area */}
      <ul className="space-y-4 overflow-y-auto flex-1 pr-1 p-4">
        {wishlistItems.map((product) => (
          <li
            key={product.id}
            className="flex items-start relative border-b border-gray-200 pb-4"
            role="listitem"
            aria-label={`Wishlist item: ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4"
              loading="lazy"
            />

            <article
              className="flex-1"
              aria-labelledby={`wishlist-product-${product.id}`}
            >
              <h3
                id={`wishlist-product-${product.id}`}
                className="font-semibold"
              >
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                ${product.price.toFixed(2)}
              </p>

              <button
                onClick={() => {
                  addToCart(product.id);
                  closeSidebar();
                  setTimeout(() => openSidebar("cart"), 200);
                }}
                className="text-green-600 uppercase text-xs font-thin mt-1 hover:text-yellow-700 transition-colors duration-300"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to cart
              </button>
            </article>

            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-0 right-0 p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label={`Remove ${product.name} from wishlist`}
            >
              <RxCross1 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WishlistSidebarContent;
