import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaViber } from "react-icons/fa6";
import { useShopStore } from "../store/useShopStore";

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
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
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
          <div className="md:w-3/5 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-yellow-700">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              ${product.price}
            </p>
            {/* Quantity + Action Buttons */}
            <div className="flex items-center gap-4 mb-6">
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
                    className="w-6 h-6 bg-gray-200 border-t border-r border-gray-300 rounded-tr hover:bg-gray-300 text-lg leading-none"
                    onClick={() => setQuantity((q) => q + 1)}
                    tabIndex={-1}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="w-6 h-6 bg-gray-200 border-b border-r border-gray-300 rounded-br hover:bg-gray-300 text-lg leading-none"
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
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded">
                Buy Now
              </button>
            </div>
            {/* Social Share Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                title="Share on Facebook"
              >
                <FaFacebookF />
              </button>
              <button
                className="bg-black hover:bg-gray-800 text-white p-2 rounded-full"
                title="Share on X"
              >
                <FaXTwitter />
              </button>
              <button
                className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:opacity-80 text-white p-2 rounded-full"
                title="Share on Instagram"
              >
                <FaInstagram />
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full"
                title="Share on Viber"
              >
                <FaViber />
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
