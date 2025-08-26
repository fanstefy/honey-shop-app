import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
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

// Učitaj wishlist iz Firebase-a
export const loadUserWishlist = async (userId: string): Promise<number[]> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as UserData;
      return data.wishlist || [];
    }
    return [];
  } catch (error) {
    console.error("Error loading wishlist:", error);
    return [];
  }
};

// Sačuvaj wishlist u Firebase
export const saveUserWishlist = async (
  userId: string,
  wishlist: number[]
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);

    // Prvo proveravamo da li dokument postoji
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update postojeći dokument
      await updateDoc(userDocRef, {
        wishlist,
        lastUpdated: serverTimestamp(),
      });
    } else {
      // Kreiraj novi dokument
      await setDoc(userDocRef, {
        wishlist,
        cart: [],
        lastUpdated: serverTimestamp(),
      });
    }
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
  const userDocRef = doc(db, "users", userId);

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
        callback({
          wishlist: [],
          cart: [],
        });
      }
    },
    (error) => {
      console.error("Error listening to user data:", error);
    }
  );
};

// Real-time listener za wishlist
export const subscribeToUserWishlist = (
  userId: string,
  callback: (wishlist: number[]) => void
): Unsubscribe => {
  const userDocRef = doc(db, "users", userId);

  return onSnapshot(
    userDocRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserData;
        callback(data.wishlist || []);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error listening to wishlist:", error);
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
