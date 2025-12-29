import { Helmet } from "react-helmet-async";
import { useShopStore } from "../store/useShopStore";
import { RxCross1 } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
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

  const { t } = useTranslation();

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      return {
        ...cartItem,
        product,
      };
    })
    .filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product!.price * item.quantity,
    0
  );
  const discount = subtotal * 0.1; // 10% discount
  const total = subtotal - discount;
  console.log("stefan cartItems: ", cartItems);
  return (
    <>
      <Helmet>
        <title>Shopping Cart | Nektarika</title>
        <meta
          name="description"
          content="View the items in your shopping cart and proceed to checkout."
        />
      </Helmet>

      <main className="container min-h-screen mx-auto px-4 py-[75px] oveflow-y-scroll">
        <h1 className="text-2xl font-bold mb-6">{t("cart:title")}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE */}
          <section className="w-full lg:w-2/3 overflow-x-auto">
            <div className="hidden md:block">
              <table className="min-w-full text-left">
                <thead className="border-b font-semibold">
                  <tr>
                    <th className="py-2">{t("cart:product")}</th>
                    <th className="py-2">{t("cart:price")}</th>
                    <th className="py-2">{t("cart:quantity")}</th>
                    <th className="py-2">{t("cart:subtotal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(({ id, quantity, product }) => (
                    <tr key={id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => removeFromCart(id)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            aria-label={`Remove ${product?.name}`}
                          >
                            <RxCross1 size={14} />
                          </button>
                          <img
                            src={product?.image}
                            alt={product?.name}
                            className="w-16 h-16 object-cover rounded"
                            loading="lazy"
                          />
                          <span className="font-medium">{product?.name}</span>
                        </div>
                      </td>

                      <td className="py-4 text-sm">
                        ${product?.price.toFixed(2)}
                      </td>

                      <td className="py-4">
                        <div className="flex items-center border border-gray-300 rounded w-fit">
                          <button
                            className="px-2 py-1 text-sm font-bold hover:bg-gray-100 border-r"
                            onClick={() => decreaseCartQuantity(id)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => {
                              const newQty = Math.max(
                                1,
                                Number(e.target.value)
                              );
                              if (newQty > quantity) {
                                for (let i = 0; i < newQty - quantity; i++)
                                  increaseCartQuantity(id);
                              } else if (newQty < quantity) {
                                for (let i = 0; i < quantity - newQty; i++)
                                  decreaseCartQuantity(id);
                              }
                            }}
                            className="w-10 h-[40px] text-center focus:outline-none appearance-none"
                          />
                          <button
                            className="px-2 py-1 text-sm font-bold hover:bg-gray-100 border-l"
                            onClick={() => increaseCartQuantity(id)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-4 text-sm">
                        ${(product!.price * quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile version */}
            <div className="md:hidden space-y-6">
              {cartItems.map(({ id, quantity, product }) => (
                <div key={id} className="border p-4 rounded shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <button
                      onClick={() => removeFromCart(id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                      aria-label={`Remove ${product?.name}`}
                    >
                      <RxCross1 size={14} />
                    </button>
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="w-20 h-20 object-cover rounded"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-semibold text-sm">{product?.name}</p>
                      <p className="text-xs text-gray-600">
                        ${product?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>{t("cart:quantity")}</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        className="px-2 py-1 text-sm font-bold hover:bg-gray-100 border-r"
                        onClick={() => decreaseCartQuantity(id)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          const newQty = Math.max(1, Number(e.target.value));
                          if (newQty > quantity) {
                            for (let i = 0; i < newQty - quantity; i++)
                              increaseCartQuantity(id);
                          } else if (newQty < quantity) {
                            for (let i = 0; i < quantity - newQty; i++)
                              decreaseCartQuantity(id);
                          }
                        }}
                        className="w-10 h-[40px] text-center focus:outline-none appearance-none"
                      />
                      <button
                        className="px-2 py-1 text-sm font-bold hover:bg-gray-100 border-l"
                        onClick={() => increaseCartQuantity(id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span>{t("cart:subtotal")}:</span>
                    <span>${(product!.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="w-full lg:w-1/3 space-y-8 border p-6 rounded shadow-md h-fit lg:sticky lg:top-20">
            <h2 className="text-xl font-semibold mb-4">
              {t("cart:cartTotals")}
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>{t("cart:subtotal")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart:discount")}</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>{t("cart:total")}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-green-600 italic">
                <span>{t("cart:youSaved")}:</span>
                <span>${discount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center sm:items-stretch">
              <button
                onClick={() => navigate("/checkout")}
                className={`w-full sm:max-w-[300px] bg-gradient-to-r min-w-max from-yellow-400 to-orange-400 text-white text-sm uppercase rounded-full py-2 font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                  cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={cartItems.length === 0}
              >
                {t("cart:proceedToCheckout")}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default CartPage;
