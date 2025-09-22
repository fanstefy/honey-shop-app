import { useState } from "react";
import { CiShare2 } from "react-icons/ci";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { useShopStore } from "../../store/useShopStore";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useToast } from "../../hooks/useToast"; // ili contexts/ToastContext ako koristiš Context
import Toast from "../ui/Toast";

const QuickViewSidebarContent: React.FC<{ product: any }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useShopStore();
  const { closeRightSidebar } = useSidebarStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Toast state
  const { toast, showToast, hideToast } = useToast();

  if (!product)
    return (
      <section className="text-gray-500" aria-live="polite">
        {t("productDetails:noProductSelected")}
      </section>
    );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product?.id));
    }

    // Show toast notification
    showToast(
      quantity === 1
        ? `${product.name} ${t("quickView:addedToBasket")}`
        : `${quantity}x ${product.name} ${t("quickView:addedToBasket")}`,
      "success"
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product.id));
    }
    closeRightSidebar();
    navigate("/checkout");
  };

  return (
    <>
      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <article itemScope itemType="https://schema.org/Product">
        <Helmet>
          <title>{product.name} | Quick View</title>
          <meta name="description" content={product.description} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: product.description,
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
            })}
          </script>
        </Helmet>

        <section aria-labelledby="product-name">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover rounded mb-4 w-3/4 justify-self-center"
            itemProp="image"
          />
          <header>
            <h3
              id="product-name"
              className="text-xl font-bold mb-2"
              itemProp="name"
            >
              {product.name}
            </h3>
            <p
              className="text-yellow-700 font-semibold mb-2"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content="USD" />
              <span itemProp="price">${product.price}</span>
            </p>
          </header>
          <p className="text-gray-700 mb-2" itemProp="description">
            {product.description}
          </p>
        </section>

        <section
          aria-label="Product quantity and actions"
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex items-center" aria-label="Quantity selector">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-10 h-[40px] text-center border border-gray-300 rounded-l focus:outline-none"
              style={{ appearance: "textfield" }}
              aria-label="Product quantity"
            />
            <div className="flex flex-col h-[40px]">
              <button
                className="w-[18px] h-[20px] border-t border-r border-b border-gray-200 rounded-tr hover:bg-gray-200 text-lg leading-none transition-colors duration-300"
                onClick={() => setQuantity((q) => q + 1)}
                tabIndex={-1}
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                className="w-[18px] h-[20px] border-b border-r border-gray-200 rounded-br hover:bg-gray-200 text-lg leading-none transition-colors duration-300"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                tabIndex={-1}
                type="button"
                aria-label="Decrease quantity"
              >
                -
              </button>
            </div>
          </div>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-2 rounded-l-xl rounded-r-xl transition-colors duration-300"
            onClick={handleAddToCart}
            aria-label="Add product to cart"
          >
            {t("quickView:addToCart")}
          </button>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-2 rounded-l-xl rounded-r-xl transition-colors duration-300"
            onClick={handleBuyNow}
            aria-label="Buy product now"
          >
            {t("quickView:buyNow")}
          </button>
        </section>

        <section
          className="flex gap-3 mb-6 items-center text-sm"
          aria-label="Share product"
        >
          <CiShare2 size={20} />
          <span className="font-semibold font-poppins">
            {t("quickView:share")}
          </span>
          <button
            className="hover:opacity-80"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <TiSocialFacebook size={20} color="gray" />
          </button>
          <a
            href="https://www.instagram.com/nektarikaa/"
            target="_blank"
            className="hover:opacity-80"
            title="Share on Instagram"
            aria-label="Share on Instagram"
          >
            <TiSocialInstagram size={20} color="gray" />
          </a>
          <button
            className="hover:opacity-80"
            title="Share on X"
            aria-label="Share on X"
          >
            <TiSocialTwitter size={20} color="gray" />
          </button>
        </section>
      </article>
    </>
  );
};

export default QuickViewSidebarContent;
