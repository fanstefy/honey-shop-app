import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import WishlistSidebarContent from "./WishlistSidebarContent"; // adjust path as needed
import CartSidebarContent from "./CartSidebarContent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "wishlist" | "cart" | "custom";
  position?: "left" | "right";
  width?: string;
  children?: React.ReactNode; // fallback for custom content
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  type = "custom", // default type
  position = "right",
  width = "w-[400px]",
  children,
}) => {
  const translateClass =
    position === "right"
      ? isOpen
        ? "translate-x-0"
        : "translate-x-[430px]"
      : isOpen
      ? "translate-x-0"
      : "-translate-x-[290px]";

  // Decide what content to render based on `type`
  const renderContent = () => {
    switch (type) {
      case "wishlist":
        return <WishlistSidebarContent />;
      case "cart":
        return <CartSidebarContent />;
      case "custom":
      default:
        return children;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } h-full ${width} bg-white shadow-lg z-50 transform ${translateClass} transition-transform duration-[0.4s] ease-in-out`}
      >
        <div className="px-4 py-4 border-b border-gray-300">
          <button
            onClick={onClose}
            className={`group ${
              position === "right" ? "-ml-[35px]" : "float-right -mr-[36px]"
            } bg-white transition duration-300 hover:bg-green hover:border-green p-3 border rounded-full`}
          >
            {position === "right" ? (
              <SlArrowRight
                size={14}
                className="group-hover:text-white transition duration-300"
              />
            ) : (
              <SlArrowLeft
                size={14}
                className="group-hover:text-white transition duration-300"
              />
            )}
          </button>
          <h2 className="text-xl font-bold text-yellow-600 ml-4">{title}</h2>
        </div>
        <div className="p-4">{renderContent()}</div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
