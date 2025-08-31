import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { Order } from "../services/ordersFirebaseService";
import { formatFirebaseDate, translateStatus } from "../utils/utilities";

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const navigate = useNavigate();

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

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Moje porudžbine
        </h2>
        <div className="text-center py-12">
          <FaShoppingBag className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            Nemate porudžbine
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
            Kada napravite prvu porudžbinu, pojaviće se ovde
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Idite u prodavnicu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Moje porudžbine
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition duration-200"
          >
            <div className="flex flex-col space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <h3 className="font-bold text-base sm:text-lg">
                    #{order.orderId}
                  </h3>
                  <span
                    className={`self-start px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Dostava: ${order.shippingCost.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Datum:</strong>{" "}
                  {order.createdAt
                    ? formatFirebaseDate(order.createdAt)
                    : "N/A"}
                </p>
                <p>
                  <strong>Stavke:</strong> {order.items.length} proizvod(a)
                </p>
                <p className="break-words">
                  <strong>Dostava:</strong> {order.shippingAddress.fullName}
                </p>
                <p className="break-words">
                  <strong>Adresa:</strong> {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}
                </p>
              </div>

              {/* Order Items Preview */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Proizvodi:
                </h4>
                <div className="space-y-1">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between text-xs sm:text-sm gap-2"
                    >
                      <span className="truncate flex-1 min-w-0">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="flex-shrink-0 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/order-success/${order.orderId}`)}
                className="w-full sm:w-auto sm:self-end px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition duration-200 text-sm"
              >
                Pogledaj detalje
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
