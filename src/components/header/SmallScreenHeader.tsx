import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger and close icons
import { useState } from "react";
import logo from "../../assets/images/logo_sace_pcela_3.png";
import { SlArrowLeft } from "react-icons/sl";
import Sidebar from "../Sidebar";

const SmallScreenHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const { pathname } = useLocation(); // Get the current route

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="w-24">
          <Link to="/">
            <img src={logo} alt="nektarika" className="w-full" />
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-yellow-600 text-2xl focus:outline-none"
        >
          <FiMenu />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="My Cart"
        position="left" // Sidebar slides from right to left
        width="w-[265px]"
      >
        {/* Navigation Links */}
        <nav className="mt-16 px-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/" ? "underline font-bold" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={`block text-yellow-600 hover:text-yellow-500 transition duration-300 ${
                  pathname === "/shop" ? "underline font-bold" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
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
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Icons at the Bottom */}
        <div className="absolute bottom-4 left-4 w-full px-4">
          <div className="flex items-center space-x-4 mb-4">
            <HiOutlineShoppingBag className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600">Cart</span>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <FaRegHeart className="text-yellow-600 text-2xl" />
            <span className="text-yellow-600">Wishlist</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-yellow-600 text-2xl" />
            <Link
              to="/account"
              className="text-yellow-600 hover:text-yellow-500 transition duration-300"
              onClick={() => setIsSidebarOpen(false)}
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
        ></div>
      )}
    </header>
  );
};

export default SmallScreenHeader;
