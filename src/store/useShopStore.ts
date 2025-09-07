import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { User } from "firebase/auth";
import {
  loadUserWishlist,
  saveUserWishlist,
} from "../services/wishlistFirebaseService";
import { loadUserCart, saveUserCart } from "../services/cartFirebaseService";

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
  clearCart: () => void;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;

  // Wishlist funkcije
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;

  // User management
  setCurrentUser: (user: User | null) => void;
  syncWishlistToFirebase: () => Promise<void>;
  syncCartToFirebase: () => Promise<void>;
  syncAllToFirebase: () => Promise<void>;
  mergeWithFirebase: () => Promise<void>;
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

        // Cart akcije sa Firebase sync
        addToCart: (id) =>
          set((state) => {
            const existing = state.cart.find((item) => item.id === id);
            let newState;

            if (existing) {
              newState = {
                ...state,
                cart: state.cart.map((item) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            } else {
              newState = {
                ...state,
                cart: [...state.cart, { id, quantity: 1 }],
              };
            }

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncCartToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        removeFromCart: (id) =>
          set((state) => {
            const newState = {
              ...state,
              cart: state.cart.filter((item) => item.id !== id),
            };

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncCartToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        clearCart: () =>
          set((state) => {
            const newState = { ...state, cart: [] };

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncCartToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        increaseCartQuantity: (id: number) =>
          set((state) => {
            const newState = {
              ...state,
              cart: state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncCartToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        decreaseCartQuantity: (id: number) =>
          set((state) => {
            const newState = {
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
            };

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncCartToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        // Wishlist akcije (ostaju iste)
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

        clearWishlist: () =>
          set((state) => {
            const newState = { ...state, wishlist: [] };

            // Async sync sa Firebase
            setTimeout(() => {
              const currentState = get();
              if (currentState.currentUser) {
                currentState.syncWishlistToFirebase().catch(console.error);
              }
            }, 0);

            return newState;
          }),

        syncWishlistToFirebase: async () => {
          const { currentUser, wishlist } = get();
          if (!currentUser) return;

          try {
            await saveUserWishlist(currentUser.uid, wishlist);
          } catch (error) {
            console.error("Error syncing wishlist to Firebase:", error);
          }
        },

        syncCartToFirebase: async () => {
          const { currentUser, cart } = get();
          if (!currentUser) return;

          try {
            await saveUserCart(currentUser.uid, cart);
          } catch (error) {
            console.error("Error syncing cart to Firebase:", error);
          }
        },

        syncAllToFirebase: async () => {
          const { currentUser, wishlist, cart } = get();
          if (!currentUser) return;

          try {
            // Sync oba odjednom
            await Promise.all([
              saveUserWishlist(currentUser.uid, wishlist),
              saveUserCart(currentUser.uid, cart),
            ]);
          } catch (error) {
            console.error("Error syncing data to Firebase:", error);
          }
        },

        // User management sa merge logikom
        setCurrentUser: (user) => {
          set({ currentUser: user });

          // Kada se korisnik uloguje, merguj lokalne podatke sa Firebase
          if (user) {
            setTimeout(() => {
              get().mergeWithFirebase().catch(console.error);
            }, 0);
          }
        },

        // Nova funkcija za merge
        mergeWithFirebase: async () => {
          const { currentUser } = get();
          if (!currentUser) return;

          try {
            const [firebaseWishlist, firebaseCart] = await Promise.all([
              loadUserWishlist(currentUser.uid),
              loadUserCart(currentUser.uid),
            ]);

            // Jednostavno prepiši sa Firebase podacima
            set({
              wishlist: firebaseWishlist,
              cart: firebaseCart,
            });

            console.log("Synced with Firebase");
          } catch (error) {
            console.error("Error syncing with Firebase:", error);
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
