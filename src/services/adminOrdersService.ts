import {
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  where,
  limit,
  doc,
  updateDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Order } from "./ordersFirebaseService";

// Admin emails - dodaj ovde sve admin email adrese
const ADMIN_EMAILS = [
  // Dodaj svoj email ovde (onaj sa kojim se uloguješ):
  "predolac_stefan@yahoo.com",
  // "your-email@example.com",
];

// Check if user is admin
export const isUserAdmin = (userEmail: string | null): boolean => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

// Get all orders for admin
export const getAllOrdersForAdmin = async (
  limitCount: number = 50
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error getting all orders for admin:", error);
    return [];
  }
};

// Get orders by status
export const getOrdersByStatus = async (
  status: Order["status"],
  limitCount: number = 20
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Error getting orders by status:", error);
    return [];
  }
};

// Real-time listener for orders
export const subscribeToOrders = (
  callback: (orders: Order[]) => void,
  statusFilter?: Order["status"]
): Unsubscribe => {
  let q;

  if (statusFilter) {
    q = query(
      collection(db, "orders"),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  } else {
    q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });
    callback(orders);
  });
};

// Admin update order status (bez email funkcionalnosti)
export const adminUpdateOrderStatus = async (
  orderId: string,
  newStatus: Order["status"],
  adminEmail: string
): Promise<void> => {
  try {
    // Find the document by orderId
    const q = query(collection(db, "orders"), where("orderId", "==", orderId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const orderDoc = querySnapshot.docs[0];

      const docRef = doc(db, "orders", orderDoc.id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: adminEmail,
      });

      console.log("Admin updated order status:", orderId, newStatus);
    } else {
      throw new Error(`Order not found: ${orderId}`);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Get order statistics for admin dashboard
export const getOrderStatistics = async () => {
  try {
    const [pendingOrders, confirmedOrders, shippedOrders, deliveredOrders] =
      await Promise.all([
        getOrdersByStatus("pending"),
        getOrdersByStatus("confirmed"),
        getOrdersByStatus("shipped"),
        getOrdersByStatus("delivered"),
      ]);

    const allRecentOrders = await getAllOrdersForAdmin(100);

    const totalRevenue = allRecentOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const averageOrderValue =
      allRecentOrders.length > 0 ? totalRevenue / allRecentOrders.length : 0;

    return {
      pending: pendingOrders.length,
      confirmed: confirmedOrders.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
      totalOrders: allRecentOrders.length,
      totalRevenue,
      averageOrderValue,
    };
  } catch (error) {
    console.error("Error getting order statistics:", error);
    return {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    };
  }
};
