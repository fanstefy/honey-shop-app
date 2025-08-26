import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  ConfirmationResult,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, setupRecaptcha } from "../lib/firebase";

// Sign up
export const signUpService = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result;
};

// Sign in email/password
export const loginService = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign in Google
export const loginWithGoogleService = () =>
  signInWithPopup(auth, googleProvider);

// Phone login - send SMS
export const sendSMSCodeService = async (
  phoneNumber: string
): Promise<ConfirmationResult> => {
  const recaptcha = setupRecaptcha("recaptcha-container");
  return await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
};

// Phone login - confirm SMS code
export const confirmSMSCodeService = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<UserCredential> => {
  return await confirmationResult.confirm(code);
};

// Reset password
export const resetPasswordService = (email: string) =>
  sendPasswordResetEmail(auth, email, {
    url: "http://localhost:5173/reset-password",
    handleCodeInApp: true,
  });

// Logout
export const logoutService = () => signOut(auth);

// Listen to auth state
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
