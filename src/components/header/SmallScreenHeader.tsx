import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import logo from "../../assets/images/logo_sace_pcela_3.png";
import Sidebar from "../sidebar/Sidebar";
import { useSidebarStore } from "../../store/useSidebarStore";

const SmallScreenHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const openRightSidebar = useSidebarStore((state) => state.openSidebar);

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
          onClick={() => setIsSidebarOpen(true)}
          className="text-yellow-600 text-2xl focus:outline-none"
          aria-label="Open Menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
                onClick={() => setIsSidebarOpen(false)}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
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
                onClick={() => setIsSidebarOpen(false)}
                aria-current={
                  pathname === "/shop" || pathname.includes("/shop/product")
                    ? "page"
                    : undefined
                }
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/about" ? "underline font-bold" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
                aria-current={pathname === "/about" ? "page" : undefined}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/contact" ? "underline font-bold" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
                aria-current={pathname === "/contact" ? "page" : undefined}
              >
                Contact
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
            <span className="text-yellow-600">Cart</span>
          </div>
          <div
            className="flex items-center space-x-4 mb-4 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Open Wishlist"
            onClick={() => openRightSidebar("wishlist")}
          >
            <FaRegHeart className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600">Wishlist</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-yellow-600 text-2xl" />
            <Link
              to="/profile"
              className="text-yellow-600 hover:text-yellow-500 transition duration-300"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Go to My Account"
            >
              My Account
            </Link>
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
