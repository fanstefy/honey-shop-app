import { auth } from "./firebase";
import { signInAnonymously, User } from "firebase/auth";

export const signInAsGuest = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    console.log("✅ Guest signed in:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("❌ Error signing in anonymously:", error);
    return null;
  }
};
