import { create } from "zustand";

type SidebarType = "cart" | "wishlist" | "quickview" | null;

interface SidebarState {
  isOpen: boolean;
  sidebarType: SidebarType;
  quickViewProduct: any | null;
  openSidebar: (type: SidebarType, payload?: any) => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  sidebarType: null,
  quickViewProduct: null,

  openSidebar: (type, payload) =>
    set(() => ({
      isOpen: true,
      sidebarType: type,
      quickViewProduct: type === "quickview" ? payload : null,
    })),

  closeSidebar: () =>
    set(() => ({
      isOpen: false,
      sidebarType: null,
      quickViewProduct: null,
    })),
}));
