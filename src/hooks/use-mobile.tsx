import * as React from 'react';
import { useUIStore } from '@/stores/use-ui-store';

export function useIsMobile() {
  const { isMobile, setIsMobile } = useUIStore();

  React.useEffect(() => {
    const MOBILE_BREAKPOINT = 768;

    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

      const handleChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      // Set initial value
      handleChange();

      // Add event listener
      mql.addEventListener('change', handleChange);

      // Return cleanup function
      return () => {
        mql.removeEventListener('change', handleChange);
      };
    }

    // Return empty cleanup function when window is not available (SSR)
    return () => {};
  }, [setIsMobile]);

  return !!isMobile;
}
