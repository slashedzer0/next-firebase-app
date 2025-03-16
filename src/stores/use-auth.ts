import { create } from "zustand";
import { auth, db } from "@/services/firebase";
import {
  User,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { generateUsername } from "@/utils";

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
  role?: string; // Added role field
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
}

export const useAuth = create<AuthState>((set) => ({
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
      const authError = error as AuthError;
      set({ error: authError.code });
    } finally {
      // Set email loading to false immediately
      set((state) => ({
        loading: { ...state.loading, email: false },
      }));
      // Reset overall loading after a brief delay
      setTimeout(() => {
        set((state) => ({
          loading: { ...state.loading, overall: false },
        }));
      }, 500);
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
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        // User exists, update state with Firestore data
        const userData = userDoc.data();
        set({
          user: {
            ...user,
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role, // Include role in user state
          },
        });
      } else {
        // User doesn't exist in Firestore yet, create profile
        try {
          // Get name from Google account or use email as fallback
          const fullName =
            user.displayName || user.email?.split("@")[0] || "User";

          // Generate unique username
          const username = await generateUsername(fullName);

          // Store user data in Firestore
          await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            username: username,
            email: user.email,
            createdAt: serverTimestamp(),
            userId: user.uid,
            photoURL: user.photoURL,
            role: "student", // Add role field
          });

          // Create username reference document
          await setDoc(doc(db, "usernames", username), {
            userId: user.uid,
          });

          // Update user state with new data
          set({
            user: {
              ...user,
              username,
              fullName,
              role: "student", // Include role in user state
            },
          });
        } catch (error) {
          console.error("Error saving Google user data to Firestore:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to save user data. Please try again.",
          });
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError.code });
    } finally {
      // Set google loading to false immediately
      set((state) => ({
        loading: { ...state.loading, google: false },
      }));
      // Reset overall loading after a brief delay
      setTimeout(() => {
        set((state) => ({
          loading: { ...state.loading, overall: false },
        }));
      }, 500);
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      set((state) => ({
        loading: { ...state.loading, email: true, overall: true },
        error: null,
      }));

      // Create auth user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      try {
        // Generate username from full name
        const baseUsername = name
          .toLowerCase()
          .trim()
          .replace(/[^a-zA-Z0-9]/g, "");
        let username = baseUsername;
        let counter = 1;

        // Check for username availability after auth
        while (true) {
          const usernameDoc = await getDoc(doc(db, "usernames", username));
          if (!usernameDoc.exists()) {
            break;
          }
          username = `${baseUsername}${counter}`;
          counter++;
          if (counter > 100) {
            throw new Error("Unable to generate unique username");
          }
        }

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          fullName: name,
          username: username,
          email: email,
          createdAt: serverTimestamp(),
          userId: user.uid,
          role: "student", // Add role field
        });

        // Create username reference document
        await setDoc(doc(db, "usernames", username), {
          userId: user.uid,
        });

        // Immediately update user state with the new data
        set({
          user: {
            ...user,
            username,
            fullName: name,
            role: "student", // Include role in user state
          },
        });
      } catch (error) {
        // If Firestore save fails, delete the auth user to maintain consistency
        await user.delete();
        console.error("Firestore error:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to save user data. Please try again.",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError.code });
    } finally {
      // Set email loading to false immediately
      set((state) => ({
        loading: { ...state.loading, email: false },
      }));
      // Reset overall loading after a brief delay
      setTimeout(() => {
        set((state) => ({
          loading: { ...state.loading, overall: false },
        }));
      }, 500);
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      set({ error: authError.code });
    }
  },

  clearError: () => set({ error: null }),
}));

// Set up auth state listener
auth.onAuthStateChanged(async (user) => {
  // Set loading to true if it was false and we're potentially fetching Firestore data
  if (user && useAuth.getState().loading.initial === false) {
    useAuth.setState((state) => ({
      loading: { ...state.loading, initial: true },
    }));
  }

  if (user) {
    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Combine auth user with Firestore data
        const customUser: CustomUser = {
          ...user,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role,
        };

        useAuth.setState((state) => ({
          user: customUser,
          loading: { ...state.loading, initial: false },
        }));
      } else {
        // If Firestore document doesn't exist yet (during signup process)
        useAuth.setState((state) => ({
          user: { ...user },
          loading: { ...state.loading, initial: false },
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      useAuth.setState((state) => ({
        user: { ...user },
        loading: { ...state.loading, initial: false },
        error: "Failed to fetch user data",
      }));
    }
  } else {
    useAuth.setState((state) => ({
      user: null,
      loading: { ...state.loading, initial: false },
    }));
  }
});
