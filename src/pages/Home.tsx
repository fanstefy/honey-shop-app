import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import coverImage from "../assets/images/cover.jpg";
import { Link } from "react-router-dom";
import {
  FaHandsHelping,
  FaLeaf,
  FaRegSmile,
  FaShippingFast,
} from "react-icons/fa";
import ProductItem from "../components/ProductItem";
import { useShopStore } from "../store/useShopStore";
import gsap from "gsap";
import { Helmet } from "react-helmet-async";
import ImageGallery from "../components/ImageGallery";
import bg_cover from "../assets/images/bg_cover_2.jpg";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const products = useShopStore((state) => state.products);

  const coverTextRef = useRef<HTMLDivElement>(null);
  const coverImageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const bestSellingProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [products]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Postavi početne vrednosti SA pomeranjem
      gsap.set(coverTextRef.current, {
        opacity: 0,
        x: -30,
      });

      gsap.set(coverImageRef.current, {
        opacity: 0,
        x: 30,
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(featureCardsRef.current, {
        opacity: 0,
        y: 30,
      });

      const tl = gsap.timeline();

      tl.to(coverTextRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          coverImageRef.current,
          { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          buttonRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .to(
          featureCardsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="lg:pt-0">
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
      <div
        className="w-full bg-cover bg-center bg-no-repeat pb-10"
        style={{
          backgroundImage: `url(${bg_cover})`,
        }}
      >
        <section className="container mx-auto mt-8 pt-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-center md:text-left pl-4 pr-1">
              <div
                ref={coverTextRef}
                className="opacity-0 will-change-transform"
              >
                <h1 className="text-[25px] font-bold leading-[35px] mb-2 text-gray-700">
                  {t("home:heroBannerTitle")}
                </h1>
                <p className="text-gray-700">
                  {t("home:heroBannerDescription")}
                </p>
              </div>
              <div
                ref={buttonRef}
                className="w-full text-center mt-[50px] opacity-0 will-change-transform"
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 uppercase"
                  aria-label="Go to shop"
                >
                  <HiOutlineShoppingBag
                    size={20}
                    className="align-middle relative top-[1px]"
                  />
                  {t("home:shopNowButton")}
                </Link>
              </div>
            </div>

            <div
              ref={coverImageRef}
              className=" md:w-1/2 opacity-0 will-change-transform"
            >
              <img
                src={coverImage}
                alt="Jars of organic honey"
                className="rounded-lg w-[92%] max-h-[400px] object-cover "
                loading="lazy"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div
            ref={featureCardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto px-4 opacity-0 will-change-transform"
          >
            <div className="feature-card flex items-start gap-4 px-4 py-6 border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
              <FaShippingFast size={24} className="text-yellow-600 mt-1" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">
                  {t("home:shipping")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("home:shippingDescription")}
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start gap-4 px-4 py-6 border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
              <FaLeaf size={24} className="text-yellow-600 mt-1" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">
                  {t("home:naturalProducts")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("home:naturalProductsDescription")}
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start gap-4 px-4 py-6 border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
              <FaRegSmile size={24} className="text-yellow-600 mt-1" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">
                  {t("home:handcraftedInSmallBatches")}
                </h3>
                <p className="text-sm text-gray-600">
                  {/* {t("home:handcraftedInSmallBatchesDescription")} */}
                </p>
              </div>
            </div>

            <div className="feature-card flex items-start gap-4 px-4 py-6 border-yellow-100 hover:bg-yellow-300 rounded-lg shadow-md transition-all duration-300">
              <FaHandsHelping size={24} className="text-yellow-600 mt-1" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">
                  {t("home:customerSupport")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("home:customerSupportDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About section */}
      <section className="bg-[#90C785] py-16 w-full mx-auto px-4">
        <div className="container mx-auto  md:w-4/5 lg:w-4/5 text-center">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
            {t("about:aboutNektarika")}
          </h2>
          <p className="text-white leading-7 text-md">
            {t("home:aboutSectionFirstParagraph")}
            <br />
            <br />
            {t("home:aboutSectionSecondParagraph")}
            <br />
            <br />
            {t("home:aboutSectionThirdParagraph")}
          </p>
        </div>
      </section>

      {/* Image Gallery Section */}
      <ImageGallery />

      {/* Best Selling Section */}
      <section className="container mx-auto py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 tracking-wide">
            {t("home:bestSellingProductsTitle")}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {t("home:bestSellingProductsDescription")}
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
