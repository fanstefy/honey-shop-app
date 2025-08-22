// pages/Register.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const { signUp, signInWithGoogle, currentUser, error, setError } = useAuth();
  const navigate = useNavigate();

  // Redirect ako je korisnik već ulogovan
  useEffect(() => {
    if (currentUser) {
      navigate("/profile", { replace: true });
    }
  }, [currentUser, navigate]);

  // Proveri jačinu šifre
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";

    if (password.length < 6) {
      feedback = "Šifra mora imati minimum 6 karaktera";
    } else if (password.length < 8) {
      score = 1;
      feedback = "Slaba šifra";
    } else {
      score = 2;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score === 2) feedback = "Umerena šifra";
      else if (score === 3) feedback = "Dobra šifra";
      else if (score >= 4) feedback = "Jaka šifra";
    }

    setPasswordStrength({ score, feedback });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Proveri jačinu šifre
    if (name === "password") {
      checkPasswordStrength(value);
    }

    // Očisti error kad korisnik počne da kuca
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setError("Molimo unesite ime");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Molimo unesite email");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Šifra mora imati minimum 6 karaktera");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Šifre se ne poklapaju");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.displayName);
      // Navigation će se desiti automatski preko useEffect
    } catch (error: any) {
      console.error("Registration error:", error);
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
    if (error.includes("email-already-in-use")) {
      return "Email adresa je već u upotrebi";
    }
    if (error.includes("invalid-email")) {
      return "Neispravna email adresa";
    }
    if (error.includes("weak-password")) {
      return "Šifra je preslab";
    }
    if (error.includes("operation-not-allowed")) {
      return "Registracija nije omogućena";
    }
    return "Greška pri registraciji. Pokušajte ponovo.";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return "text-red-500";
    if (passwordStrength.score <= 2) return "text-yellow-500";
    if (passwordStrength.score <= 3) return "text-blue-500";
    return "text-green-500";
  };

  const getPasswordStrengthBg = () => {
    if (passwordStrength.score <= 1) return "bg-red-200";
    if (passwordStrength.score <= 2) return "bg-yellow-200";
    if (passwordStrength.score <= 3) return "bg-blue-200";
    return "bg-green-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Registracija</h2>
            <p className="mt-2 text-gray-600">Kreirajte vaš nalog</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 border border-red-300 rounded-lg bg-red-50">
              <p className="text-red-700 text-sm">{getErrorMessage(error)}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ime i prezime
              </label>
              <div className="relative">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Marko Marković"
                  disabled={isLoading}
                />
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email adresa
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="vasa.email@example.com"
                  disabled={isLoading}
                />
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Unesite šifru"
                  disabled={isLoading}
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBg()}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-medium ${getPasswordStrengthColor()}`}
                    >
                      {passwordStrength.feedback}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Potvrdite šifru
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Ponovite šifru"
                  disabled={isLoading}
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <p className="text-green-600 text-xs">
                      ✓ Šifre se poklapaju
                    </p>
                  ) : (
                    <p className="text-red-600 text-xs">
                      ✗ Šifre se ne poklapaju
                    </p>
                  )}
                </div>
              )}
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
                  Registrujem...
                </div>
              ) : (
                "Registrujte se"
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
              Registrujte se sa Google
            </span>
          </button>

          {/* Link to Login */}
          <div className="mt-8 text-center">
            <span className="text-gray-600">Već imate nalog? </span>
            <Link
              to="/login"
              className="text-yellow-600 hover:text-yellow-500 font-medium"
            >
              Prijavite se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
