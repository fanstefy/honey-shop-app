// src/lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

// Your web app's Firebase configuration (zameni sa svojim podacima!)
const firebaseConfig = {
  apiKey: "AIzaSyCRU1oW6pjltKE6IOxE54jfA6y6og95QL8",
  authDomain: "pcelinji-proizvodi.firebaseapp.com",
  projectId: "pcelinji-proizvodi",
  storageBucket: "pcelinji-proizvodi.firebasestorage.app",
  messagingSenderId: "522740735037",
  appId: "1:522740735037:web:660bcc3809a3ad75ed9e54",
  measurementId: "G-BS428F5E42",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export { logEvent };

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

// Google provider za social login
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

// Helper funkcija za reCAPTCHA (potrebno za phone auth)
export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: (response: any) => {
      console.log("reCAPTCHA solved");
    },
  });
};

export default app;
