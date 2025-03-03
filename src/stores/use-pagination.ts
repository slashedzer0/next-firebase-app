import { create } from "zustand"

interface PaginationStore {
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (count: number) => void
}

export const usePagination = create<PaginationStore>((set) => ({
  currentPage: 1,
  itemsPerPage: 5,
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count })
}))