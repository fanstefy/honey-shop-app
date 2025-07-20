import { useParams } from "react-router-dom";
import { useState } from "react";
import { useShopStore } from "../store/useShopStore";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { CiDeliveryTruck, CiShare2 } from "react-icons/ci";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useShopStore((state) => state.getProductById(Number(id)));
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");
  const { addToCart } = useShopStore();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product?.id));
    }
  };

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-xl text-red-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto items-center py-10 px-5 min-h-screen">
      <div className="mb-4"></div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
        <Link
          to="/shop"
          className="flex items-center w-fit text-sm mb-6 px-1 py-[2px] text-yellow-500 hover:text-yellow-600 transition-colors duration-300"
        >
          <IoArrowBackOutline className="mr-1" />
          Back
        </Link>
        {/* Main Info Row */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-2/5 flex justify-center items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-xs rounded-lg object-cover border"
            />
          </div>
          {/* Product Info */}
          <div className="md:w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold text-yellow-700 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              ${product.price}
            </p>

            {/* Quantity + Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              {/* Quantity Input + Plus/Minus Buttons */}
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-10 h-[40px] text-center border border-gray-300 rounded-l focus:outline-none"
                  style={{ appearance: "textfield" }}
                />
                <div className="flex flex-col h-[40px]">
                  <button
                    className="w-[18px] h-[20px] border-t border-r border-b border-gray-200 rounded-tr hover:bg-gray-200 text-lg leading-none transition-colors duration-300"
                    onClick={() => setQuantity((q) => q + 1)}
                    tabIndex={-1}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="w-[18px] h-[20px] border-b border-r border-gray-200 rounded-br hover:bg-gray-200 text-lg leading-none transition-colors duration-300"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    tabIndex={-1}
                    type="button"
                  >
                    -
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-6 rounded-l-xl rounded-r-xl transition-colors duration-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-6 rounded-l-xl rounded-r-xl transition-colors duration-300">
                Buy Now
              </button>
            </div>

            {/* Estimated Delivery: */}
            <div className="flex items-center gap-2 mt-20 mb-3">
              <CiDeliveryTruck size={20} />
              <p className="inline-block ml-1 text-sm text-gray-600 font-poppins">
                <span className="font-semibold">Estimated delivery: </span>
                {" Mon, Jul 21 – Thu, Jul 24 (Excl Sat, Sun) "}
              </p>
            </div>

            {/* Social Media Share Buttons */}
            <div className="flex gap-3 mb-6 items-center text-sm">
              <CiShare2 size={20} />{" "}
              <span className="font-semibold font-poppins">Share</span>
              <button className="hover:opacity-80" title="Share on Facebook">
                <TiSocialFacebook size={20} color="gray" />
              </button>
              <button className="hover:opacity-80" title="Share on Instagram">
                <TiSocialInstagram size={20} color="gray" />
              </button>
              <button className="hover:opacity-80" title="Share on X">
                <TiSocialTwitter size={20} color="gray" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section - now under both image and info */}
        <div className="mt-8">
          <div className="flex border-b mb-2">
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "description"
                  ? "border-b-2 border-yellow-500 text-yellow-700"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "additional"
                  ? "border-b-2 border-yellow-500 text-yellow-700"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("additional")}
            >
              Additional Information
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "reviews"
                  ? "border-b-2 border-yellow-500 text-yellow-700"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
          <div className="mt-4">
            {activeTab === "description" && (
              <div>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === "additional" && (
              <div>
                <p>{product.additionalInfo || "No additional information."}</p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <p className="text-gray-500 italic">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
