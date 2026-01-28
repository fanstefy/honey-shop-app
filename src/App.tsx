import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/Footer";
// import ScrollToTop from "./components/ScrollToTop";
import Sidebar from "./components/sidebar/Sidebar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgetPassword";

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
// import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { AuthProvider } from "./contexts/AuthContext";
import ResetPassword from "./pages/ResetPassword";
import { useAuthSync } from "./hooks/useAuthSync";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { useTranslation } from "react-i18next";
import ToastContainer from "./components/ui/ToastContainer";
import ScrollResetWrapper from "./components/ScrollResetWrapper";

import LanguageRedirect from "./components/LanguageRedirect";
import ChatWidget from "./components/ChatWidget";

const initialProducts = [
  {
    id: 1,
    name: "Wildflower Honey",
    image: honey_1,
    backImage: honey_1_back,
    price: 10,
    discount: "0%",
    description: "A rich and floral honey gathered from wildflowers.",
    additionalInfo: "bla bla",
  },
  {
    id: 2,
    name: "Clover Honey",
    image: honey_2,
    price: 12,
    discount: "0%",
    description: "Light and mild, ideal for tea and baking.",
    additionalInfo: "bla bla",
  },
  {
    id: 3,
    name: "Manuka Honey",
    image: honey_3,
    price: 25,
    discount: "0%",
    description: "Premium medicinal honey from the Manuka tree.",
    additionalInfo: "bla bla",
  },
  {
    id: 4,
    name: "Orange Blossom Honey",
    image: honey_4,
    backImage: honey_4_back,
    price: 15,
    discount: "0%",
    description: "Sweet citrus flavor from orange blossoms.",
    additionalInfo: "bla bla",
  },
  {
    id: 5,
    name: "Acacia Honey",
    image: honey_5,
    price: 18,
    discount: "0%",
    description:
      "Clear, mild, and slow to crystallize — perfect for every day.",
    additionalInfo: "bla bla",
  },
];

const App: React.FC = () => {
  return (
    <ToastContainer>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastContainer>
  );
};

// Kreira wrapper komponentu koja koristi hook-ove
const AppContent: React.FC = () => {
  // const [isScrollToTopBtnVisible, setIsScrollToTopBtnVisible] = useState(false);

  const setProducts = useShopStore((state) => state.setProducts);
  const isRightSidebarOpen = useSidebarStore(
    (state) => state.rightSidebar.isOpen
  );
  const sidebarType = useSidebarStore((state) => state.rightSidebar.type);
  const closeSidebar = useSidebarStore((state) => state.closeRightSidebar);

  const { t } = useTranslation();

  useAuthSync();

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrollToTopBtnVisible(window.scrollY > 300);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <>
      {" "}
      <div className="grid grid-rows-layout min-h-screen">
        <Header />

        <div id="recaptcha-container"></div>

        <ScrollResetWrapper>
          <Routes>
            {/* Jezičke rute - samo redirectuju nakon što se jezik setuje u i18n.ts */}
            <Route path="/en/*" element={<LanguageRedirect />} />
            <Route path="/ru/*" element={<LanguageRedirect />} />
            <Route path="/sr/*" element={<LanguageRedirect />} />
            <Route path="/en" element={<LanguageRedirect />} />
            <Route path="/ru" element={<LanguageRedirect />} />
            <Route path="/sr" element={<LanguageRedirect />} />

            {/* Postojeće rute - NEPROMENJENE */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <div>My Orders - Coming Soon</div>
                </PrivateRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          </Routes>
        </ScrollResetWrapper>

        <Footer />
      </div>
      <Sidebar
        isOpen={isRightSidebarOpen}
        onClose={closeSidebar}
        title={
          sidebarType === "cart"
            ? t("sidebar:cartTitle")
            : sidebarType === "wishlist"
            ? t("sidebar:wishlistTitle")
            : sidebarType === "quickview"
            ? t("sidebar:quickViewTitle")
            : ""
        }
        type={sidebarType || "custom"}
      />
      {/* {isScrollToTopBtnVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-yellow-500 hover:bg-yellow-600 opacity-70 text-white p-3 rounded-full shadow-lg transition duration-300"
          aria-label="Scroll to top"
        >
          <MdOutlineKeyboardArrowUp />
        </button>
      )} */}
      <ChatWidget />
    </>
  );
};

export default App;
