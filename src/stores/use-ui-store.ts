import { create } from 'zustand';

interface UIStore {
  // Mobile menu state
  isMenuOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;

  // Sheet state for mobile nav
  isSheetOpen: boolean;
  setSheetOpen: (isOpen: boolean) => void;

  // Dialog states
  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;

  // Alert dialog states
  isAlertDialogOpen: boolean;
  setAlertDialogOpen: (isOpen: boolean) => void;

  // Media query for mobile detection
  isMobile: boolean | undefined;
  setIsMobile: (isMobile: boolean) => void;
  initMobileDetection: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Mobile menu state
  isMenuOpen: false,
  setMenuOpen: (isOpen) => {
    set({ isMenuOpen: isOpen });

    // Control body scroll when menu is open/closed
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  },
  toggleMenu: () => {
    const { isMenuOpen, setMenuOpen } = get();
    setMenuOpen(!isMenuOpen);
  },

  // Sheet state
  isSheetOpen: false,
  setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),

  // Dialog state
  isDialogOpen: false,
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),

  // Alert dialog state
  isAlertDialogOpen: false,
  setAlertDialogOpen: (isOpen) => set({ isAlertDialogOpen: isOpen }),

  // Mobile detection
  isMobile: undefined,
  setIsMobile: (isMobile) => set({ isMobile }),
  initMobileDetection: () => {
    const MOBILE_BREAKPOINT = 768;

    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

      const onChange = () => {
        set({ isMobile: window.innerWidth < MOBILE_BREAKPOINT });
      };

      mql.addEventListener('change', onChange);
      set({ isMobile: window.innerWidth < MOBILE_BREAKPOINT });

      // Return cleanup function
      return () => mql.removeEventListener('change', onChange);
    }
  },
}));
