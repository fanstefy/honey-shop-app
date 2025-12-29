// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";

// interface CartItem {
//   id: number;
//   quantity: number;
// }

// interface CartData {
//   cart: CartItem[];
//   lastUpdated?: any; // Firestore Timestamp
// }

// // Učitaj cart iz Firebase-a
// export const loadUserCart = async (userId: string): Promise<CartItem[]> => {
//   try {
//     const userDocRef = doc(db, "users", userId);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       const data = userDoc.data() as CartData;
//       return data.cart || [];
//     }
//     return [];
//   } catch (error) {
//     console.error("Error loading cart:", error);
//     return [];
//   }
// };

// // Sačuvaj cart u Firebase
// export const saveUserCart = async (
//   userId: string,
//   cart: CartItem[]
// ): Promise<void> => {
//   try {
//     const userDocRef = doc(db, "users", userId);

//     // Prvo proveravamo da li dokument postoji
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       // Update postojeći dokument
//       await updateDoc(userDocRef, {
//         cart,
//         lastUpdated: serverTimestamp(),
//       });
//     } else {
//       // Kreiraj novi dokument
//       await setDoc(userDocRef, {
//         cart,
//         lastUpdated: serverTimestamp(),
//       });
//     }
//   } catch (error) {
//     console.error("Error saving cart:", error);
//     throw error;
//   }
// };

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
  if (!userId) {
    console.warn("❌ loadUserCart: userId is missing");
    return [];
  }

  try {
    const userDocRef = doc(db, "Users", userId); // Usklađeno sa Firestore rules
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as CartData;
      return data.cart || [];
    }
    return [];
  } catch (error) {
    console.error("❌ Error loading cart:", error);
    return [];
  }
};

// Sačuvaj cart u Firebase
export const saveUserCart = async (
  userId: string,
  cart: CartItem[]
): Promise<void> => {
  if (!userId) {
    console.warn("❌ saveUserCart: userId is missing");
    return;
  }

  try {
    const userDocRef = doc(db, "Users", userId);

    // Ako dokument ne postoji, setDoc će ga napraviti
    await setDoc(
      userDocRef,
      {
        cart,
        lastUpdated: serverTimestamp(),
      },
      { merge: true } // ⚡ merge: true čuva ostala polja
    );

    console.log("✅ Cart saved for user:", userId);
  } catch (error) {
    console.error("❌ Error saving cart:", error);
    throw error;
  }
};
