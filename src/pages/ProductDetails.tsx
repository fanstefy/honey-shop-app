import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useShopStore } from "../store/useShopStore";
import { useSidebarStore } from "../store/useSidebarStore";
import { TiSocialFacebook, TiSocialInstagram } from "react-icons/ti";
import { CiDeliveryTruck, CiShare2 } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaCheckCircle, FaStar, FaTiktok } from "react-icons/fa";
import { MdLocalShipping, MdVerified } from "react-icons/md";
import Reviews from "../components/review/Reviews";
import { useTranslation } from "react-i18next";

const siteUrl = "https://nektarika.rs";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useShopStore((state) => state.getProductById(Number(id)));
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");
  const { addToCart } = useShopStore();
  const openRightSidebar = useSidebarStore((state) => state.openRightSidebar);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product?.id));
    }
    openRightSidebar("cart");
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product.id));
    }
    navigate("/checkout");
  };

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-xl text-red-600">
        {t("productDetails:productNotFound")}
      </div>
    );
  }

  const seoDescription =
    product.description?.slice(0, 160) ||
    "Discover organic honey and natural products from Nektarika.";
  const seoKeywords = `${product.name}, organic honey, Nektarika, natural product`;

  const shareUrl = window.location.href; // Trenutni URL proizvoda
  const shareTitle = `Check out this amazing ${product.name} from Nektarika!`;

  // Facebook share link
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  // Funkcija za Copy Link (zamena za Instagram share na webu)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert(t("productDetails:linkCopied") || "Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <Helmet>
        <title>{product.name} | Nektarika</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={`${siteUrl}${product.image}`} />
        <meta
          property="og:url"
          content={`${siteUrl}/shop/product/${product.id}`}
        />{" "}
      </Helmet>

      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto py-10 px-5 relative z-10">
        <div className="mb-4"></div>

        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center w-fit text-sm mb-6 px-4 py-2 text-yellow-700 bg-white/80 backdrop-blur-sm border border-yellow-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 hover:shadow-md transition-all duration-300 group"
          >
            <IoArrowBackOutline className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            {t("productDetails:back")}
          </button>

          {/* Main Product Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-yellow-100">
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image Section - Enhanced with gradient overlay */}
              <div className="md:w-2/5 relative bg-gradient-to-br from-amber-100 to-yellow-100 p-8 flex justify-center items-center">
                {/* Featured Badge */}
                <div className="absolute z-10 top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                  <FaStar /> {t("productDetails:featured")}
                </div>

                {/* Product Image with hover effect */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-full max-w-sm rounded-2xl object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Trust Badges */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-green-700 flex items-center gap-1 shadow-md">
                    <MdVerified className="text-green-600" />{" "}
                    {t("productDetails:100percentNatural")}
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="md:w-3/5 p-2 md:p-8 bg-gradient-to-br from-white to-amber-50/30">
                <div className="flex flex-col h-full">
                  {/* Product Header */}
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="text-yellow-400"
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        (4.9/5 {t("productDetails:reviewsSmallCase")})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold text-gray-600">
                        ${product.price}
                      </p>
                      <span className="text-sm text-gray-500 line-through">
                        $16
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        SALE
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Action Buttons */}
                  <div className="mb-8">
                    <div className="flex md:flex-row flex-col md:gap-4 gap-1 mb-4">
                      <div className="flex bg-gray-100 md:min-w-max w-max rounded-lg overflow-hidden border-2 border-gray-200">
                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Math.max(1, Number(e.target.value)))
                          }
                          className="w-10 h-12 text-center bg-white border-0 focus:outline-none font-semibold text-gray-800"
                          style={{ appearance: "textfield" }}
                        />
                        <div className="flex flex-col">
                          <button
                            className="w-8 h-6 hover:bg-yellow-400 hover:text-white transition-colors duration-200 font-bold"
                            onClick={() => setQuantity((q) => q + 1)}
                            type="button"
                          >
                            +
                          </button>
                          <button
                            className="w-8 h-6 hover:bg-yellow-400 hover:text-white transition-colors duration-200 font-bold"
                            onClick={() =>
                              setQuantity((q) => Math.max(1, q - 1))
                            }
                            type="button"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      <button
                        className="bg-gradient-to-r md:min-w-max from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        onClick={handleAddToCart}
                      >
                        {t("productDetails:addToCart")}
                      </button>

                      <button
                        className="bg-gradient-to-r md:w-[-webkit-fill-available] from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        onClick={handleBuyNow}
                      >
                        {t("productDetails:buyNow")}
                      </button>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-300">
                      <FaCheckCircle
                        className="text-green-600 mb-2"
                        size={24}
                        color="gray-600"
                      />
                      <p className="text-sm font-semibold text-gray-600">
                        {t("productDetails:100percentNatural")}
                      </p>
                      <p className="text-xs text-gray-600">
                        {t("productDetails:cleanAndNatural")}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow duration-300">
                      <MdLocalShipping
                        className="text-blue-600 mb-2"
                        size={24}
                      />
                      <p className="text-sm font-semibold text-gray-800">
                        {t("productDetails:deliveryInfo")}
                      </p>
                      <p className="text-xs text-gray-600">
                        {t("productDetails:fastAndSecure")}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200 hover:shadow-md transition-shadow duration-300">
                      <FaStar className="text-amber-600 mb-2" size={24} />
                      <p className="text-sm font-semibold text-gray-800">
                        {t("productDetails:qualityGuarantee")}
                      </p>
                      <p className="text-xs text-gray-600">
                        {t("productDetails:100percentSatisfaction")}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <CiDeliveryTruck
                        size={28}
                        className="text-blue-600 mt-1 flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {t("productDetails:estimatedDelivery")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("productDetails:deliveryTimeframe")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-3 items-center">
                      <CiShare2 size={24} className="text-gray-600" />
                      <span className="font-semibold text-gray-700">
                        {t("productDetails:share")}
                      </span>
                      <div className="flex gap-2">
                        {/* Facebook Share - Otvara prozor za objavu na FB */}
                        <a
                          href={facebookShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white hover:bg-[#1877F2] hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                          title="Share on Facebook"
                        >
                          <TiSocialFacebook size={24} />
                        </a>
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white hover:bg-[#25D366] hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                          title="Share on WhatsApp"
                        >
                          <svg
                            width={20}
                            height={20}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.391.079 11.99c0 2.112.552 4.171 1.597 6.02L0 24l6.163-1.617a11.831 11.831 0 005.883 1.565h.005c6.608 0 11.972-5.391 11.974-11.99a11.892 11.892 0 00-3.481-8.47z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-gradient-to-b from-amber-50/50 to-white p-2 md:p-8 border-t border-yellow-100">
              <div className="flex border-b-2 border-gray-200 mb-6">
                <button
                  className={`px-2 py-3 font-semibold transition-all duration-300 ${
                    activeTab === "description"
                      ? "border-b-4 border-yellow-500 text-yellow-700 -mb-[2px] bg-yellow-50/50"
                      : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/30"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  {t("productDetails:description")}
                </button>
                <button
                  className={`px-2 py-3 font-semibold transition-all duration-300 ${
                    activeTab === "additional"
                      ? "border-b-4 border-yellow-500 text-yellow-700 -mb-[2px] bg-yellow-50/50"
                      : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/30"
                  }`}
                  onClick={() => setActiveTab("additional")}
                >
                  {t("productDetails:additionalInformation")}
                </button>
                <button
                  className={`px-2 py-3 font-semibold transition-all duration-300 ${
                    activeTab === "reviews"
                      ? "border-b-4 border-yellow-500 text-yellow-700 -mb-[2px] bg-yellow-50/50"
                      : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50/30"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  {t("productDetails:reviews")}
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-inner border border-gray-100 min-h-[200px]">
                {activeTab === "description" && (
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                )}
                {activeTab === "additional" && (
                  <p className="text-gray-700 leading-relaxed">
                    {product.additionalInfo || "No additional information."}
                  </p>
                )}
                {activeTab === "reviews" && <Reviews productId={Number(id)} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
