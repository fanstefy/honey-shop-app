// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   onSnapshot,
//   serverTimestamp,
//   Unsubscribe,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";
// import { User } from "firebase/auth";

// interface CartItem {
//   id: number;
//   quantity: number;
// }

// export interface UserData {
//   wishlist: number[];
//   cart: CartItem[];
//   lastUpdated?: any; // Firestore Timestamp
// }

// // Učitaj wishlist iz Firebase-a
// export const loadUserWishlist = async (userId: string): Promise<number[]> => {
//   try {
//     const userDocRef = doc(db, "Users", userId);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       const data = userDoc.data() as UserData;
//       return data.wishlist || [];
//     }
//     return [];
//   } catch (error) {
//     console.error("Error loading wishlist:", error);
//     return [];
//   }
// };

// // Sačuvaj wishlist u Firebase
// export const saveUserWishlist = async (
//   userId: string,
//   wishlist: number[]
// ): Promise<void> => {
//   try {
//     const userDocRef = doc(db, "Users", userId);

//     // Prvo proveravamo da li dokument postoji
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       // Update postojeći dokument
//       await updateDoc(userDocRef, {
//         wishlist,
//         lastUpdated: serverTimestamp(),
//       });
//     } else {
//       // Kreiraj novi dokument
//       await setDoc(userDocRef, {
//         wishlist,
//         cart: [],
//         lastUpdated: serverTimestamp(),
//       });
//     }
//   } catch (error) {
//     console.error("Error saving wishlist:", error);
//     throw error;
//   }
// };

// // Real-time listener za user podatke (wishlist + cart)
// export const subscribeToUserData = (
//   userId: string,
//   callback: (data: { wishlist: number[]; cart: CartItem[] }) => void
// ): Unsubscribe => {
//   const userDocRef = doc(db, "Users", userId);

//   return onSnapshot(
//     userDocRef,
//     (doc) => {
//       if (doc.exists()) {
//         const data = doc.data() as UserData;
//         callback({
//           wishlist: data.wishlist || [],
//           cart: data.cart || [],
//         });
//       } else {
//         callback({
//           wishlist: [],
//           cart: [],
//         });
//       }
//     },
//     (error) => {
//       console.error("Error listening to user data:", error);
//     }
//   );
// };

// // Real-time listener za wishlist
// export const subscribeToUserWishlist = (
//   userId: string,
//   callback: (wishlist: number[]) => void
// ): Unsubscribe => {
//   const userDocRef = doc(db, "Users", userId);

//   return onSnapshot(
//     userDocRef,
//     (doc) => {
//       if (doc.exists()) {
//         const data = doc.data() as UserData;
//         callback(data.wishlist || []);
//       } else {
//         callback([]);
//       }
//     },
//     (error) => {
//       console.error("Error listening to wishlist:", error);
//     }
//   );
// };

// // Dodaj proizvod u wishlist
// export const addToWishlistFirebase = async (
//   userId: string,
//   productId: number
// ): Promise<void> => {
//   try {
//     const currentWishlist = await loadUserWishlist(userId);

//     if (!currentWishlist.includes(productId)) {
//       const newWishlist = [...currentWishlist, productId];
//       await saveUserWishlist(userId, newWishlist);
//     }
//   } catch (error) {
//     console.error("Error adding to wishlist:", error);
//     throw error;
//   }
// };

// // Ukloni proizvod iz wishlist-a
// export const removeFromWishlistFirebase = async (
//   userId: string,
//   productId: number
// ): Promise<void> => {
//   try {
//     const currentWishlist = await loadUserWishlist(userId);
//     const newWishlist = currentWishlist.filter((id) => id !== productId);
//     await saveUserWishlist(userId, newWishlist);
//   } catch (error) {
//     console.error("Error removing from wishlist:", error);
//     throw error;
//   }
// };

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db, signInAsGuest, auth } from "../lib/firebase";
import { User } from "firebase/auth";

interface CartItem {
  id: number;
  quantity: number;
}

export interface UserData {
  wishlist: number[];
  cart: CartItem[];
  lastUpdated?: any; // Firestore Timestamp
}

// Helper funkcija za osiguravanje postojanja korisnika
export const ensureUserExists = async (): Promise<string | null> => {
  try {
    // Ako već postoji korisnik, vrati ga
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }

    // Inače, uloguj kao guest
    console.log("No user found, signing in as guest...");
    const guestUser = await signInAsGuest();
    return guestUser?.uid || null;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return null;
  }
};

// Helper funkcija za kreiranje početnog korisničkog dokumenta
export const initializeUserDocument = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        wishlist: [],
        cart: [],
        lastUpdated: serverTimestamp(),
      });
      console.log("User document initialized for:", userId);
    }
  } catch (error) {
    console.error("Error initializing user document:", error);
  }
};

// Učitaj wishlist iz Firebase-a
export const loadUserWishlist = async (userId?: string): Promise<number[]> => {
  try {
    // Osiguraj postojanje korisnika
    const finalUserId = userId || (await ensureUserExists());
    if (!finalUserId) {
      console.warn("No user ID available");
      return [];
    }

    const userDocRef = doc(db, "Users", finalUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      return data.wishlist || [];
    }

    // Ako dokument ne postoji, inicijalizuj ga
    await initializeUserDocument(finalUserId);
    return [];
  } catch (error: any) {
    console.error("Error loading wishlist:", error);
    // Ako je greška "permission denied", vrati prazan niz
    if (error.code === "permission-denied") {
      console.log("Permission denied - returning empty wishlist");
      return [];
    }
    return [];
  }
};

// Sačuvaj wishlist u Firebase
export const saveUserWishlist = async (
  userId: string,
  wishlist: number[]
): Promise<void> => {
  try {
    // Osiguraj postojanje korisnika ako userId nije prosleđen
    const finalUserId = userId || (await ensureUserExists());
    if (!finalUserId) {
      console.warn("No user ID available for saving wishlist");
      return;
    }

    const userDocRef = doc(db, "Users", finalUserId);

    // Koristi setDoc sa merge da sačuvaš ostala polja
    await setDoc(
      userDocRef,
      {
        wishlist,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("Wishlist saved for user:", finalUserId);
  } catch (error) {
    console.error("Error saving wishlist:", error);
    throw error;
  }
};

// Real-time listener za user podatke (wishlist + cart)
export const subscribeToUserData = (
  userId: string,
  callback: (data: { wishlist: number[]; cart: CartItem[] }) => void
): Unsubscribe => {
  const userDocRef = doc(db, "Users", userId);

  return onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserData;
        callback({
          wishlist: data.wishlist || [],
          cart: data.cart || [],
        });
      } else {
        // Kreiraj prazan dokument ako ne postoji
        initializeUserDocument(userId)
          .then(() => {
            callback({
              wishlist: [],
              cart: [],
            });
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
            callback({
              wishlist: [],
              cart: [],
            });
          });
      }
    },
    (error) => {
      console.error("Error listening to user data:", error);
      // Ako je greška "permission denied", vrati prazne vrednosti
      if (error.code === "permission-denied") {
        callback({
          wishlist: [],
          cart: [],
        });
      }
    }
  );
};

// Real-time listener za wishlist
export const subscribeToUserWishlist = (
  userId: string,
  callback: (wishlist: number[]) => void
): Unsubscribe => {
  const userDocRef = doc(db, "Users", userId);

  return onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserData;
        callback(data.wishlist || []);
      } else {
        // Kreiraj prazan dokument ako ne postoji
        initializeUserDocument(userId)
          .then(() => {
            callback([]);
          })
          .catch((error) => {
            console.error("Error creating user document:", error);
            callback([]);
          });
      }
    },
    (error) => {
      console.error("Error listening to wishlist:", error);
      // Ako je greška "permission denied", vrati prazan niz
      if (error.code === "permission-denied") {
        callback([]);
      }
    }
  );
};

// Dodaj proizvod u wishlist
export const addToWishlistFirebase = async (
  userId: string,
  productId: number
): Promise<void> => {
  try {
    const currentWishlist = await loadUserWishlist(userId);

    if (!currentWishlist.includes(productId)) {
      const newWishlist = [...currentWishlist, productId];
      await saveUserWishlist(userId, newWishlist);
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Ukloni proizvod iz wishlist-a
export const removeFromWishlistFirebase = async (
  userId: string,
  productId: number
): Promise<void> => {
  try {
    const currentWishlist = await loadUserWishlist(userId);
    const newWishlist = currentWishlist.filter((id) => id !== productId);
    await saveUserWishlist(userId, newWishlist);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};
