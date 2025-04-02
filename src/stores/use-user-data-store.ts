import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface UserData {
  fullName: string;
  email: string;
  photoURL?: string;
}

interface UserDataStore {
  userData: UserData | null;
  loading: boolean;
  fetchUserData: (userId: string) => Promise<void>;
}

export const useUserDataStore = create<UserDataStore>((set) => ({
  userData: null,
  loading: false,

  fetchUserData: async (userId) => {
    if (!userId) return;

    try {
      set({ loading: true });

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        set({
          userData: userDoc.data() as UserData,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ loading: false });
    }
  },
}));
