import { create } from 'zustand';

type LocaleState = {
  locale: 'en' | 'id';
  setLocale: (locale: 'en' | 'id') => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
}));
