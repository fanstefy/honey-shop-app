import { useState, useEffect } from "react";
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
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import {
  getUserProfile,
  updateCompleteProfile,
  UserProfileData,
} from "../services/userProfileService";
import { useTranslation } from "react-i18next";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    currentPassword: "",
  });

  const { t } = useTranslation();

  // Load user profile from Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
            setEditForm((prev) => ({
              ...prev,
              phone: profile.phone || "",
              address: profile.address || "",
              city: profile.city || "",
              postalCode: profile.postalCode || "",
            }));
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const profileData = {
        displayName: editForm.displayName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        postalCode: editForm.postalCode.trim(),
      };

      // Check if email changed - require password
      const emailChanged = profileData.email !== currentUser.email;
      if (emailChanged && !editForm.currentPassword) {
        setError("Za promenu email adrese potrebna je trenutna lozinka");
        setShowPasswordField(true);
        return;
      }

      await updateCompleteProfile(
        currentUser,
        profileData,
        emailChanged ? editForm.currentPassword : undefined
      );

      // Refresh user profile
      const updatedProfile = await getUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);

      setSuccess("Profil je uspešno ažuriran!");
      setIsEditing(false);
      setShowPasswordField(false);
      setEditForm((prev) => ({ ...prev, currentPassword: "" }));

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Greška pri ažuriranju profila");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setShowPasswordField(false);

    // Reset form to current values
    setEditForm({
      displayName: currentUser?.displayName || "",
      email: currentUser?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      city: userProfile?.city || "",
      postalCode: userProfile?.postalCode || "",
      currentPassword: "",
    });
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
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-green-800 text-sm">{success}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("personalInformation:personalInformation")}
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 text-sm border border-gray-300 rounded-lg sm:border-none"
            >
              {showPersonalInfo ? <FaEyeSlash /> : <FaEye />}
              <span>
                {showPersonalInfo
                  ? t("personalInformation:hide")
                  : t("personalInformation:show")}
              </span>
            </button>
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancel();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
              <span>
                {isEditing
                  ? t("personalInformation:cancel")
                  : t("personalInformation:edit")}
              </span>
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
                {t("personalInformation:fullName")}
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
                  required
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("personalInformation:email")}
                {editForm.email !== currentUser?.email && (
                  <span className="text-yellow-600 text-xs ml-1">
                    ({t("personalInformation:changeRequiresPassword")})
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => {
                    setEditForm({ ...editForm, email: e.target.value });
                    if (e.target.value !== currentUser?.email) {
                      setShowPasswordField(true);
                    } else {
                      setShowPasswordField(false);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {showPasswordField && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("personalInformation:currentPassword")}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={editForm.currentPassword}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Unesite trenutnu lozinku"
                    required={editForm.email !== currentUser?.email}
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("personalInformation:phone")}
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
                {t("personalInformation:city")}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("personalInformation:postalCode")}
              </label>
              <input
                type="text"
                value={editForm.postalCode}
                onChange={(e) =>
                  setEditForm({ ...editForm, postalCode: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="11000"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("personalInformation:address")}
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
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
              >
                {t("personalInformation:cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading && <FaSpinner className="animate-spin" />}
                <span>{loading ? "Ažuriram..." : "Sačuvaj promene"}</span>
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
                    <p className="text-sm text-gray-600">
                      {t("personalInformation:fullName")}
                    </p>
                    <p className="font-medium break-words">
                      {currentUser?.displayName ||
                        t("personalInformation:notDefined")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">
                      {t("personalInformation:email")}
                    </p>
                    <p className="font-medium break-all text-sm">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaPhone className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">
                      {t("personalInformation:phone")}
                    </p>
                    <p className="font-medium">
                      {userProfile?.phone ||
                        t("personalInformation:notDefined")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">
                      {t("personalInformation:city")}
                    </p>
                    <p className="font-medium">
                      {userProfile?.city
                        ? `${userProfile.city}${
                            userProfile.postalCode
                              ? ` (${userProfile.postalCode})`
                              : ""
                          }`
                        : t("personalInformation:notDefined")}
                    </p>
                  </div>
                </div>

                {userProfile?.address && (
                  <div className="sm:col-span-2 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600">
                        {t("personalInformation:address")}
                      </p>
                      <p className="font-medium">{userProfile.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FaShieldAlt className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">
                      {t("personalInformation:verification")}
                    </p>
                    <p className="font-medium text-sm">
                      {currentUser?.emailVerified ? (
                        <span className="text-green-600">
                          {t("personalInformation:emailVerified")}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          {t("personalInformation:emailNotVerified")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 text-center py-8">
                <FaEyeSlash className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {t("personalInformation:personalDataHidden")}
                </p>
                <button
                  onClick={() => setShowPersonalInfo(true)}
                  className="mt-3 text-yellow-600 hover:text-yellow-500 font-medium"
                >
                  {t("personalInformation:showData")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          {t("personalInformation:accountStats")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <FaShoppingBag className="mx-auto text-xl sm:text-2xl text-yellow-500 mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.totalOrders}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {t("personalInformation:totalOrders")}
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <div className="text-xl sm:text-2xl text-yellow-500 mb-2">$</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.totalSpent.toFixed(2)}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {t("personalInformation:totalSpent")}
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <FaHeart className="mx-auto text-xl sm:text-2xl text-red-500 mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.favoriteProducts}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {t("personalInformation:favoriteProducts")}
            </div>
          </div>
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
            <div className="text-xl sm:text-2xl text-yellow-500 mb-2">★</div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {userStats.rewardPoints}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {t("personalInformation:rewardPoints")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
