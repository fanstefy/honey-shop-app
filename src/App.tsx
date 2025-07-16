import React, { useEffect } from "react";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./styles/app.css";
import Shop from "./pages/Shop";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import honey_1 from "./assets/images/honey_1.jpg";
import honey_2 from "./assets/images/honey_2.jpg";
import honey_3 from "./assets/images/honey_3.jpg";
import honey_4 from "./assets/images/honey_4.jpg";
import honey_5 from "./assets/images/honey_5.jpg";
import honey_1_back from "./assets/images/honey_1_back.jpg";
import honey_4_back from "./assets/images/honey_4_back.jpg";
import { useShopStore } from "./store/useShopStore";
import ScrollToTop from "./components/ScrollToTop";

const initialProducts = [
  {
    id: 1,
    name: "Wildflower Honey",
    image: honey_1,
    backImage: honey_1_back,
    price: 10,
    discount: "0%",
    description: "bla bla bla",
  },
  {
    id: 2,
    name: "Clover Honey",
    image: honey_2,
    price: 12,
    discount: "0%",
    description: "bla bla bla",
  },
  {
    id: 3,
    name: "Manuka Honey",
    image: honey_3,
    price: 25,
    discount: "0%",
    description: "bla bla bla",
  },
  {
    id: 4,
    name: "Orange Blossom Honey",
    image: honey_4,
    backImage: honey_4_back,
    price: 15,
    discount: "0%",
    description: "bla bla bla",
  },
  {
    id: 5,
    name: "Acacia Honey",
    image: honey_5,
    price: 18,
    discount: "0%",
    description: "bla bla bla",
  },
];

const App: React.FC = () => {
  const setProducts = useShopStore((state) => state.setProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

  return (
    <BrowserRouter>
      <div className="grid grid-rows-layout min-h-screen">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
