import React, { useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="mr-2" />;
      case "error":
        return <FaTimes className="mr-2" />;
      default:
        return <FaCheckCircle className="mr-2" />;
    }
  };

  return (
    <div
      className={`fixed w-4/5 top-36 left-1/2 bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center transition-all ease-in duration-300 ${
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
      } ${getToastStyles()}`}
      role="alert"
    >
      {getIcon()}
      <span className="mr-3 w-1/2">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

export default Toast;
