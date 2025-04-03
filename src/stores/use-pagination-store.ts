import { create } from 'zustand';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface PaginationStore {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

export const usePagination = create<PaginationStore>((set) => ({
  currentPage: 1,
  itemsPerPage: 5,
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
}));

// Custom hook to handle page reset on route changes
export function usePaginationWithReset() {
  const pathname = usePathname();
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = usePagination();

  useEffect(() => {
    // Reset to first page when route changes
    setCurrentPage(1);
  }, [pathname, setCurrentPage]);

  return { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage };
}
