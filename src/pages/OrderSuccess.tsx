import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getOrderByOrderId, Order } from "../services/ordersFirebaseService";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaEnvelope,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        console.error("No orderId provided in URL");
        navigate("/");
        return;
      }

      console.log("Looking for order with ID:", orderId);

      try {
        const orderData = await getOrderByOrderId(orderId);
        console.log("Order data received:", orderData);
        setOrder(orderData);

        if (!orderData) {
          console.error("Order not found in Firebase:", orderId);
        }
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Učitavam podatke o porudžbini...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Porudžbina nije pronađena
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Porudžbina potvrđena - {order.orderId} | Nektarika</title>
        <meta
          name="description"
          content={`Vaša porudžbina ${order.orderId} je uspešno kreirana`}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
            <div className="mb-4">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2"></h1>
            <p className="text-gray-600 mb-4">
              {t("orderSuccess:thankYouMessage")}
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {t(
                      "orderSuccess:pleaseSaveThisNumberForLaterOrderTracking"
                    )}{" "}
                    <strong>{order.orderId}</strong>
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {t("orderSuccess:")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t("orderSuccess:orderDetails")} {order.orderId}
            </h2>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        {t("orderSuccess:quantity")}:{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("orderSuccess:subtotal")}:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("orderSuccess:deliveryPrice")}:</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{t("orderSuccess:total")}:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {t("orderSuccess:shippingAddress")}
              </h3>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>{order.shippingAddress.fullName}</strong>
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}</p>
                <p>{order.shippingAddress.phone}</p>
                {order.shippingAddress.notes && (
                  <p className="mt-2">
                    <strong>{t("orderSuccess:additionalNotes")}:</strong>{" "}
                    {order.shippingAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                {t("orderSuccess:paymentMethod")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("orderSuccess:cacheOnDelivery")}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t("orderSuccess:whatIsNext")}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                  1
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {t("orderSuccess:orderConfirmation")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("orderSuccess:weAreProcessingYourOrder")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                  2
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {t("orderSuccess:packaging")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("orderSuccess:yourOrderIsBeingCarefullyPackaged")}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                  3
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {t("orderSuccess:delivery")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("orderSuccess:onceShippedYouWillReceiveATrackingNumber")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          {order.userEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">
                    {t("orderSuccess:emailConfirmationSent")}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {t("orderSuccess:orderDetailsHaveBeenSentTo")}{" "}
                    {order.userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/shop")}
              className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center justify-center"
            >
              <FaShoppingBag className="mr-2" />
              {t("orderSuccess:continueShopping")}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center"
            >
              <FaHome className="mr-2" />
              {t("orderSuccess:backToHome")}
            </button>

            {order.userId && (
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                {t("orderSuccess:viewMyOrders")}
              </button>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {t("orderSuccess:needHelpContactUs")}{" "}
              <a
                href="mailto:info@nektarika.com"
                className="text-yellow-600 hover:underline"
              >
                info@nektarika.com
              </a>{" "}
              {t("orderSuccess:or")}{" "}
              <a
                href="tel:+381601234567"
                className="text-yellow-600 hover:underline"
              >
                +381 60 123 4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
