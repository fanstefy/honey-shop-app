import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { User } from "firebase/auth";
import { saveUserWishlist } from "../services/wishlistFirebaseService";

interface Product {
  id: number;
  name: string;
  image: string;
  backImage?: string;
  price: number;
  discount?: string;
  description?: string;
  additionalInfo?: string;
}

interface ShopState {
  cart: { id: number; quantity: number }[];
  wishlist: number[];
  products: Product[];
  currentUser: User | null;

  // Osnovne funkcije (ostaju iste)
  setProducts: (products: Product[]) => void;
  getProductById: (id: number) => Product | null;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;

  // Wishlist funkcije
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;

  // User management
  setCurrentUser: (user: User | null) => void;
  syncWishlistToFirebase: () => Promise<void>;
}

export const useShopStore = create<ShopState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        cart: [],
        wishlist: [],
        products: [],
        currentUser: null,

        setProducts: (products) => set({ products }),

        getProductById: (id: number) => {
          const products = get().products;
          return products.find((product) => product.id === id) || null;
        },

        // Cart akcije (ostaju nepromenjen)
        addToCart: (id) =>
          set((state) => {
            const existing = state.cart.find((item) => item.id === id);
            if (existing) {
              return {
                ...state,
                cart: state.cart.map((item) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            } else {
              return {
                ...state,
                cart: [...state.cart, { id, quantity: 1 }],
              };
            }
          }),

        removeFromCart: (id) =>
          set((state) => ({
            ...state,
            cart: state.cart.filter((item) => item.id !== id),
          })),

        increaseCartQuantity: (id: number) =>
          set((state) => ({
            ...state,
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          })),

        decreaseCartQuantity: (id: number) =>
          set((state) => ({
            ...state,
            cart: state.cart
              .map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity: item.quantity > 1 ? item.quantity - 1 : 1,
                    }
                  : item
              )
              .filter((item) => item.quantity > 0),
          })),

        // Jednostavne wishlist akcije
        addToWishlist: (id) =>
          set((state) => {
            if (state.wishlist.includes(id)) return state;

            const newState = {
              ...state,
              wishlist: [...state.wishlist, id],
            };

            // Async sync sa Firebase ako je korisnik ulogovan
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncWishlistToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        removeFromWishlist: (id) =>
          set((state) => {
            const newState = {
              ...state,
              wishlist: state.wishlist.filter((itemId) => itemId !== id),
            };

            // Async sync sa Firebase ako je korisnik ulogovan
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncWishlistToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        // User management
        setCurrentUser: (user) => {
          set({ currentUser: user });

          // Kada se korisnik uloguje, sync postojeći wishlist sa Firebase
          if (user) {
            setTimeout(() => {
              get().syncWishlistToFirebase().catch(console.error);
            }, 0);
          }
        },

        syncWishlistToFirebase: async () => {
          const { currentUser, wishlist } = get();
          if (!currentUser) return;

          try {
            await saveUserWishlist(currentUser.uid, wishlist);
          } catch (error) {
            console.error("Error syncing wishlist to Firebase:", error);
          }
        },
      }),

      {
        name: "shop-storage",
        partialize: (state) => ({
          cart: state.cart,
          wishlist: state.wishlist, // Ovo će se persist-ovati
        }),
      }
    )
  )
);
