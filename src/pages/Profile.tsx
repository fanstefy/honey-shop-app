import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaCamera,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useShopStore } from "../store/useShopStore";
import { getUserOrders, Order } from "../services/ordersFirebaseService";
import Settings from "../components/Settings";
import Favorites from "../components/Favorites";
import Orders from "../components/Orders";
import PersonalInformation from "../components/PersonalInformation";

const Profile = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showMobileStats, setShowMobileStats] = useState(false);

  const { wishlist, products } = useShopStore();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Real statistics calculation
  const userStats = useMemo(() => {
    const totalOrders = recentOrders.length;
    const totalSpent = recentOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const favoriteProducts = wishlist.length;
    const rewardPoints = Math.floor(totalSpent * 10);

    return {
      totalOrders,
      totalSpent,
      favoriteProducts,
      rewardPoints,
    };
  }, [recentOrders, wishlist.length]);

  const wishlistItems = products?.filter((product) =>
    wishlist.includes(product.id)
  );

  useEffect(() => {
    const loadUserOrders = async () => {
      if (currentUser) {
        const orders = await getUserOrders(currentUser.uid);
        setRecentOrders(orders);
      }
    };

    loadUserOrders();
  }, [currentUser]);

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
      case "delivered":
      case "Isporučeno":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "Poslato":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
      case "Potvrđeno":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
      case "U pripremi":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
      case "Otkazano":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", shortLabel: "Prof", icon: FaUser },
    {
      id: "orders",
      label: "Porudžbine",
      shortLabel: "Ord",
      icon: FaShoppingBag,
      count: userStats.totalOrders,
    },
    {
      id: "favorites",
      label: "Omiljeno",
      shortLabel: "Fav",
      icon: FaHeart,
      count: wishlist.length,
    },
    { id: "settings", label: "Podešavanja", shortLabel: "Set", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-gray-600">
                      {getInitials(currentUser?.displayName)}
                    </span>
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition duration-200">
                  <FaCamera className="text-gray-600 text-xs sm:text-sm" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-white text-center sm:text-left flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                  {currentUser?.displayName || "Bez imena"}
                </h1>
                <p className="text-yellow-100 mt-1 text-sm sm:text-base break-all">
                  {currentUser?.email}
                </p>
                <p className="text-yellow-100 text-xs sm:text-sm mt-2">
                  <FaCalendarAlt className="inline mr-1 flex-shrink-0" />
                  Član od:{" "}
                  {formatDate(
                    currentUser?.metadata?.creationTime ||
                      new Date().toISOString()
                  )}
                </p>
              </div>

              {/* Stats Cards - Mobile Collapsible */}
              <div className="w-full sm:w-auto">
                {/* Mobile: Collapsible Stats */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setShowMobileStats(!showMobileStats)}
                    className="w-full bg-white/10 rounded-lg p-3 mb-2 flex items-center justify-between hover:bg-white/20 transition-colors"
                  >
                    <span className="font-medium">Statistike</span>
                    {showMobileStats ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {showMobileStats && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">
                          {userStats.totalOrders}
                        </div>
                        <div className="text-yellow-100 text-xs">
                          Porudžbina
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">
                          ${userStats.totalSpent.toFixed(2)}
                        </div>
                        <div className="text-yellow-100 text-xs">Ukupno</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: Always Visible Stats */}
                <div className="hidden sm:grid grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {userStats.totalOrders}
                    </div>
                    <div className="text-yellow-100 text-sm">Porudžbina</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      ${userStats.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-yellow-100 text-sm">Ukupno</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Mobile Optimized */}
          <div className="border-b border-gray-200">
            <div className="flex px-4 sm:px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-initial py-3 sm:py-4 px-2 sm:px-2 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm transition duration-200 flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 ${
                    activeTab === tab.id
                      ? "border-yellow-500 text-yellow-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="text-xs sm:text-sm flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.shortLabel}</span>
                  {tab.count && tab.count > 0 && (
                    <span className="bg-yellow-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] h-4 flex items-center justify-center leading-none">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Information */}
              <PersonalInformation userStats={userStats} />
            </div>
          )}

          {/* Orders Tab - Mobile Optimized */}
          {activeTab === "orders" && <Orders orders={recentOrders} />}

          {/* Favorites Tab - Mobile Optimized */}
          {activeTab === "favorites" && (
            <Favorites wishlistItems={wishlistItems} />
          )}

          {/* Settings Tab - Mobile Optimized */}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
