import { create } from "zustand"

interface PasswordVisibilityStore {
  isVisible: boolean
  toggleVisibility: () => void
}

export const usePasswordVisibility = create<PasswordVisibilityStore>((set) => ({
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}))