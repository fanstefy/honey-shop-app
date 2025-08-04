import { useMemo, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import coverImage from "../assets/images/cover.jpg";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import {
  FaHandsHelping,
  FaLeaf,
  FaRegSmile,
  FaShippingFast,
} from "react-icons/fa";
import ProductItem from "../components/ProductItem";
import { useShopStore } from "../store/useShopStore";

const Home: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const products = useShopStore((state) => state.products);

  const bestSellingProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [products]);

  return (
    <main className="container mx-auto min-h-screen pt-[60px] lg:pt-0">
      <Helmet>
        <title>Buy Organic Honey | Nektarika</title>
        <meta
          name="description"
          content="100% organic honey from local producers. Wildflower, Manuka, Clover and more – natural, healthy, and delicious."
        />
        <meta
          name="keywords"
          content="organic honey, wildflower honey, manuka honey, natural honey Serbia, clover honey"
        />
        <link rel="canonical" href="https://www.nektarika.rs/" />
        <meta property="og:title" content="Buy Organic Honey | Nektarika" />
        <meta
          property="og:description"
          content="Organic wildflower, manuka and clover honey from local producers. 100% pure and natural."
        />
        <meta
          property="og:image"
          content="https://www.nektarika.rs/images/cover.jpg"
        />
        <meta property="og:url" content="https://www.nektarika.rs/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nektarika",
            "url": "https://www.nektarika.rs",
            "logo": "https://www.nektarika.rs/logo.png"
          }
        `}
        </script>
      </Helmet>

      {/* Cover Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left pl-4 pr-1">
            <h1 className="text-[25px] font-bold leading-[35px] mb-2 text-gray-700">
              Discover 100% Organic Honey – Straight from Nature
            </h1>
            <p className="text-gray-700">
              At Nektarika, we produce pure, organic honey that supports your
              health and well-being. From wildflower to manuka, every jar is
              packed with natural goodness.
            </p>
            <div className="w-full text-center mt-[50px]">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-full transition duration-300 uppercase"
                aria-label="Go to shop"
              >
                <HiOutlineShoppingBag
                  size={18}
                  className="align-middle relative top-[1px]"
                />
                Shop Now
              </Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <img
              src={coverImage}
              alt="Jars of organic honey"
              className="rounded-lg w-[92%] max-h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-4 px-4 py-6 border border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
            <FaShippingFast size={24} className="text-yellow-600 mt-1" />
            <div>
              <h3 className="text-md font-semibold text-gray-800">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Enjoy Free Shipping On All Orders
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-4 py-6 border border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
            <FaLeaf size={24} className="text-yellow-600 mt-1" />
            <div>
              <h3 className="text-md font-semibold text-gray-800">
                Certified Organic
              </h3>
              <p className="text-sm text-gray-600">100% Quality guarantee</p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-4 py-6 border border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
            <FaRegSmile size={24} className="text-yellow-600 mt-1" />
            <div>
              <h3 className="text-md font-semibold text-gray-800">
                Cruelty Free
              </h3>
              <p className="text-sm text-gray-600">
                All products are cruelty free
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-4 py-6 border border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
            <FaHandsHelping size={24} className="text-yellow-600 mt-1" />
            <div>
              <h3 className="text-md font-semibold text-gray-800">
                24/7 Support
              </h3>
              <p className="text-sm text-gray-600">
                We will serve you 24/7 for your doubts and queries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="bg-white py-16">
        <div className="mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wide">
            About Nektarika
          </h2>
          <p className="text-gray-700 leading-7 text-md">
            Nektarika is built for organic product lovers. From food and
            groceries to health and personal care items, we proudly serve
            thousands of satisfied customers every month.
            <br />
            Beyond delivering high-quality products, we focus on launching new
            organic solutions and supporting a sustainable environment. Our
            honey products are trusted by health-conscious individuals across
            the country.
            <br />
            We follow best manufacturing practices and are certified by several
            reputable food and organic safety standards. You can explore our
            certifications in the dedicated section.
          </p>
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wide">
            Best Selling Food Products
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Find top selling products from Nektarika such as Wildflower Honey,
            Manuka Honey and more.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {bestSellingProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
