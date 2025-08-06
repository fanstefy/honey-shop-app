import { Helmet } from "react-helmet-async";
import { useShopStore } from "../../store/useShopStore";
import { RxCross1, RxMinus, RxPlus } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../../store/useSidebarStore";

const CartSidebarContent: React.FC = () => {
  const cart = useShopStore((state) => state.cart);
  const products = useShopStore((state) => state.products);
  const increaseCartQuantity = useShopStore(
    (state) => state.increaseCartQuantity
  );
  const decreaseCartQuantity = useShopStore(
    (state) => state.decreaseCartQuantity
  );
  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const navigate = useNavigate();
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return {
        ...cartItem,
        product,
      };
    })
    .filter((item) => item.product);

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <section
        role="region"
        aria-label="Empty shopping cart"
        aria-live="polite"
        className="p-4"
      >
        <Helmet>
          <title>Your Cart | Nektarika</title>
          <meta
            name="description"
            content="Your shopping cart is currently empty."
          />
        </Helmet>
        <p className="text-gray-500">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-labelledby="shopping-cart"
      aria-live="polite"
      className="flex flex-col h-full"
    >
      <Helmet>
        <title>Cart Items | Nektarika</title>
        <meta
          name="description"
          content="Review and update the products in your shopping cart."
        />
      </Helmet>

      <h2 id="shopping-cart" className="sr-only">
        Shopping Cart
      </h2>

      <ul className="space-y-4 overflow-y-auto flex-1 pr-1 p-4">
        {cartItems.map(({ id, quantity, product }) => (
          <li
            key={id}
            className="flex items-start justify-between gap-3 pb-4 border-b border-gray-200 relative"
            role="listitem"
            aria-label={`${product?.name}, quantity ${quantity}`}
          >
            <img
              src={product?.image}
              alt={product?.name || "Product image"}
              className="w-16 h-16 object-cover rounded"
              loading="lazy"
            />

            <article className="flex-1" aria-labelledby={`product-${id}`}>
              <h3 id={`product-${id}`} className="font-semibold">
                {product?.name}
              </h3>

              <div className="flex items-center mt-1">
                <button
                  onClick={() => decreaseCartQuantity(id)}
                  className="p-1 border rounded-l-xl text-sm hover:bg-gray-200 transition-colors duration-300"
                  aria-label={`Decrease quantity of ${product?.name}`}
                >
                  <RxMinus size={10} />
                </button>

                <span
                  className="min-w-[22px] border-b border-t text-[12px] text-center"
                  aria-label={`Quantity: ${quantity}`}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => increaseCartQuantity(id)}
                  className="p-1 border rounded-r-xl text-sm hover:bg-gray-200 transition-colors duration-300"
                  aria-label={`Increase quantity of ${product?.name}`}
                >
                  <RxPlus size={10} />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Price:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product!.price)}
              </p>
            </article>

            <button
              onClick={() => removeFromCart(id)}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label={`Remove ${product?.name} from cart`}
            >
              <RxCross1 size={14} />
            </button>

            <div className="text-right absolute bottom-4 right-2">
              <p className="text-sm mt-1 text-gray-700 font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product!.price * quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Subtotal + Buttons */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between text-gray-700 font-semibold mb-4">
          <span>Subtotal:</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(subtotal)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              closeSidebar();
              navigate("/cart");
            }}
            className="w-full text-center bg-white text-gray-800 border border-gray-300 rounded-full py-2 text-sm font-semibold hover:bg-gray-100 transition"
          >
            View Cart
          </button>

          <button
            className="w-full bg-yellow-500 text-white rounded-full py-2 text-sm font-semibold hover:bg-yellow-600 transition"
            onClick={() => alert("Proceed to Checkout")}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartSidebarContent;
