import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Review {
  id?: string;
  productId: number;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: any;
  verified?: boolean;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

// Dodaj review
export const addReview = async (
  productId: number,
  userId: string,
  userName: string,
  userEmail: string,
  reviewData: ReviewFormData,
): Promise<string> => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      productId,
      userId,
      userName,
      userEmail,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: serverTimestamp(),
      verified: false, // TODO: Implementirati logiku za verified purchase
    });

    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Učitaj reviews za proizvod
export const getReviewsForProduct = async (
  productId: number,
  limitCount: number = 10,
  lastDoc?: DocumentSnapshot,
): Promise<{ reviews: Review[]; lastDocument: DocumentSnapshot | null }> => {
  try {
    let q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    const reviews: Review[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];

    const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;

    return { reviews, lastDocument };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Proveri da li je korisnik već ostavio review za proizvod
export const hasUserReviewedProduct = async (
  productId: number,
  userId: string,
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      where("userId", "==", userId),
      limit(1),
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking user review:", error);
    return false;
  }
};

// Ažuriraj review
export const updateReview = async (
  reviewId: string,
  reviewData: ReviewFormData,
): Promise<void> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Obriši review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Kalkuliši prosečnu ocenu za proizvod
export const calculateAverageRating = async (
  productId: number,
): Promise<{ averageRating: number; totalReviews: number }> => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const reviews = snapshot.docs.map((doc) => doc.data() as Review);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Zaokruži na 1 decimalu
      totalReviews: reviews.length,
    };
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return { averageRating: 0, totalReviews: 0 };
  }
};
