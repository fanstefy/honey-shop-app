import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { useSidebarStore } from "../../store/useSidebarStore";
import CartSidebarContent from "./CartSidebarContent";
import QuickViewSidebarContent from "./QuickViewSidebarContent";
import WishlistSidebarContent from "./WishlistSidebarContent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "wishlist" | "cart" | "quickview" | "custom";
  position?: "left" | "right";
  width?: string;
  children?: React.ReactNode; // fallback for custom content
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  type = "custom",
  position = "right",
  width = "w-[350px]",
  children,
}) => {
  const quickViewProduct = useSidebarStore((state) => state.quickViewProduct);

  const translateClass =
    position === "right"
      ? isOpen
        ? "translate-x-0"
        : "translate-x-[430px]"
      : isOpen
      ? "translate-x-0"
      : "-translate-x-[290px]";

  const renderContent = () => {
    switch (type) {
      case "wishlist":
        return <WishlistSidebarContent />;
      case "cart":
        return <CartSidebarContent />;
      case "quickview":
        return <QuickViewSidebarContent product={quickViewProduct} />;
      case "custom":
      default:
        return children;
    }
  };

  return (
    <>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        tabIndex={-1}
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } h-full ${width} bg-white shadow-lg z-50 transform ${translateClass} transition-transform duration-[0.4s] ease-in-out`}
      >
        <div className="flex items-center px-4 py-4 border-b border-gray-300">
          <button
            onClick={onClose}
            className={`group ${
              position === "right" ? "-ml-[35px]" : "float-right"
            } bg-white transition duration-300 hover:bg-green hover:border-green p-3 border rounded-full`}
            aria-label="Close Sidebar"
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
          <h2
            id="sidebar-title"
            className="text-xl font-bold text-yellow-600 ml-4"
          >
            {title}
          </h2>
        </div>
        <div className="flex flex-col h-[calc(100%-75px)] justify-between p-4">
          {renderContent()}
        </div>
      </aside>

      {/* Overlay with accessibility handling */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;
