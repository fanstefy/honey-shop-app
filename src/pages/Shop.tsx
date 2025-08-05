import { useState } from "react";
import ProductItem from "../components/ProductItem";
import { useShopStore } from "../store/useShopStore";
import { Helmet } from "react-helmet-async";

const Shop: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const products = useShopStore((state) => state.products);

  return (
    <div className="mx-auto items-center mt-8 py-10 px-5 min-h-screen">
      <Helmet>
        <title>Shop Organic Honey | Nektarika</title>
        <meta
          name="description"
          content="Browse our organic honey selection including wildflower, manuka, clover, and more. Pure, natural and cruelty-free products from Nektarika."
        />
        <meta
          name="keywords"
          content="honey shop, organic honey, wildflower honey, buy honey online, clover honey, manuka honey"
        />
        <link rel="canonical" href="https://www.nektarika.rs/shop" />

        <meta property="og:title" content="Shop Organic Honey | Nektarika" />
        <meta
          property="og:description"
          content="Shop premium organic honey including wildflower, manuka, clover and more. 100% pure and natural products."
        />
        <meta
          property="og:image"
          content="https://www.nektarika.rs/images/cover.jpg"
        />
        <meta property="og:url" content="https://www.nektarika.rs/shop" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Shop Organic Honey | Nektarika",
              "url": "https://www.nektarika.rs/shop",
              "description": "Browse and shop 100% organic honey products from Nektarika including wildflower, clover, and manuka honey."
            }
          `}
        </script>
      </Helmet>

      <h1 className="text-4xl font-bold text-gray-700 mb-10 text-center">
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
