import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Sidebar from "./components/sidebar/Sidebar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { useShopStore } from "./store/useShopStore";
import { useSidebarStore } from "./store/useSidebarStore";

import honey_1 from "./assets/images/honey_1.jpg";
import honey_2 from "./assets/images/honey_2.jpg";
import honey_3 from "./assets/images/honey_3.jpg";
import honey_4 from "./assets/images/honey_4.jpg";
import honey_5 from "./assets/images/honey_5.jpg";
import honey_1_back from "./assets/images/honey_1_back.jpg";
import honey_4_back from "./assets/images/honey_4_back.jpg";

import "./styles/app.css";
import Cart from "./pages/Cart";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

const initialProducts = [
  {
    id: 1,
    name: "Wildflower Honey",
    image: honey_1,
    backImage: honey_1_back,
    price: 10,
    discount: "0%",
    description: "A rich and floral honey gathered from wildflowers.",
  },
  {
    id: 2,
    name: "Clover Honey",
    image: honey_2,
    price: 12,
    discount: "0%",
    description: "Light and mild, ideal for tea and baking.",
  },
  {
    id: 3,
    name: "Manuka Honey",
    image: honey_3,
    price: 25,
    discount: "0%",
    description: "Premium medicinal honey from the Manuka tree.",
  },
  {
    id: 4,
    name: "Orange Blossom Honey",
    image: honey_4,
    backImage: honey_4_back,
    price: 15,
    discount: "0%",
    description: "Sweet citrus flavor from orange blossoms.",
  },
  {
    id: 5,
    name: "Acacia Honey",
    image: honey_5,
    price: 18,
    discount: "0%",
    description:
      "Clear, mild, and slow to crystallize — perfect for every day.",
  },
];

const App: React.FC = () => {
  const [isScrollToTopBtnVisible, setIsScrollToTopBtnVisible] = useState(false);

  const setProducts = useShopStore((state) => state.setProducts);
  const isOpen = useSidebarStore((state) => state.isOpen);
  const sidebarType = useSidebarStore((state) => state.sidebarType);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollToTopBtnVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid grid-rows-layout min-h-screen">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </div>

      <Sidebar
        isOpen={isOpen}
        onClose={closeSidebar}
        title={
          sidebarType === "cart"
            ? "My Cart"
            : sidebarType === "wishlist"
            ? "Wishlist"
            : sidebarType === "quickview"
            ? "Quick View"
            : ""
        }
        type={sidebarType || "custom"}
      />

      {isScrollToTopBtnVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition duration-300"
          aria-label="Scroll to top"
        >
          <MdOutlineKeyboardArrowUp />
        </button>
      )}
    </>
  );
};

export default App;
