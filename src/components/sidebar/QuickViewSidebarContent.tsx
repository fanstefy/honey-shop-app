import { useState } from "react";
import { CiShare2 } from "react-icons/ci";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { useShopStore } from "../../store/useShopStore";

const QuickViewSidebarContent: React.FC<{ product: any }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useShopStore();

  if (!product)
    return <div className="text-gray-500">No product selected.</div>;

  // Dummy handlers for buttons
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(Number(product?.id));
    }
  };
  const handleBuyNow = () => {
    // Add your buy now logic here
  };

  return (
    <div>
      <img
        src={product.image}
        alt={product.name}
        className="object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-yellow-700 font-semibold mb-2">${product.price}</p>
      <p className="text-gray-700 mb-2">{product.description}</p>

      {/* Quantity + Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        {/* Quantity Input + Plus/Minus Buttons */}
        <div className="flex items-center">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
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
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-2 rounded-l-xl rounded-r-xl transition-colors duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-normal py-2 px-2 rounded-l-xl rounded-r-xl transition-colors duration-300">
          Buy Now
        </button>
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
  );
};

export default QuickViewSidebarContent;
