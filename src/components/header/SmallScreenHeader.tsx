import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import logo from "../../assets/images/logo_sace_pcela_3_edit.png";
import Sidebar from "../sidebar/Sidebar";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import i18n from "../../i18n";

const SmallScreenHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const openRightSidebar = useSidebarStore((state) => state.openRightSidebar);
  const openLeftSidebar = useSidebarStore((state) => state.openLeftSidebar);
  const closeLeftSidebar = useSidebarStore((state) => state.closeLeftSidebar);
  const isLeftSidebarOpen = useSidebarStore(
    (state) => state.leftSidebar.isOpen
  );

  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="w-24">
          <Link to="/" aria-label="Nektarika Home">
            <img
              src={logo}
              alt="Nektarika - Natural Organic Honey Logo"
              className="w-full"
            />
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => openLeftSidebar()}
          className="text-yellow-600 text-2xl focus:outline-none"
          aria-label="Open Menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isLeftSidebarOpen}
        onClose={() => closeLeftSidebar()}
        title="Nektarika"
        position="left"
        width="w-[265px]"
      >
        {/* Navigation */}
        <nav className="px-4" aria-label="Mobile Navigation">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/" ? "underline font-bold" : ""
                }`}
                onClick={() => {
                  setIsSidebarOpen(false);
                  closeLeftSidebar();
                }}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/shop" || pathname.includes("/shop/product")
                    ? "underline font-bold"
                    : ""
                }`}
                onClick={() => {
                  setIsSidebarOpen(false);
                  closeLeftSidebar();
                }}
                aria-current={
                  pathname === "/shop" || pathname.includes("/shop/product")
                    ? "page"
                    : undefined
                }
              >
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/about" ? "underline font-bold" : ""
                }`}
                onClick={() => {
                  setIsSidebarOpen(false);
                  closeLeftSidebar();
                }}
                aria-current={pathname === "/about" ? "page" : undefined}
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/contact" ? "underline font-bold" : ""
                }`}
                onClick={() => {
                  setIsSidebarOpen(false);
                  closeLeftSidebar();
                }}
                aria-current={pathname === "/contact" ? "page" : undefined}
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Buttons (Cart, Wishlist, Account) */}
        <div className="bottom-4 left-4 w-full px-4 mt-6">
          <div
            className="flex items-center space-x-4 mb-4 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Open Cart"
            onClick={() => openRightSidebar("cart")}
          >
            <HiOutlineShoppingBag className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600">{t("cart")}</span>
          </div>
          <div
            className="flex items-center space-x-4 mb-4 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Open Wishlist"
            onClick={() => openRightSidebar("wishlist")}
          >
            <FaRegHeart className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600">{t("wishlist")}</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-yellow-600 text-2xl" />
            <Link
              to="/profile"
              className="text-yellow-600 hover:text-yellow-500 transition duration-300"
              onClick={() => {
                setIsSidebarOpen(false);
                closeLeftSidebar();
              }}
              aria-label="Go to My Account"
            >
              {t("myAccount")}
            </Link>
          </div>
          {/* Language Selector */}
          <div className="relative mt-4 group">
            <button className="text-yellow-600 font-semibold flex items-center">
              <MdLanguage
                size={21}
                className="text-yellow-500 hover:text-yellow-600 transition duration-300"
              />
              <span className="text-sm pl-1 text-yellow-600 font-normal">
                {i18n.language.toUpperCase()}
              </span>
            </button>
            <div className="absolute left-10 bottom-0 mb-2 w-22 bg-white border rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-300 z-50">
              <button
                onClick={() => i18n.changeLanguage("sr")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                SR
              </button>
              <button
                onClick={() => i18n.changeLanguage("en")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage("ru")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </Sidebar>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close Sidebar Overlay"
        ></div>
      )}
    </header>
  );
};

export default SmallScreenHeader;
