import { create } from 'zustand';

type RouteStore = {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
};

export const useRoute = create<RouteStore>((set) => ({
  activeRoute: '',
  setActiveRoute: (route) => set({ activeRoute: route }),
}));
