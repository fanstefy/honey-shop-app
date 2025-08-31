import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";

interface PersonalInformationProps {
  userStats: {
    totalOrders: number;
    totalSpent: number;
    favoriteProducts: number;
    rewardPoints: number;
  };
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  userStats,
}) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating profile:", editForm);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Personal Information */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Lični podaci
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 text-sm border border-gray-300 rounded-lg sm:border-none"
            >
              {showPersonalInfo ? <FaEyeSlash /> : <FaEye />}
              <span>{showPersonalInfo ? "Sakrij" : "Prikaži"}</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 text-sm"
            >
              <FaEdit />
              <span>{isEditing ? "Odustani" : "Uredi"}</span>
            </button>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime i prezime
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      displayName: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent opacity-50"
                  disabled
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="+381 60 123 4567"
                />
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grad
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Beograd"
                />
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Knez Mihailova 42"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
              >
                Sačuvaj promene
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {showPersonalInfo ? (
              <>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Ime i prezime</p>
                    <p className="font-medium break-words">
                      {currentUser?.displayName || "Nije definisano"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium break-all text-sm">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium">
                      {currentUser?.phoneNumber || "Nije definisano"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaShieldAlt className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Verifikacija</p>
                    <p className="font-medium text-sm">
                      {currentUser?.emailVerified ? (
                        <span className="text-green-600">
                          Email verifikovan
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Email nije verifikovan
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 text-center py-8">
                <FaEyeSlash className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">Lični podaci su sakriveni</p>
                <button
                  onClick={() => setShowPersonalInfo(true)}
                  className="mt-3 text-yellow-600 hover:text-yellow-500 font-medium"
                >
                  Prikaži podatke
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Statistike naloga
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <FaShoppingBag className="mx-auto text-xl sm:text-2xl text-yellow-500 mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.totalOrders}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Ukupno porudžbina
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <div className="text-xl sm:text-2xl text-yellow-500 mb-2">$</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.totalSpent.toFixed(2)}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Ukupno potrošeno
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <FaHeart className="mx-auto text-xl sm:text-2xl text-red-500 mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.favoriteProducts}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Omiljeni proizvodi
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <div className="text-xl sm:text-2xl text-yellow-500 mb-2">★</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.rewardPoints}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Nagradni poeni
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
