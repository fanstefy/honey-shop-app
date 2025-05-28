import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  id: number;
  name: string;
  image: string;
  backImage?: string;
  price: string;
  discount?: string;
}

interface ShopState {
  cart: number[];
  wishlist: number[];
  products: Product[];
  setProducts: (products: Product[]) => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      products: [],
      setProducts: (products) => set({ products }),

      addToCart: (id) =>
        set((state) =>
          state.cart.includes(id)
            ? state
            : { ...state, cart: [...state.cart, id] }
        ),

      removeFromCart: (id) =>
        set((state) => ({
          ...state,
          cart: state.cart.filter((itemId) => itemId !== id),
        })),

      addToWishlist: (id) =>
        set((state) =>
          state.wishlist.includes(id)
            ? state
            : { ...state, wishlist: [...state.wishlist, id] }
        ),

      removeFromWishlist: (id) =>
        set((state) => ({
          ...state,
          wishlist: state.wishlist.filter((itemId) => itemId !== id),
        })),
    }),
    {
      name: "shop-storage",
      // optionally ignore products in localStorage
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        // products NOT included on purpose
      }),
    }
  )
);

// Optional: expose to Zukeeper or other devtools
if (typeof window !== "undefined") {
  (window as any).store = useShopStore;
}
