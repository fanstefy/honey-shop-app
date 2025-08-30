import { create } from "zustand";

type SidebarType = "cart" | "wishlist" | "quickview" | null;

interface SidebarState {
  rightSidebar: {
    isOpen: boolean;
    type: SidebarType;
    quickViewProduct: any | null;
  };
  leftSidebar: {
    isOpen: boolean;
  };
  openRightSidebar: (type: SidebarType, payload?: any) => void;
  closeRightSidebar: () => void;
  openLeftSidebar: () => void;
  closeLeftSidebar: () => void;
  closeAllSidebars: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  rightSidebar: {
    isOpen: false,
    type: null,
    quickViewProduct: null,
  },
  leftSidebar: {
    isOpen: false,
  },
  openRightSidebar: (type, payload) =>
    set((state) => ({
      rightSidebar: {
        isOpen: true,
        type,
        quickViewProduct: type === "quickview" ? payload : null,
      },
    })),
  closeRightSidebar: () =>
    set((state) => ({
      rightSidebar: {
        ...state.rightSidebar,
        isOpen: false,
        type: null,
        quickViewProduct: null,
      },
    })),
  openLeftSidebar: () =>
    set((state) => ({
      leftSidebar: {
        isOpen: true,
      },
    })),
  closeLeftSidebar: () =>
    set((state) => ({
      leftSidebar: {
        ...state.leftSidebar,
        isOpen: false,
      },
    })),
  closeAllSidebars: () =>
    set(() => ({
      rightSidebar: { isOpen: false, type: null, quickViewProduct: null },
      leftSidebar: { isOpen: false, type: null },
    })),
}));
