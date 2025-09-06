import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enNavbar from "./locales/en/navbar.json";
import srNavbar from "./locales/sr/navbar.json";
import ruNavbar from "./locales/ru/navbar.json";

import enAuth from "./locales/en/auth.json";
import srAuth from "./locales/sr/auth.json";
import ruAuth from "./locales/ru/auth.json";

import enContact from "./locales/en/contact.json";
import srContact from "./locales/sr/contact.json";
import ruContact from "./locales/ru/contact.json";

import enShop from "./locales/en/shop.json";
import srShop from "./locales/sr/shop.json";
import ruShop from "./locales/ru/shop.json";

import enProductItem from "./locales/en/productItem.json";
import srProductItem from "./locales/sr/productItem.json";
import ruProductItem from "./locales/ru/productItem.json";

import enSidebar from "./locales/en/sidebar.json";
import srSidebar from "./locales/sr/sidebar.json";
import ruSidebar from "./locales/ru/sidebar.json";

import enCart from "./locales/en/cart.json";
import srCart from "./locales/sr/cart.json";
import ruCart from "./locales/ru/cart.json";

import enCheckout from "./locales/en/checkout.json";
import srCheckout from "./locales/sr/checkout.json";
import ruCheckout from "./locales/ru/checkout.json";

import enOrderSuccess from "./locales/en/orderSuccess.json";
import srOrderSuccess from "./locales/sr/orderSuccess.json";
import ruOrderSuccess from "./locales/ru/orderSuccess.json";

import enProfile from "./locales/en/profile.json";
import srProfile from "./locales/sr/profile.json";
import ruProfile from "./locales/ru/profile.json";

import enPersonalInformation from "./locales/en/personalInformation.json";
import srPersonalInformation from "./locales/sr/personalInformation.json";
import ruPersonalInformation from "./locales/ru/personalInformation.json";

import enOrders from "./locales/en/orders.json";
import srOrders from "./locales/sr/orders.json";
import ruOrders from "./locales/ru/orders.json";

import enFavorites from "./locales/en/favorites.json";
import srFavorites from "./locales/sr/favorites.json";
import ruFavorites from "./locales/ru/favorites.json";

import enSettings from "./locales/en/settings.json";
import srSettings from "./locales/sr/settings.json";
import ruSettings from "./locales/ru/settings.json";

const savedLanguage = localStorage.getItem("i18nextLng") || "sr";

i18n
  .use(initReactI18next) // spaja i18next sa React-om
  .init({
    defaultNS: "navbar",
    resources: {
      en: {
        navbar: enNavbar,
        auth: enAuth,
        contact: enContact,
        shop: enShop,
        productItem: enProductItem,
        sidebar: enSidebar,
        cart: enCart,
        checkout: enCheckout,
        orderSuccess: enOrderSuccess,
        profile: enProfile,
        personalInformation: enPersonalInformation,
        orders: enOrders,
        favorites: enFavorites,
        settings: enSettings,
      },
      ru: {
        navbar: ruNavbar,
        auth: ruAuth,
        contact: ruContact,
        shop: ruShop,
        productItem: ruProductItem,
        sidebar: ruSidebar,
        cart: ruCart,
        checkout: ruCheckout,
        orderSuccess: ruOrderSuccess,
        profile: ruProfile,
        personalInformation: ruPersonalInformation,
        orders: ruOrders,
        favorites: ruFavorites,
        settings: ruSettings,
      },
      sr: {
        navbar: srNavbar,
        auth: srAuth,
        contact: srContact,
        shop: srShop,
        productItem: srProductItem,
        sidebar: srSidebar,
        cart: srCart,
        checkout: srCheckout,
        orderSuccess: srOrderSuccess,
        profile: srProfile,
        personalInformation: srPersonalInformation,
        orders: srOrders,
        favorites: srFavorites,
        settings: srSettings,
      },
    },
    lng: savedLanguage, // koristi sačuvani jezik
    fallbackLng: "en", // ako nema prevoda
    interpolation: {
      escapeValue: false,
    },
  });

// Dodaj event listener za čuvanje jezika
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
