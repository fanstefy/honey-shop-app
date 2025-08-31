import { useNavigate } from "react-router-dom";
import { FaHeart, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useShopStore } from "../store/useShopStore";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: string;
  description?: string;
}

interface FavoritesProps {
  wishlistItems: Product[];
}

const Favorites: React.FC<FavoritesProps> = ({ wishlistItems }) => {
  const navigate = useNavigate();
  const { removeFromWishlist, addToCart } = useShopStore();

  if (wishlistItems?.length === 0) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Omiljeni proizvodi
          </h2>
        </div>

        <div className="text-center py-12">
          <FaHeart className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            Još uvek nemate omiljene proizvode
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
            Počnite da dodajete proizvode u omiljene dok pretražujete naš
            katalog
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Idite u prodavnicu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Omiljeni proizvodi
        </h2>
        <span className="text-gray-600 text-sm">
          {wishlistItems.length} proizvoda
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {wishlistItems?.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200"
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition duration-200"
              >
                <FaTimes className="text-red-500 text-sm" />
              </button>
              {product.discount && product.discount !== "0%" && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {product.discount}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  ${product.price}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 text-sm"
                  >
                    <FaShoppingCart className="text-xs" />
                    <span>Dodaj</span>
                  </button>
                  <button
                    onClick={() => navigate(`/shop/product/${product.id}`)}
                    className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
                  >
                    Detalji
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
