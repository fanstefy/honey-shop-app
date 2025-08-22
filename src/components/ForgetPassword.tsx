import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword: React.FC = () => {
  const { resetPassword, error } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("✅ Proveri svoj email za link za resetovanje lozinke.");
    } catch (err) {
      setMessage("❌ Nešto nije u redu. Pokušaj ponovo.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Zaboravljena lozinka
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Unesi email adresu i poslaćemo ti link za resetovanje lozinke.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Pošalji link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-600 hover:underline">
            Vrati se na prijavu
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
