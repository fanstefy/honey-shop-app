import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserCredential, ConfirmationResult } from "firebase/auth";
import {
  signUpService,
  loginService,
  loginWithGoogleService,
  sendSMSCodeService,
  confirmSMSCodeService,
  resetPasswordService,
  logoutService,
  onAuthChange,
} from "../services/firebaseService";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setError("");
      return await signUpService(email, password, displayName);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError("");
      return await loginService(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError("");
      return await loginWithGoogleService();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const sendSMSCode = async (phoneNumber: string) => {
    try {
      setError("");
      return await sendSMSCodeService(phoneNumber);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const confirmSMSCode = async (
    confirmationResult: ConfirmationResult,
    code: string
  ) => {
    try {
      setError("");
      return await confirmSMSCodeService(confirmationResult, code);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError("");
      return await resetPasswordService(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError("");
      return await logoutService();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        signUp,
        login: login,
        loginWithGoogle,
        sendSMSCode,
        confirmSMSCode,
        resetPassword,
        logout,
        setError,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
