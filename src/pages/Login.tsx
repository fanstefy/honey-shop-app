import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { trackUserLogin } from "../utils/trackUserLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signInWithGoogle, currentUser, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect ako je korisnik već ulogovan
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || "/profile";
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Očisti error kad korisnik počne da kuca
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Molimo unesite email i šifru");
      return;
    }

    setIsLoading(true);
    try {
      // Navigation će se desiti automatski preko useEffect
      await signIn(formData.email, formData.password);
      // Praćenje korisničkog login-a
      await trackUserLogin();
    } catch (error: any) {
      console.error("Login error:", error);
      // Error se već postavlja u AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Navigation će se desiti automatski preko useEffect
    } catch (error: any) {
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcija za prevod Firebase error poruka
  const getErrorMessage = (error: string) => {
    if (error.includes("user-not-found")) {
      return "Korisnik sa ovim email-om ne postoji";
    }
    if (error.includes("wrong-password")) {
      return "Neispravna šifra";
    }
    if (error.includes("invalid-email")) {
      return "Neispravna email adresa";
    }
    if (error.includes("too-many-requests")) {
      return "Previše neuspešnih pokušaja. Pokušajte kasnije.";
    }
    return "Greška pri prijavi. Pokušajte ponovo.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Prijava</h2>
            <p className="mt-2 text-gray-600">Prijavite se na vaš nalog</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 border border-red-300 rounded-lg bg-red-50">
              <p className="text-red-700 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                placeholder="vasa.email@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Šifra
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Unesite vašu šifru"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Prijavljujem...
                </div>
              ) : (
                "Prijavite se"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ili</span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <FaGoogle className="text-red-500 mr-2" />
            <span className="text-gray-700 font-medium">
              Prijavite se sa Google
            </span>
          </button>

          {/* Links */}
          <div className="mt-8 text-center space-y-4">
            <div>
              <Link
                to="/forgot-password"
                className="text-yellow-600 hover:text-yellow-500 text-sm font-medium"
              >
                Zaboravili ste šifru?
              </Link>
            </div>
            <div className="text-gray-600">
              <span>Nemate nalog? </span>
              <Link
                to="/register"
                className="text-yellow-600 hover:text-yellow-500 font-medium"
              >
                Registrujte se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
