import { create } from 'zustand';
import { auth, db } from '@/services/firebase';
import {
  User,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  AuthError,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { generateUsername, toast, getAuthErrorMessage } from '@/utils';

interface LoadingState {
  email: boolean;
  google: boolean;
  overall: boolean;
  initial: boolean;
}

// Extend the Firebase User type with our custom fields
interface CustomUser extends User {
  username?: string;
  fullName?: string;
  role?: string;
  nim?: string;
  phone?: string;
  assessmentCount?: number;
  status?: string;
  lastActive?: Date | string;
}

// Data type for the updateProfile function
interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  nim?: string;
  phone?: string;
}

interface AuthState {
  user: CustomUser | null;
  loading: LoadingState;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: {
    email: false,
    google: false,
    overall: false,
    initial: true,
  },
  error: null,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set((state) => ({
        loading: { ...state.loading, email: true, overall: true },
        error: null,
      }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = getAuthErrorMessage((error as AuthError).code);
      toast.error(message);
    } finally {
      set((state) => ({
        loading: { ...state.loading, email: false, overall: false },
        error: null,
      }));
    }
  },

  signInWithGoogle: async () => {
    try {
      set((state) => ({
        loading: { ...state.loading, google: true, overall: true },
        error: null,
      }));
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          user: {
            ...user,
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role,
          },
        });
      } else {
        // User doesn't exist in Firestore yet, create profile
        try {
          const fullName = user.displayName || user.email?.split('@')[0] || 'User';
          const username = await generateUsername(fullName);

          await setDoc(doc(db, 'users', user.uid), {
            fullName,
            username,
            email: user.email,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
            userId: user.uid,
            photoURL: user.photoURL,
            role: 'student',
            status: 'active',
          });

          await setDoc(doc(db, 'usernames', username), {
            userId: user.uid,
          });

          set({
            user: {
              ...user,
              username,
              fullName,
              role: 'student',
              status: 'active',
            },
          });
        } catch (error) {
          console.error('Error saving Google user data to Firestore:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to save user data. Please try again.',
          });
        }
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      toast.error('Google sign in error');
    } finally {
      set((state) => ({
        loading: { ...state.loading, google: false, overall: false },
        error: null,
      }));
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      set((state) => ({
        loading: { ...state.loading, email: true, overall: true },
        error: null,
      }));

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Your account has been created');

      try {
        const username = await generateUsername(name);

        await setDoc(doc(db, 'users', user.uid), {
          fullName: name,
          username,
          email,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          userId: user.uid,
          role: 'student',
          status: 'active',
        });

        await setDoc(doc(db, 'usernames', username), {
          userId: user.uid,
        });

        set({
          user: {
            ...user,
            username,
            fullName: name,
            role: 'student',
            status: 'active',
          },
        });
      } catch (error) {
        await user.delete();
        console.error('Firestore error:', error);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Email already in use');
    } finally {
      set((state) => ({
        loading: { ...state.loading, email: false, overall: false },
        error: null,
      }));
    }
  },

  signOut: async () => {
    try {
      const { user } = get();
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            lastActive: serverTimestamp(),
          });
        } catch (e) {
          console.error('Error updating lastActive on logout:', e);
        }
      }

      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  },

  clearError: () => set({ error: null }),

  updateProfile: async (data: UpdateProfileData) => {
    try {
      const { user } = get();

      if (!user) {
        throw new Error('User not authenticated');
      }

      set((state) => ({
        loading: { ...state.loading, overall: true },
        error: null,
      }));

      const updateData: Partial<CustomUser> = {};

      if (data.firstName || data.lastName) {
        const currentFullName = user.fullName || '';
        const [currentFirst = '', currentLast = ''] = currentFullName.split(' ');

        const newFirstName = data.firstName !== undefined ? data.firstName : currentFirst;
        const newLastName = data.lastName !== undefined ? data.lastName : currentLast;

        updateData.fullName = `${newFirstName} ${newLastName}`.trim();
      }

      if (data.nim !== undefined) updateData.nim = data.nim;
      if (data.phone !== undefined) updateData.phone = data.phone;

      await updateDoc(doc(db, 'users', user.uid), {
        ...updateData,
        lastActive: serverTimestamp(),
      });

      set((state) => ({
        user: {
          ...state.user!,
          ...updateData,
        },
        loading: { ...state.loading, overall: false },
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      set((state) => ({
        error: error instanceof Error ? error.message : 'Failed to update profile',
        loading: { ...state.loading, overall: false },
      }));
    }
  },
}));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === 'student') {
          await updateDoc(doc(db, 'users', user.uid), {
            lastActive: serverTimestamp(),
          });
        }

        useAuth.setState({
          user: {
            ...user,
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role,
            nim: userData.nim,
            phone: userData.phone,
            assessmentCount: userData.assessmentCount || 0,
            status: userData.status || 'active',
          },
          loading: { ...useAuth.getState().loading, initial: false },
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      useAuth.setState({
        loading: { ...useAuth.getState().loading, initial: false },
        error: 'Failed to fetch user data',
      });
    }
  } else {
    useAuth.setState({
      user: null,
      loading: { ...useAuth.getState().loading, initial: false },
    });
  }
});
