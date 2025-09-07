import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useShopStore } from "../store/useShopStore";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { clearCart, clearWishlist } = useShopStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      clearCart();
      clearWishlist();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        {t("settings:accountSettings")}
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {/* Security */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            {t("settings:security")}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{t("settings:changePassword")}</p>
                <p className="text-gray-600 text-sm">
                  {t("settings:updatePasswod")}
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition duration-200 text-sm flex-shrink-0">
                {t("settings:change")}
              </button>
            </div>
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">Dvofaktorska autentifikacija</p>
                <p className="text-gray-600 text-sm">
                  Dodatna sigurnost za vaš nalog
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-sm flex-shrink-0">
                Omogući
              </button>
            </div> */}
          </div>
        </div>

        {/* Notifications */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
            {t("settings:notifications")}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {t("settings:emailNotifications")}
                </p>
                <p className="text-gray-600 text-sm">
                  {t("settings:receiveOrderNotifications")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{t("settings:marketingMessages")}</p>
                <p className="text-gray-600 text-sm">
                  {t("settings:receiveInfoAboutNewProducts")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-lg p-4 sm:p-6 bg-red-50">
          <h3 className="text-base sm:text-lg font-bold text-red-900 mb-4">
            {t("settings:dangerZone")}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">
                  {t("settings:deleteAccount")}
                </p>
                <p className="text-red-700 text-sm">
                  {t("settings:deleteAccountPermanently")}
                </p>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm flex-shrink-0">
                {t("settings:deleteAccount")}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">
                  {t("settings:logOut")}
                </p>
                <p className="text-red-700 text-sm">
                  {t("settings:logOutOfYourAccount")}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 text-sm flex-shrink-0"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaSignOutAlt />
                )}
                <span>
                  {isLoading ? "Odjavljujem..." : t("settings:logOut")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
