import { useShopStore } from "../../store/useShopStore";
import { RxCross1, RxMinus, RxPlus } from "react-icons/rx";

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
            <div className="flex items-center mt-1 ">
              <button
                onClick={() => decreaseCartQuantity(id)}
                className="p-1 border rounded-l-xl text-sm hover:bg-gray-200 transition-colors duration-300"
              >
                <RxMinus size={10} />
              </button>
              <button className="min-w-[22px] border-b border-t  text-[12px] text-center">
                {quantity}
              </button>
              <button
                onClick={() => increaseCartQuantity(id)}
                className="p-1 border rounded-r-xl text-sm hover:bg-gray-200 transition-colors duration-300"
              >
                <RxPlus size={10} />
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
            className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <RxCross1 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CartSidebarContent;
