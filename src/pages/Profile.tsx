// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   FaUser,
//   FaCamera,
//   FaShoppingBag,
//   FaHeart,
//   FaCog,
//   FaCalendarAlt,
//   FaChevronDown,
//   FaChevronUp,
//   FaCrown, // Admin icon
// } from "react-icons/fa";
// import { useShopStore } from "../store/useShopStore";
// import { getUserOrders, Order } from "../services/ordersFirebaseService";
// import { isUserAdmin, subscribeToOrders } from "../services/adminOrdersService";
// import Settings from "../components/Settings";
// import Favorites from "../components/Favorites";
// import Orders from "../components/Orders";
// import AdminOrders from "../components/AdminOrders";
// import PersonalInformation from "../components/PersonalInformation";
// import { useTranslation } from "react-i18next";

// interface TabItem {
//   id: string;
//   label: string;
//   shortLabel: string;
//   icon: React.ComponentType<any>;
//   count?: number;
//   isAdmin?: boolean;
// }

// const Profile = () => {
//   const { currentUser } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [showMobileStats, setShowMobileStats] = useState(false);

//   const { wishlist, products } = useShopStore();

//   const [recentOrders, setRecentOrders] = useState<Order[]>([]);

//   // Check if current user is admin
//   const userIsAdmin = isUserAdmin(currentUser?.email || null);

//   // Add state for pending orders count
//   const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

//   const { t } = useTranslation();

//   useEffect(() => {
//     // Load pending orders count for admin
//     if (userIsAdmin) {
//       // Use the same subscriber to get pending orders count
//       const unsubscribe = subscribeToOrders((orders) => {
//         setPendingOrdersCount(orders.length);
//       }, "pending"); // Filter only pending orders

//       return () => unsubscribe();
//     }
//   }, [userIsAdmin]);

//   // Real statistics calculation
//   const userStats = useMemo(() => {
//     const totalOrders = recentOrders.length;
//     const totalSpent = recentOrders.reduce(
//       (sum, order) => sum + order.total,
//       0
//     );
//     const favoriteProducts = wishlist.length;
//     const rewardPoints = Math.floor(totalSpent * 10);

//     return {
//       totalOrders,
//       totalSpent,
//       favoriteProducts,
//       rewardPoints,
//     };
//   }, [recentOrders, wishlist.length]);

//   const wishlistItems = products?.filter((product) =>
//     wishlist.includes(product.id)
//   );

//   useEffect(() => {
//     const loadUserOrders = async () => {
//       if (currentUser && !userIsAdmin) {
//         // Regular users load their own orders
//         const orders = await getUserOrders(currentUser.uid);
//         setRecentOrders(orders);
//       }
//     };

//     loadUserOrders();
//   }, [currentUser, userIsAdmin]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("sr-RS", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getInitials = (name: string | null | undefined) => {
//     if (!name) return "?";
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Dynamic tabs based on user role
//   const tabs = useMemo(() => {
//     const baseTabs: TabItem[] = [
//       {
//         id: "profile",
//         label: t("profile:profile"),
//         shortLabel: "Prof",
//         icon: FaUser,
//       },
//     ];

//     if (userIsAdmin) {
//       baseTabs.push({
//         id: "admin-orders",
//         label: t("profile:adminOrders"),
//         shortLabel: "Admin",
//         icon: FaCrown,
//         isAdmin: true,
//         count: pendingOrdersCount,
//       });
//     } else {
//       baseTabs.push({
//         id: "orders",
//         label: t("profile:orders"),
//         shortLabel: "Ord",
//         icon: FaShoppingBag,
//         count: userStats.totalOrders,
//       });
//     }

//     baseTabs.push(
//       {
//         id: "favorites",
//         label: t("profile:favorites"),
//         shortLabel: "Fav",
//         icon: FaHeart,
//         count: wishlist.length,
//       },
//       {
//         id: "settings",
//         label: t("profile:settings"),
//         shortLabel: "Set",
//         icon: FaCog,
//       }
//     );

//     return baseTabs;
//   }, [
//     userIsAdmin,
//     userStats.totalOrders,
//     wishlist.length,
//     pendingOrdersCount,
//     t,
//   ]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header - Mobile Optimized */}
//         <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
//           <div
//             className={`${
//               userIsAdmin
//                 ? "bg-gradient-to-r from-purple-600 to-indigo-600"
//                 : "bg-gradient-to-r from-yellow-500 to-orange-500"
//             } px-4 sm:px-8 py-8 sm:py-12`}
//           >
//             <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
//               {/* Avatar */}
//               <div className="relative flex-shrink-0">
//                 {currentUser?.photoURL ? (
//                   <img
//                     src={currentUser.photoURL}
//                     alt="Profile"
//                     className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
//                   />
//                 ) : (
//                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
//                     <span className="text-xl sm:text-2xl font-bold text-gray-600">
//                       {getInitials(currentUser?.displayName)}
//                     </span>
//                   </div>
//                 )}
//                 {/* Admin Badge */}
//                 {userIsAdmin && (
//                   <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-2 shadow-lg">
//                     <FaCrown className="text-white text-xs sm:text-sm" />
//                   </div>
//                 )}
//                 <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition duration-200">
//                   <FaCamera className="text-gray-600 text-xs sm:text-sm" />
//                 </button>
//               </div>

//               {/* User Info */}
//               <div className="text-white text-center sm:text-left flex-1 min-w-0">
//                 <div className="flex items-center justify-center sm:justify-start space-x-2">
//                   <h1 className="text-2xl sm:text-3xl font-bold break-words">
//                     {currentUser?.displayName || "Bez imena"}
//                   </h1>
//                   {userIsAdmin && (
//                     <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
//                       {t("profile:admin")}
//                     </span>
//                   )}
//                 </div>
//                 <p
//                   className={`${
//                     userIsAdmin ? "text-purple-100" : "text-yellow-100"
//                   } mt-1 text-sm sm:text-base break-all`}
//                 >
//                   {currentUser?.email}
//                 </p>
//                 <p
//                   className={`${
//                     userIsAdmin ? "text-purple-100" : "text-yellow-100"
//                   } text-xs sm:text-sm mt-2`}
//                 >
//                   <FaCalendarAlt className="inline mr-1 flex-shrink-0" />
//                   {t("profile:memberSince")}{" "}
//                   {formatDate(
//                     currentUser?.metadata?.creationTime ||
//                       new Date().toISOString()
//                   )}
//                 </p>
//               </div>

//               {/* Stats Cards - Mobile Collapsible */}
//               <div className="w-full sm:w-auto">
//                 {/* Mobile: Collapsible Stats */}
//                 <div className="sm:hidden">
//                   <button
//                     onClick={() => setShowMobileStats(!showMobileStats)}
//                     className="w-full bg-white/10 rounded-lg p-3 mb-2 flex items-center justify-between hover:bg-white/20 transition-colors"
//                   >
//                     <span className="font-medium">
//                       {userIsAdmin ? "Admin Panel" : "Statistike"}
//                     </span>
//                     {showMobileStats ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                   {showMobileStats && !userIsAdmin && (
//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="bg-white/10 rounded-lg p-3 text-center">
//                         <div className="text-lg font-bold">
//                           {userStats.totalOrders}
//                         </div>
//                         <div className="text-yellow-100 text-xs">
//                           {t("profile:order")}
//                         </div>
//                       </div>
//                       <div className="bg-white/10 rounded-lg p-3 text-center">
//                         <div className="text-lg font-bold">
//                           ${userStats.totalSpent.toFixed(2)}
//                         </div>
//                         <div className="text-yellow-100 text-xs">
//                           {t("profile:total")}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {showMobileStats && userIsAdmin && (
//                     <div className="bg-white/10 rounded-lg p-3 text-center">
//                       <FaCrown className="mx-auto mb-2 text-lg" />
//                       <div className="text-sm">
//                         {t("profile:administrator")}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Desktop: Always Visible Stats */}
//                 {!userIsAdmin && (
//                   <div className="hidden sm:grid grid-cols-2 gap-4 md:gap-6">
//                     <div className="bg-white/10 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold">
//                         {userStats.totalOrders}
//                       </div>
//                       <div className="text-yellow-100 text-sm">
//                         {t("profile:order")}
//                       </div>
//                     </div>
//                     <div className="bg-white/10 rounded-lg p-4 text-center">
//                       <div className="text-2xl font-bold">
//                         ${userStats.totalSpent.toFixed(2)}
//                       </div>
//                       <div className="text-yellow-100 text-sm">
//                         {t("profile:total")}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Admin Badge - Desktop */}
//                 {userIsAdmin && (
//                   <div className="hidden sm:block bg-white/10 rounded-lg p-4 text-center">
//                     <FaCrown className="mx-auto mb-2 text-2xl" />
//                     <div className="text-sm font-medium">
//                       {t("profile:administrator")}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Navigation Tabs - Mobile Optimized */}
//           <div className="border-b border-gray-200">
//             <div className="flex px-4 sm:px-8">
//               {tabs.map((tab: any) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex-1 sm:flex-initial py-3 sm:py-4 px-2 sm:px-2 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm transition duration-200 flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 ${
//                     activeTab === tab.id
//                       ? tab.isAdmin
//                         ? "border-purple-500 text-purple-600"
//                         : "border-yellow-500 text-yellow-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   <tab.icon
//                     className={`text-xs sm:text-sm flex-shrink-0 ${
//                       tab.isAdmin && activeTab === tab.id
//                         ? "text-purple-600"
//                         : ""
//                     }`}
//                   />
//                   <span className="hidden sm:inline">{tab.label}</span>
//                   <span className="sm:hidden text-xs">{tab.shortLabel}</span>
//                   {tab.count && tab.count > 0 && (
//                     <span
//                       className={`${
//                         tab.isAdmin ? "bg-yellow-500" : "bg-yellow-500"
//                       } text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] h-4 flex items-center justify-center leading-none`}
//                     >
//                       {tab.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tab Content - Mobile Optimized */}
//         <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
//           {/* Profile Tab */}
//           {activeTab === "profile" && (
//             <div className="space-y-6 sm:space-y-8">
//               {/* Personal Information */}
//               <PersonalInformation userStats={userStats} />
//             </div>
//           )}

//           {/* Orders Tab - For Regular Users */}
//           {activeTab === "orders" && !userIsAdmin && (
//             <Orders orders={recentOrders} />
//           )}

//           {/* Admin Orders Tab - For Admin Users */}
//           {activeTab === "admin-orders" && userIsAdmin && <AdminOrders />}

//           {/* Favorites Tab - Mobile Optimized */}
//           {activeTab === "favorites" && (
//             <Favorites wishlistItems={wishlistItems} />
//           )}

//           {/* Settings Tab - Mobile Optimized */}
//           {activeTab === "settings" && <Settings />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

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
  FaCrown,
  FaSpinner, // Loading icon
} from "react-icons/fa";
import { useShopStore } from "../store/useShopStore";
import { getUserOrders, Order } from "../services/ordersFirebaseService";
import { isUserAdmin, subscribeToOrders } from "../services/adminOrdersService";
import Settings from "../components/Settings";
import Favorites from "../components/Favorites";
import Orders from "../components/Orders";
import AdminOrders from "../components/AdminOrders";
import PersonalInformation from "../components/PersonalInformation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  count?: number;
  isAdmin?: boolean;
}

const Profile = () => {
  const { currentUser, loading } = useAuth(); // Dodajte loading state
  const navigate = useNavigate(); // Za redirekciju
  const [activeTab, setActiveTab] = useState("profile");
  const [showMobileStats, setShowMobileStats] = useState(false);

  const { wishlist, products } = useShopStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const { t } = useTranslation();

  // Check if current user is admin
  const userIsAdmin = isUserAdmin(currentUser?.email || null);

  useEffect(() => {
    // Load pending orders count for admin
    if (userIsAdmin) {
      const unsubscribe = subscribeToOrders((orders) => {
        setPendingOrdersCount(orders.length);
      }, "pending");

      return () => unsubscribe();
    }
  }, [userIsAdmin]);

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
      if (currentUser && !userIsAdmin) {
        try {
          const orders = await getUserOrders(currentUser.uid);
          setRecentOrders(orders);
        } catch (error) {
          console.error("Error loading user orders:", error);
        }
      }
    };

    loadUserOrders();
  }, [currentUser, userIsAdmin]);

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

  // Dynamic tabs based on user role
  const tabs = useMemo(() => {
    const baseTabs: TabItem[] = [
      {
        id: "profile",
        label: t("profile:profile"),
        shortLabel: "Prof",
        icon: FaUser,
      },
    ];

    if (userIsAdmin) {
      baseTabs.push({
        id: "admin-orders",
        label: t("profile:adminOrders"),
        shortLabel: "Admin",
        icon: FaCrown,
        isAdmin: true,
        count: pendingOrdersCount,
      });
    } else {
      baseTabs.push({
        id: "orders",
        label: t("profile:orders"),
        shortLabel: "Ord",
        icon: FaShoppingBag,
        count: userStats.totalOrders,
      });
    }

    baseTabs.push(
      {
        id: "favorites",
        label: t("profile:favorites"),
        shortLabel: "Fav",
        icon: FaHeart,
        count: wishlist.length,
      },
      {
        id: "settings",
        label: t("profile:settings"),
        shortLabel: "Set",
        icon: FaCog,
      }
    );

    return baseTabs;
  }, [
    userIsAdmin,
    userStats.totalOrders,
    wishlist.length,
    pendingOrdersCount,
    t,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8">
          <div
            className={`${
              userIsAdmin
                ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                : "bg-gradient-to-r from-yellow-500 to-orange-500"
            } px-4 sm:px-8 py-8 sm:py-12`}
          >
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
                {/* Admin Badge */}
                {userIsAdmin && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-2 shadow-lg">
                    <FaCrown className="text-white text-xs sm:text-sm" />
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition duration-200">
                  <FaCamera className="text-gray-600 text-xs sm:text-sm" />
                </button>
              </div>

              {/* User Info */}
              <div className="text-white text-center sm:text-left flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold break-words">
                    {currentUser?.displayName || "Bez imena"}
                  </h1>
                  {userIsAdmin && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {t("profile:admin")}
                    </span>
                  )}
                </div>
                <p
                  className={`${
                    userIsAdmin ? "text-purple-100" : "text-yellow-100"
                  } mt-1 text-sm sm:text-base break-all`}
                >
                  {currentUser?.email}
                </p>
                <p
                  className={`${
                    userIsAdmin ? "text-purple-100" : "text-yellow-100"
                  } text-xs sm:text-sm mt-2`}
                >
                  <FaCalendarAlt className="inline mr-1 flex-shrink-0" />
                  {t("profile:memberSince")}{" "}
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
                    <span className="font-medium">
                      {userIsAdmin ? "Admin Panel" : "Statistike"}
                    </span>
                    {showMobileStats ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {showMobileStats && !userIsAdmin && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">
                          {userStats.totalOrders}
                        </div>
                        <div className="text-yellow-100 text-xs">
                          {t("profile:order")}
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">
                          ${userStats.totalSpent.toFixed(2)}
                        </div>
                        <div className="text-yellow-100 text-xs">
                          {t("profile:total")}
                        </div>
                      </div>
                    </div>
                  )}
                  {showMobileStats && userIsAdmin && (
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <FaCrown className="mx-auto mb-2 text-lg" />
                      <div className="text-sm">
                        {t("profile:administrator")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: Always Visible Stats */}
                {!userIsAdmin && (
                  <div className="hidden sm:grid grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">
                        {userStats.totalOrders}
                      </div>
                      <div className="text-yellow-100 text-sm">
                        {t("profile:order")}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">
                        ${userStats.totalSpent.toFixed(2)}
                      </div>
                      <div className="text-yellow-100 text-sm">
                        {t("profile:total")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Badge - Desktop */}
                {userIsAdmin && (
                  <div className="hidden sm:block bg-white/10 rounded-lg p-4 text-center">
                    <FaCrown className="mx-auto mb-2 text-2xl" />
                    <div className="text-sm font-medium">
                      {t("profile:administrator")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Mobile Optimized */}
          <div className="border-b border-gray-200">
            <div className="flex px-4 sm:px-8">
              {tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-initial py-3 sm:py-4 px-2 sm:px-2 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm transition duration-200 flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 ${
                    activeTab === tab.id
                      ? tab.isAdmin
                        ? "border-purple-500 text-purple-600"
                        : "border-yellow-500 text-yellow-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon
                    className={`text-xs sm:text-sm flex-shrink-0 ${
                      tab.isAdmin && activeTab === tab.id
                        ? "text-purple-600"
                        : ""
                    }`}
                  />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.shortLabel}</span>
                  {tab.count && tab.count > 0 && (
                    <span
                      className={`${
                        tab.isAdmin ? "bg-yellow-500" : "bg-yellow-500"
                      } text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] h-4 flex items-center justify-center leading-none`}
                    >
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

          {/* Orders Tab - For Regular Users */}
          {activeTab === "orders" && !userIsAdmin && (
            <Orders orders={recentOrders} />
          )}

          {/* Admin Orders Tab - For Admin Users */}
          {activeTab === "admin-orders" && userIsAdmin && <AdminOrders />}

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
