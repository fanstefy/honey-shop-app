import { create } from "zustand";

type SidebarType = "cart" | "wishlist" | "quickview" | null;

interface SidebarState {
  isOpen: boolean;
  sidebarType: SidebarType;
  quickViewProduct: any | null;
  cartItems: any[];
  wishlistItems: any[];
  openSidebar: (type: SidebarType, payload?: any) => void;
  closeSidebar: () => void;
  addToCart: (item: any) => void;
  addToWishlist: (item: any) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  sidebarType: null,
  quickViewProduct: null,
  cartItems: [],
  wishlistItems: [],
  openSidebar: (type, payload) =>
    set((state) => ({
      isOpen: true,
      sidebarType: type,
      quickViewProduct: type === "quickview" ? payload : state.quickViewProduct,
    })),
  closeSidebar: () =>
    set(() => ({
      isOpen: false,
      sidebarType: null,
      quickViewProduct: null,
    })),
  addToCart: (item) =>
    set((state) => ({
      cartItems: state.cartItems.some((i) => i.id === item.id)
        ? state.cartItems
        : [...state.cartItems, item],
    })),
  addToWishlist: (item) =>
    set((state) => ({
      wishlistItems: state.wishlistItems.some((i) => i.id === item.id)
        ? state.wishlistItems
        : [...state.wishlistItems, item],
    })),
}));
