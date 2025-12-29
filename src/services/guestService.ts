import { auth, signInAsGuest } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { initializeUserDocument } from "./wishlistFirebaseService";

export interface GuestUser {
  uid: string;
  isAnonymous: boolean;
  isGuest: boolean;
}

// Proveri da li je korisnik guest (anonymous)
export const isGuestUser = (user: User | null): boolean => {
  return user?.isAnonymous === true;
};

// Osiguraj da postoji korisnik (registrovan ili guest)
export const ensureUserExists = async (): Promise<GuestUser | null> => {
  try {
    // Ako već postoji korisnik, vrati ga
    if (auth.currentUser) {
      return {
        uid: auth.currentUser.uid,
        isAnonymous: auth.currentUser.isAnonymous,
        isGuest: auth.currentUser.isAnonymous,
      };
    }

    // Inače, uloguj kao guest
    console.log("No user found, signing in as guest...");
    const guestUser = await signInAsGuest();

    if (guestUser) {
      // Inicijalizuj user dokument za guest-a
      await initializeUserDocument(guestUser.uid);

      return {
        uid: guestUser.uid,
        isAnonymous: guestUser.isAnonymous,
        isGuest: guestUser.isAnonymous,
      };
    }

    return null;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return null;
  }
};

// Dobij trenutni user ID (registrovan ili guest)
export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await ensureUserExists();
  return user?.uid || null;
};

// Setup listener za auth promene
export const setupGuestAuthListener = (
  onUserChange: (user: GuestUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Inicijalizuj dokument ako ne postoji
      await initializeUserDocument(firebaseUser.uid);

      onUserChange({
        uid: firebaseUser.uid,
        isAnonymous: firebaseUser.isAnonymous,
        isGuest: firebaseUser.isAnonymous,
      });
    } else {
      // Ako nema korisnika, automatski kreiraj guest-a
      const guestUser = await ensureUserExists();
      onUserChange(guestUser);
    }
  });
};

// Konvertuj anonymous korisnika u registrovanog
export const upgradeGuestToUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    if (!auth.currentUser || !auth.currentUser.isAnonymous) {
      throw new Error("No anonymous user to upgrade");
    }

    const { EmailAuthProvider, linkWithCredential } = await import(
      "firebase/auth"
    );
    const credential = EmailAuthProvider.credential(email, password);

    await linkWithCredential(auth.currentUser, credential);
    console.log("Guest user upgraded to registered user");
    return true;
  } catch (error) {
    console.error("Error upgrading guest user:", error);
    return false;
  }
};
