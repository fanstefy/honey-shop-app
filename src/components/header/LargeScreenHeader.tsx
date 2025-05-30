import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useShopStore } from "../../store/useShopStore";
import Sidebar from "../Sidebar";
import logo from "../../assets/images/nektarika_logo_1.png";

const LargeScreenHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarType = useShopStore((state) => state.sidebarType);
  const setSidebarType = useShopStore((state) => state.setSidebarType);
  const closeSidebar = useShopStore((state) => state.closeSidebar);

  const { pathname } = useLocation();
  const wishlist = useShopStore((state) => state.wishlist);
  const cart = useShopStore((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${isScrolled ? "shadow-md" : ""} `}>
      {/* My Account */}
      <div className="w-full bg-white border-b-[1px]">
        <div className="container mx-auto flex items-center space-x-2 px-2 py-2 justify-end">
          <span className="text-primary text-2xl">
            <FaUserCircle />
          </span>
          <Link
            to="/account"
            className="text-black text-sm text-yellow-600 hover:text-yellow-500 transition duration-300"
          >
            My Account
          </Link>
        </div>
      </div>
      <div
        className={
          isScrolled
            ? `w-full h-[56px] bg-white border-b-[1px] fixed top-0 left-0 z-40`
            : ""
        }
      >
        <div
          className={`container mx-auto px-4 py-2 flex items-center ${
            isScrolled ? " top-0 left-10 bg-white z-[1000]" : ""
          }`}
        >
          {/* Logo */}
          <div
            className={`transition-all duration-50 ease-in-out delay-50 ${
              isScrolled ? "w-24" : "w-32"
            }`}
          >
            <Link to="/">
              <img src={logo} alt="nektarika" className="w-full" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="navbar">
            <ul
              className={`flex space-x-6 pt-[17px] ml-20 ${
                isScrolled ? "pt-[8px]" : ""
              }`}
            >
              <li>
                <Link
                  to="/"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/" && "active"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/shop" && "active"
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/about" && "active"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/contact" && "active"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="ml-auto flex mt-[7px] relative">
            {/* Cart Icon */}
            <div
              className="relative cursor-pointer mt-1"
              onClick={() => setSidebarType("cart")}
            >
              <HiOutlineShoppingBag
                size={24}
                className="mr-4 text-yellow-600 hover:text-yellow-500 transition duration-300"
              />
              {/* Cart Count */}
              {cart.length > 0 && (
                <span className="absolute font-bold -top-2 right-2 bg-green text-white text-xs rounded-full h-[16px] w-[16px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Wishlist Icon */}
            <div
              className="relative cursor-pointer mt-1"
              onClick={() => setSidebarType("wishlist")}
            >
              <FaRegHeart
                size={24}
                className="text-yellow-600 hover:text-yellow-500 transition duration-300"
              />
              {/* Wishlist Count */}
              {wishlist.length > 0 && (
                <span className="absolute font-bold -top-2 -right-2 bg-green text-white text-xs rounded-full h-[16px] w-[16px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={sidebarType === "cart"}
        onClose={closeSidebar}
        title="My Cart"
        type="cart"
      />

      <Sidebar
        isOpen={sidebarType === "wishlist"}
        onClose={closeSidebar}
        title="My Wishlist"
        type="wishlist"
      />
    </header>
  );
};

export default LargeScreenHeader;
