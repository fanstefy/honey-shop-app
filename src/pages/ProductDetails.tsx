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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <Helmet>
        <title>{product.name} | Nektarika</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={product.image} />
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
                        <a
                          href="https://www.facebook.com/profile.php?id=61585376957368"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <button className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                            <TiSocialFacebook size={22} />
                          </button>
                        </a>
                        <a
                          href="https://www.instagram.com/nektarikaa/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <button className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                            <TiSocialInstagram size={20} />
                          </button>
                        </a>
                        <a
                          href="https://www.tiktok.com/@nektarika?_r=1&_t=ZM-92f6IX776xH"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <button className="w-10 h-10 rounded-full bg-white hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:text-white text-gray-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                            <FaTiktok size={20} />
                          </button>
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
