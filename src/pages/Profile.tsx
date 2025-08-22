// pages/Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  // Mock data - u stvarnoj aplikaciji bi ovo došlo iz baze podataka
  const [userStats] = useState({
    totalOrders: 12,
    totalSpent: 245.5,
    favoriteProducts: 8,
    rewardPoints: 1250,
  });

  const [recentOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-12-15",
      total: 45.0,
      status: "Isporučeno",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-12-08",
      total: 32.5,
      status: "U pripremi",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2024-11-28",
      total: 67.25,
      status: "Isporučeno",
      items: 5,
    },
  ]);

  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ovde bi trebalo implementirati ažuriranje korisničkih podataka
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Isporučeno":
        return "bg-green-100 text-green-800";
      case "U pripremi":
        return "bg-yellow-100 text-yellow-800";
      case "Otkazano":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: FaUser },
    { id: "orders", label: "Porudžbine", icon: FaShoppingBag },
    { id: "favorites", label: "Omiljeno", icon: FaHeart },
    { id: "settings", label: "Podešavanja", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {getInitials(currentUser?.displayName)}
                    </span>
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition duration-200">
                  <FaCamera className="text-gray-600 text-sm" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-white text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">
                  {currentUser?.displayName || "Bez imena"}
                </h1>
                <p className="text-yellow-100 mt-1">{currentUser?.email}</p>
                <p className="text-yellow-100 text-sm mt-2">
                  <FaCalendarAlt className="inline mr-1" />
                  Član od:{" "}
                  {formatDate(
                    currentUser?.metadata?.creationTime ||
                      new Date().toISOString()
                  )}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {userStats.totalOrders}
                  </div>
                  <div className="text-yellow-100 text-sm">Porudžbina</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    ${userStats.totalSpent}
                  </div>
                  <div className="text-yellow-100 text-sm">Ukupno</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-yellow-500 text-yellow-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Lični podaci
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
                    >
                      {showPersonalInfo ? <FaEyeSlash /> : <FaEye />}
                      <span>{showPersonalInfo ? "Sakrij" : "Prikaži"}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      <FaEdit />
                      <span>{isEditing ? "Odustani" : "Uredi"}</span>
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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

                    <div className="md:col-span-2">
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

                    <div className="md:col-span-2 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                      >
                        Odustani
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                      >
                        Sačuvaj promene
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {showPersonalInfo ? (
                      <>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <FaUser className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Ime i prezime
                            </p>
                            <p className="font-medium">
                              {currentUser?.displayName || "Nije definisano"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <FaEnvelope className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{currentUser?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <FaPhone className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Telefon</p>
                            <p className="font-medium">
                              {currentUser?.phoneNumber || "Nije definisano"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <FaShieldAlt className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Verifikacija
                            </p>
                            <p className="font-medium">
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
                      <div className="md:col-span-2 text-center py-8">
                        <FaEyeSlash className="mx-auto text-4xl text-gray-400 mb-4" />
                        <p className="text-gray-600">
                          Lični podaci su sakriveni
                        </p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Statistike naloga
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <FaShoppingBag className="mx-auto text-2xl text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {userStats.totalOrders}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Ukupno porudžbina
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <div className="text-2xl text-yellow-500 mb-2">$</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userStats.totalSpent}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Ukupno potrošeno
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <FaHeart className="mx-auto text-2xl text-red-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {userStats.favoriteProducts}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Omiljeni proizvodi
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <div className="text-2xl text-yellow-500 mb-2">★</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userStats.rewardPoints}
                    </div>
                    <div className="text-gray-600 text-sm">Nagradni poeni</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Moje porudžbine
              </h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">#{order.id}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <p>Datum: {formatDate(order.date)}</p>
                          <p>Stavke: {order.items}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${order.total}
                        </div>
                        <button className="mt-2 px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition duration-200">
                          Pogledaj detalje
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Omiljeni proizvodi
              </h2>
              <div className="text-center py-12">
                <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Još uvek nemate omiljene proizvode
                </h3>
                <p className="text-gray-600 mb-6">
                  Počnite da dodajete proizvode u omiljene dok pretražujete naš
                  katalog
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                >
                  Idite u prodavnicu
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Podešavanja naloga
              </h2>
              <div className="space-y-6">
                {/* Security */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Bezbednost
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promeni šifru</p>
                        <p className="text-gray-600 text-sm">
                          Ažurirajte vašu šifru
                        </p>
                      </div>
                      <button className="px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition duration-200">
                        Promeni
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Dvofaktorska autentifikacija
                        </p>
                        <p className="text-gray-600 text-sm">
                          Dodatna sigurnost za vaš nalog
                        </p>
                      </div>
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                        Omogući
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Obaveštenja
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email obaveštenja</p>
                        <p className="text-gray-600 text-sm">
                          Primajte obaveštenja o porudžbinama
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing poruke</p>
                        <p className="text-gray-600 text-sm">
                          Primajte informacije o novim proizvodima
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-lg font-bold text-red-900 mb-4">
                    Zona opasnosti
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">Obriši nalog</p>
                        <p className="text-red-700 text-sm">
                          Trajno obrišite vaš nalog i sve podatke
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                        Obriši nalog
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">Odjavi se</p>
                        <p className="text-red-700 text-sm">
                          Odjavite se sa vašeg naloga
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <FaSignOutAlt />
                        )}
                        <span>
                          {isLoading ? "Odjavljujem..." : "Odjavi se"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
