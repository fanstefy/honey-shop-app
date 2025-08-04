import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShopStore } from "../../store/useShopStore";
import logo from "../../assets/images/logo_sace_pcela_3.png";
import { useSidebarStore } from "../../store/useSidebarStore";
import { FaUserCircle } from "react-icons/fa";
import { RxHeart } from "react-icons/rx";
import { BsCart3 } from "react-icons/bs";

const LargeScreenHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const wishlist = useShopStore((state) => state.wishlist);
  const cart = useShopStore((state) => state.cart);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${isScrolled ? "shadow-md mb-[60px]" : ""}`}>
      <div className="w-full bg-white border-b-[1px]">
        <div className="container mx-auto flex items-center space-x-2 px-2 py-2 justify-end">
          <span className="text-primary text-2xl" title="My Account">
            <FaUserCircle />
          </span>
          <Link
            to="/account"
            className="text-black text-sm text-yellow-600 hover:text-yellow-500 transition duration-300"
            aria-label="Go to My Account"
          >
            My Account
          </Link>
        </div>
      </div>

      <div
        className={
          isScrolled
            ? "w-full h-[56px] bg-white border-b-[1px] fixed top-0 left-0 z-40"
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
              isScrolled ? "w-28" : "w-32"
            }`}
          >
            <Link to="/" aria-label="Go to Homepage">
              <img
                src={logo}
                alt="Nektarika - Natural Honey Logo"
                className="w-full"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="navbar" aria-label="Main Navigation">
            <ul
              className={`flex space-x-6 pt-[7px] ml-20 ${
                isScrolled ? "pt-[8px]" : ""
              }`}
            >
              <li>
                <Link
                  to="/"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/" && "active"
                  }`}
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    (pathname === "/shop" ||
                      pathname.includes("/shop/product")) &&
                    "active"
                  }`}
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
                  className={`relative text-yellow-600 transition duration-300 after-effect ${
                    pathname === "/about" && "active"
                  }`}
                  aria-current={pathname === "/about" ? "page" : undefined}
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
                  aria-current={pathname === "/contact" ? "page" : undefined}
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
              className="relative cursor-pointer mt-1 group"
              onClick={() => openSidebar("cart")}
              role="button"
              aria-label="Open Cart Sidebar"
              tabIndex={0}
            >
              <BsCart3
                size={21}
                className="mr-4 text-yellow-500 hover:text-yellow-600 transition duration-300"
              />
              {cart.length > 0 && (
                <span className="absolute font-bold -top-2 right-3 bg-green text-white text-[10px] rounded-full h-[14px] w-[14px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
              <span className="absolute -bottom-5 left-4 border border-black text-black text-xs px-2 opacity-0 group-hover:opacity-100 group-hover:delay-[1000ms] pointer-events-none">
                Cart
              </span>
            </div>

            {/* Wishlist Icon */}
            <div
              className="relative cursor-pointer mt-1 group"
              onClick={() => openSidebar("wishlist")}
              role="button"
              aria-label="Open Wishlist Sidebar"
              tabIndex={0}
            >
              <RxHeart
                size={21}
                className="text-yellow-500 hover:text-yellow-600 transition duration-300"
              />
              {wishlist.length > 0 && (
                <span className="absolute font-bold -top-2 -right-1 bg-green text-white text-[10px] rounded-full h-[14px] w-[14px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              <span className="absolute -bottom-5 left-4 border border-black text-black text-xs px-2 opacity-0 group-hover:opacity-100 group-hover:delay-[1000ms] pointer-events-none">
                Wishlist
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LargeScreenHeader;
