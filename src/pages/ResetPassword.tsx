import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => setValid(true))
        .catch(() => setMessage("❌ Link nije validan ili je istekao."));
    }
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage(
        "✅ Lozinka uspešno promenjena. Možeš da se prijaviš sa novom lozinkom."
      );
    } catch (err) {
      setMessage("❌ Greška pri resetovanju lozinke.");
    }
  };

  if (!valid) {
    return <div className="p-6 text-center">{message}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Nova lozinka</h2>
        <input
          type="password"
          placeholder="Unesi novu lozinku"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-xl mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Resetuj lozinku
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
