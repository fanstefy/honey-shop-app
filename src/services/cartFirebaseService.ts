import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface CartItem {
  id: number;
  quantity: number;
}

interface CartData {
  cart: CartItem[];
  lastUpdated?: any; // Firestore Timestamp
}

// Učitaj cart iz Firebase-a
export const loadUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as CartData;
      return data.cart || [];
    }
    return [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};

// Sačuvaj cart u Firebase
export const saveUserCart = async (
  userId: string,
  cart: CartItem[]
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);

    // Prvo proveravamo da li dokument postoji
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update postojeći dokument
      await updateDoc(userDocRef, {
        cart,
        lastUpdated: serverTimestamp(),
      });
    } else {
      // Kreiraj novi dokument
      await setDoc(userDocRef, {
        cart,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error saving cart:", error);
    throw error;
  }
};
