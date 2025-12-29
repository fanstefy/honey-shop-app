// import { useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useShopStore } from "../store/useShopStore";

// export const useAuthSync = () => {
//   const { currentUser } = useAuth();
//   const { setCurrentUser } = useShopStore();

//   useEffect(() => {
//     setCurrentUser(currentUser);
//   }, [currentUser, setCurrentUser]);
// };

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useShopStore } from "../store/useShopStore";
import { initializeUserDocument } from "../services/wishlistFirebaseService";

export const useAuthSync = () => {
  const { currentUser } = useAuth();
  const { setCurrentUser } = useShopStore();

  useEffect(() => {
    const handleUserAuth = async () => {
      if (currentUser) {
        // Samo ako JE ulogovan korisnik
        try {
          await initializeUserDocument(currentUser.uid);
          setCurrentUser(currentUser);
        } catch (error) {
          console.error("Error initializing user document:", error);
          setCurrentUser(currentUser);
        }
      } else {
        // Ako NEMA korisnika, samo očisti store
        setCurrentUser(null);
        console.log("No user - cleared store");
      }
    };

    handleUserAuth();
  }, [currentUser, setCurrentUser]);
};
