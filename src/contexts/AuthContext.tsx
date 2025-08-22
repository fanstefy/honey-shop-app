import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider, setupRecaptcha } from "../lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  sendSMSCode: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmSMSCode: (
    confirmationResult: ConfirmationResult,
    code: string
  ) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  setError: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Registracija sa email/password
  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    try {
      setError("");
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Dodaj display name ako je prosledjen
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }

      return result;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Prijava sa email/password
  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      setError("");
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Google prijava
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      setError("");
      return await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Phone prijava - korak 1: pošalji SMS
  const sendSMSCode = async (
    phoneNumber: string
  ): Promise<ConfirmationResult> => {
    try {
      setError("");
      const recaptcha = setupRecaptcha("recaptcha-container");
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptcha
      );
      return confirmationResult;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Phone prijava - korak 2: potvrdi kod
  const confirmSMSCode = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<UserCredential> => {
    try {
      setError("");
      return await confirmationResult.confirm(code);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  // const resetPassword = async (email: string): Promise<void> => {
  //   try {
  //     setError("");
  //     return await sendPasswordResetEmail(auth, email);
  //   } catch (error: any) {
  //     setError(error.message);
  //     throw error;
  //   }
  // };
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError("");
      return await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:5173/reset-password", // ovde tvoj domen
        handleCodeInApp: true,
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Odjava
  const logout = async (): Promise<void> => {
    try {
      setError("");
      return await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Praćenje auth state-a
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    sendSMSCode,
    confirmSMSCode,
    resetPassword,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
