import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useShopStore } from "../store/useShopStore";

export const useAuthSync = () => {
  const { currentUser } = useAuth();
  const { setCurrentUser } = useShopStore();

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser, setCurrentUser]);
};
