import React, { ReactNode } from "react";
import Toast from "./Toast";
import { useToast } from "../../hooks/useToast";

interface ToastContainerProps {
  children: ReactNode;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const { toast, hideToast } = useToast();

  return (
    <>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default ToastContainer;
