import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaShoppingBag,
  FaEye,
  FaCheck,
  FaTruck,
  FaBox,
  FaClock,
  FaFilter,
  FaBell,
  //   FaRefresh,
} from "react-icons/fa";
import {
  getAllOrdersForAdmin,
  subscribeToOrders,
  adminUpdateOrderStatus,
  getOrderStatistics,
  isUserAdmin,
  getOrdersByStatus,
} from "../services/adminOrdersService";
import { Order } from "../services/ordersFirebaseService";
import { formatFirebaseDate, translateStatus } from "../utils/utilities";

const AdminOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const [statistics, setStatistics] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null | undefined>(
    null
  );
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Check if user is admin
  const userIsAdmin = isUserAdmin(currentUser?.email || null);

  useEffect(() => {
    if (!userIsAdmin) return;

    // Load initial data
    loadInitialData();

    // Set up real-time listener
    const unsubscribe = subscribeToOrders(
      (newOrders) => {
        setOrders(newOrders);
        setLoading(false);
      },
      statusFilter === "all" ? undefined : statusFilter
    );

    // Load statistics
    loadStatistics();

    return () => unsubscribe();
  }, [statusFilter, userIsAdmin]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      let data;
      if (statusFilter === "all") {
        data = await getAllOrdersForAdmin(100);
      } else {
        data = await getOrdersByStatus(statusFilter, 100);
      }
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getOrderStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    if (!currentUser?.email) return;

    setUpdatingStatus(orderId);
    try {
      await adminUpdateOrderStatus(orderId, newStatus, currentUser.email);

      // Update local state immediately for better UX
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Refresh statistics
      loadStatistics();

      console.log(`Status updated to ${newStatus} for order ${orderId}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Greška pri ažuriranju statusa porudžbine");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatusActions = (currentStatus: Order["status"]) => {
    switch (currentStatus) {
      case "pending":
        return [
          {
            status: "confirmed" as const,
            label: "Potvrdi",
            icon: FaCheck,
            color: "bg-green-500",
          },
        ];
      case "confirmed":
        return [
          {
            status: "shipped" as const,
            label: "Pošalji",
            icon: FaTruck,
            color: "bg-blue-500",
          },
        ];
      case "shipped":
        return [
          {
            status: "delivered" as const,
            label: "Isporučeno",
            icon: FaBox,
            color: "bg-green-600",
          },
        ];
      default:
        return [];
    }
  };

  if (!userIsAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Nemate dozvolu za pristup admin panelu.</p>
        <p className="text-gray-600 text-sm mt-2">
          Kontaktirajte administratora da vam dodeli admin privilegije.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        <span className="ml-2">Učitavam porudžbine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Admin Panel - Porudžbine
          </h2>
          <p className="text-gray-600 text-sm">
            Upravljajte porudžbinama korisnika ({orders.length} ukupno)
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadInitialData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center space-x-2"
          >
            {/* <FaRefresh className="text-sm" /> */}
            <span>Osveži</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaClock className="text-orange-600" />
              <div>
                <p className="text-xs text-orange-600 uppercase">Pending</p>
                <p className="text-lg font-bold text-orange-800">
                  {statistics.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaCheck className="text-yellow-600" />
              <div>
                <p className="text-xs text-yellow-600 uppercase">Potvrđeno</p>
                <p className="text-lg font-bold text-yellow-800">
                  {statistics.confirmed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaTruck className="text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 uppercase">Poslato</p>
                <p className="text-lg font-bold text-blue-800">
                  {statistics.shipped}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaBox className="text-green-600" />
              <div>
                <p className="text-xs text-green-600 uppercase">Ukupno</p>
                <p className="text-lg font-bold text-green-800">
                  {statistics.totalOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Stats */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-700 uppercase">
              Ukupna zarada
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              ${statistics.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-indigo-700 uppercase">
              Prosečna vrednost
            </h3>
            <p className="text-2xl font-bold text-indigo-900">
              ${statistics.averageOrderValue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg transition duration-200 ${
            statusFilter === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaFilter className="inline mr-2" />
          Sve ({orders.length})
        </button>
        {["pending", "confirmed", "shipped", "delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as Order["status"])}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 "
            }`}
          >
            {translateStatus(status)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema porudžbina
          </h3>
          <p className="text-gray-600">
            {statusFilter === "all"
              ? "Trenutno nema porudžbina u sistemu"
              : `Nema porudžbina sa statusom "${translateStatus(
                  statusFilter
                )}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
            >
              {/* Order Header */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <h3 className="font-bold text-lg">#{order.orderId}</h3>
                    <span
                      className={`self-start px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                    {order.status === "pending" && (
                      <span className="flex items-center text-orange-600 text-xs">
                        <FaBell className="mr-1" />
                        Nova porudžbina!
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.createdAt && formatFirebaseDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>
                      <strong>Kupac:</strong> {order.shippingAddress.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.userEmail || "Gost"}
                    </p>
                    <p>
                      <strong>Telefon:</strong> {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Adresa:</strong> {order.shippingAddress.address}
                    </p>
                    <p>
                      <strong>Grad:</strong> {order.shippingAddress.city}
                    </p>
                    <p>
                      <strong>Proizvodi:</strong> {order.items.length} stavke
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )
                    }
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition duration-200 flex items-center space-x-1"
                  >
                    <FaEye className="text-sm" />
                    <span className="text-sm">
                      {expandedOrder === order.id ? "Sakrij" : "Detalji"}
                    </span>
                  </button>

                  {/* Status Action Buttons */}
                  {getNextStatusActions(order.status).map((action) => (
                    <button
                      key={action.status}
                      onClick={() =>
                        handleStatusUpdate(order.orderId, action.status)
                      }
                      disabled={updatingStatus === order.orderId}
                      className={`px-3 py-2 text-gray-700 bg-gray-100 rounded hover:opacity-90 hover:bg-gray-200 transition duration-200 flex items-center space-x-1 ${
                        action.color
                      } ${
                        updatingStatus === order.orderId
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <action.icon className="text-sm" />
                      <span className="text-sm">
                        {updatingStatus === order.orderId
                          ? "..."
                          : action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Detalji porudžbine:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-300">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dostava:</span>
                        <span>${order.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Ukupno:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.shippingAddress.notes && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Napomena:</strong>{" "}
                          {order.shippingAddress.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
