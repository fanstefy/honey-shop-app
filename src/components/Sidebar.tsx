import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "left" | "right"; // position prop - control the sidebar's position
  width?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right", // default is right
  width = "w-[400px]", // Default width is 400px
}) => {
  // Determine the translation class based on the position
  const translateClass =
    position === "right"
      ? isOpen
        ? "translate-x-0"
        : "translate-x-[430px]"
      : isOpen
      ? "translate-x-0"
      : "-translate-x-[290px]";

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } h-full ${width} bg-white shadow-lg z-50 transform ${translateClass} transition-transform duration-[0.4s] ease-in-out`}
      >
        <div className="px-4 py-4 border-b border-gray-300">
          {/* Close Button */}
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
        <div className="p-4">{children}</div>
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
