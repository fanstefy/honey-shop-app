import { useShopStore } from "../store/useShopStore";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

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

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return {
        ...cartItem,
        product,
      };
    })
    .filter((item) => item.product); // remove nulls if product not found

  if (cartItems.length === 0) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <ul className="space-y-4">
      {cartItems.map(({ id, quantity, product }) => (
        <li key={id} className="flex items-start relative">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-16 h-16 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{product?.name}</h3>
            <div className="flex items-center mt-1 space-x-2">
              <button
                onClick={() => decreaseCartQuantity(id)}
                className="p-1 border rounded text-sm"
              >
                <FaMinus size={10} />
              </button>
              <span className="min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={() => increaseCartQuantity(id)}
                className="p-1 border rounded text-sm"
              >
                <FaPlus size={10} />
              </button>
            </div>
            <p className="text-sm mt-1 text-gray-700">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product!.price * quantity)}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(id)}
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CartSidebarContent;
