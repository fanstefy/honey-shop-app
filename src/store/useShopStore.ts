import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

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
  setProducts: (products: Product[]) => void;
  getProductById: (id: number) => Product | null;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
}

export const useShopStore = create<ShopState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        cart: [],
        wishlist: [],
        products: [],

        setProducts: (products) => set({ products }),

        getProductById: (id: number) => {
          const products = get().products;
          return products.find((product) => product.id === id) || null;
        },

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
        partialize: (state) => ({
          cart: state.cart,
          wishlist: state.wishlist,
        }),
      }
    )
  )
);
