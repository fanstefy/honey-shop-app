import { useState } from "react";

import ProductItem from "../components/ProductItem";
import { useShopStore } from "../store/useShopStore";

const Shop: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const products = useShopStore((state) => state.products);

  return (
    <div className="container mx-auto items-center mt-8 py-10 px-5 min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-600 mb-10 text-center">
        Welcome to the Honey Shop
      </h1>
      <p className="text-lg text-gray-700 mb-5 text-center">
        Explore our wide range of honey products.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
