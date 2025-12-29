// src/components/LanguageRedirect.tsx
import { Navigate, useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "../i18n";

const LanguageRedirect: React.FC = () => {
  const location = useLocation();

  // Ukloni jezički prefiks iz putanje
  // "/en/shop" → "/shop"
  // "/en" → "/"
  const langPattern = new RegExp(`^/(${SUPPORTED_LANGUAGES.join("|")})`);
  const redirectPath = location.pathname.replace(langPattern, "") || "/";

  return <Navigate to={redirectPath + location.search} replace />;
};

export default LanguageRedirect;
