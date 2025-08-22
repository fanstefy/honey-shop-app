import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, analytics, logEvent } from "../lib/firebase";

export const trackUserLogin = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      loginCount: increment(1),
    });
  } else {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      loginCount: 1,
    });
  }

  // 🔹 Firebase Analytics event
  logEvent(analytics, "login", {
    method: user.providerData[0]?.providerId || "unknown",
    userId: user.uid,
  });
};
