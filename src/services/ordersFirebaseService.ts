import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  city: string;
  address: string;
  phone: string;
  notes?: string;
}

export interface Order {
  id?: string;
  orderId: string; // Custom format like ORD-001
  userId?: string; // Optional for guest orders
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: "cash_on_delivery";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any;
}

// Generate unique order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}${random}`;
};

// Create new order
export const createOrder = async (
  orderData: Omit<
    Order,
    "id" | "orderId" | "createdAt" | "updatedAt" | "status"
  >
): Promise<string> => {
  try {
    const orderId = generateOrderId();

    // Filter out undefined values for Firestore
    const cleanOrderData = Object.fromEntries(
      Object.entries(orderData).filter(([_, value]) => value !== undefined)
    );

    const order: Order = {
      ...cleanOrderData,
      orderId,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as Order;

    const docRef = await addDoc(collection(db, "orders"), order);
    console.log("Order created successfully:", {
      firestoreId: docRef.id,
      orderId: orderId,
      orderData: order,
    });

    return orderId; // Return custom order ID for user
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error}`);
  }
};

// Get order by custom orderId
export const getOrderByOrderId = async (
  orderId: string
): Promise<Order | null> => {
  try {
    const q = query(collection(db, "orders"), where("orderId", "==", orderId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Order;
    }

    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    return null;
  }
};

// Get all orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
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
    console.error("Error getting user orders:", error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  try {
    // First find the document by orderId
    const q = query(collection(db, "orders"), where("orderId", "==", orderId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, "orders", querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      console.log("Order status updated:", orderId, status);
    } else {
      throw new Error(`Order not found: ${orderId}`);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Send email confirmation (placeholder)
export const sendOrderConfirmationEmail = async (
  order: Order
): Promise<void> => {
  try {
    // TODO: Implement email service integration
    // For now, just log the email data
    console.log("Sending order confirmation email:", {
      to: order.userEmail,
      orderId: order.orderId,
      total: order.total,
      items: order.items,
    });

    // You can integrate with:
    // - EmailJS for client-side emails
    // - Firebase Functions + SendGrid/Mailgun
    // - Netlify Functions + email service
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    // Don't throw - email failure shouldn't break order creation
  }
};
