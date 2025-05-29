import { useEffect, useState } from "react";

import honey_1 from "../assets/images/honey_1.jpg";
import honey_2 from "../assets/images/honey_2.jpg";
import honey_3 from "../assets/images/honey_3.jpg";
import honey_4 from "../assets/images/honey_4.jpg";
import honey_5 from "../assets/images/honey_5.jpg";
import honey_1_back from "../assets/images/honey_1_back.jpg";
import honey_4_back from "../assets/images/honey_4_back.jpg";
import ProductItem from "../components/ProductItem";
import { useShopStore } from "../store/useShopStore";

const initialProducts = [
  {
    id: 1,
    name: "Wildflower Honey",
    image: honey_1,
    backImage: honey_1_back,
    price: 10,
    discount: "0%",
  },
  {
    id: 2,
    name: "Clover Honey",
    image: honey_2,
    price: 12,
    discount: "0%",
  },
  {
    id: 3,
    name: "Manuka Honey",
    image: honey_3,
    price: 25,
    discount: "0%",
  },
  {
    id: 4,
    name: "Orange Blossom Honey",
    image: honey_4,
    backImage: honey_4_back,
    price: 15,
    discount: "0%",
  },
  {
    id: 5,
    name: "Acacia Honey",
    image: honey_5,
    price: 18,
    discount: "0%",
  },
];

const Shop: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const setProducts = useShopStore((state) => state.setProducts);
  const products = useShopStore((state) => state.products);

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

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
