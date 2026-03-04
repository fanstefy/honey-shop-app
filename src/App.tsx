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

export const initialProducts = [
  {
    id: 1,
    name: "Med sa semenom koprive",
    image: honey_1,
    backImage: honey_1_back,
    price: 10,
    discount: "0%",
    description:
      "Med sa semenom koprive predstavlja pažljivo izbalansiran spoj prirodnog domaćeg meda i jedne od najcenjenijih biljaka u tradicionalnoj upotrebi. Namenjen je svakodnevnoj podršci organizmu.",
    additionalInfo: {
      recommendedFor: [
        "podrška imunitetu",
        "umor i iscrpljenost",
        "dodatna energija i vitalnost",
      ],
      properties: [
        "tradicionalno se koristi za jačanje organizma",
        "prirodni izvor minerala",
        "doprinosi opštem balansu tela",
      ],
      usage: "1–2 kašičice dnevno, samostalno ili uz napitak.",
    },
  },

  {
    id: 2,
    name: "Med sa suvom malinom",
    image: honey_2,
    backImage: honey_1_back,
    price: 11,
    discount: "0%",
    description:
      "Spoj domaćeg meda i suve maline daje prijatan voćni ukus i prirodnu svežinu, idealnu za svakodnevnu upotrebu.",
    additionalInfo: {
      recommendedFor: [
        "podrška imunitetu",
        "sezonske promene",
        "osveženje organizma",
      ],
      properties: [
        "bogata antioksidansima",
        "tradicionalno se koristi u narodnoj ishrani",
        "prijatnog i osvežavajućeg ukusa",
      ],
      usage: "1 kašičica dnevno ili kao dodatak čaju i doručku.",
    },
  },

  {
    id: 3,
    name: "Med sa borovnicom",
    image: honey_3,
    backImage: honey_1_back,
    price: 12,
    discount: "0%",
    description:
      "Med sa borovnicom kombinuje domaći med i jedno od najcenjenijih šumskih plodova, poznato po bogatom sastavu.",
    additionalInfo: {
      recommendedFor: [
        "mentalni i fizički napor",
        "svakodnevnu vitalnost",
        "opšte zdravlje",
      ],
      properties: [
        "bogata prirodnim antioksidansima",
        "doprinosi balansu organizma",
        "tamne boje i punog ukusa",
      ],
      usage: "1 kašičica dnevno, samostalno ili uz obrok.",
    },
  },

  {
    id: 4,
    name: "Med sa koštunjavim voćem",
    image: honey_4,
    backImage: honey_4_back,
    price: 13,
    discount: "0%",
    description:
      "Energetski bogat proizvod koji spaja domaći med i pažljivo odabrano koštunjavo voće.",
    additionalInfo: {
      recommendedFor: [
        "za fizički aktivne osobe",
        "za sportiste",
        "za dugotrajnu energiju",
      ],
      properties: [
        "prirodni izvor zdravih masti",
        "bogat i hranljiv sastav",
        "doprinosi osećaju sitosti",
      ],
      usage: "Idealan za doručak ili kao zdrava užina.",
    },
  },

  {
    id: 5,
    name: "Med sa suvom jagodom",
    image: honey_5,
    backImage: honey_1_back,
    price: 11,
    discount: "0%",
    description:
      "Blag i aromatičan proizvod koji spaja domaći med i suvu jagodu, prijatan za sve uzraste.",
    additionalInfo: {
      recommendedFor: [
        "svakodnevnu upotrebu",
        "decu i odrasle",
        "prirodnu zamenu za slatkiše",
      ],
      properties: [
        "osvežavajuć i blag ukus",
        "prirodni izvor vitamina",
        "lagan i prijatan za konzumaciju",
      ],
      usage: "Samostalno ili kao dodatak desertima.",
    },
  },

  {
    id: 6,
    name: "Med sa mlevenim šipurkom",
    image: honey_5,
    backImage: honey_1_back,
    price: 12,
    discount: "0%",
    description:
      "Tradicionalni spoj domaćeg meda i mlevenog šipurka, poznatog po bogatom nutritivnom sastavu.",
    additionalInfo: {
      recommendedFor: [
        "podršku imunitetu",
        "zimski period",
        "otpornost organizma",
      ],
      properties: [
        "bogat prirodnim vitaminima",
        "tradicionalno korišćen u narodnoj ishrani",
        "blago kiselkastog ukusa",
      ],
      usage: "1 kašičica dnevno, po potrebi.",
    },
  },

  {
    id: 7,
    name: "Med sa reishi gljivom",
    image: honey_5,
    backImage: honey_1_back,
    price: 14,
    discount: "0%",
    description:
      "Jedinstven proizvod koji spaja domaći med i reishi gljivu, cenjenu u tradicionalnim kulturama.",
    additionalInfo: {
      recommendedFor: [
        "podršku imunitetu",
        "periode stresa",
        "balans organizma",
      ],
      properties: [
        "tradicionalno korišćena u istočnim kulturama",
        "povezuje se sa ravnotežom i otpornošću",
        "pogodna za dugoročnu upotrebu",
      ],
      usage: "1 kašičica dnevno, u kontinuitetu.",
    },
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
  const setProducts = useShopStore((state) => state.setProducts);
  const isRightSidebarOpen = useSidebarStore(
    (state) => state.rightSidebar.isOpen,
  );
  const sidebarType = useSidebarStore((state) => state.rightSidebar.type);
  const closeSidebar = useSidebarStore((state) => state.closeRightSidebar);

  const { t } = useTranslation();

  useAuthSync();

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

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
