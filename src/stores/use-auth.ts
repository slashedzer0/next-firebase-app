import { create } from "zustand"
import { auth } from "@/services/firebase"
import {
  User,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  AuthError,
} from "firebase/auth"

interface LoadingState {
  email: boolean
  google: boolean
  overall: boolean
  initial: boolean
}

interface AuthState {
  user: User | null
  loading: LoadingState
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: {
    email: false,
    google: false,
    overall: false,
    initial: true
  },
  error: null,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set((state) => ({
        loading: { ...state.loading, email: true, overall: true },
        error: null
      }))
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const authError = error as AuthError
      set({ error: authError.code })
    } finally {
      // Set email loading to false immediately
      set((state) => ({
        loading: { ...state.loading, email: false }
      }))
      // Reset overall loading after a brief delay
      setTimeout(() => {
        set((state) => ({
          loading: { ...state.loading, overall: false }
        }))
      }, 500)
    }
  },

  signInWithGoogle: async () => {
    try {
      set((state) => ({
        loading: { ...state.loading, google: true, overall: true },
        error: null
      }))
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      const authError = error as AuthError
      set({ error: authError.code })
    } finally {
      // Set google loading to false immediately
      set((state) => ({
        loading: { ...state.loading, google: false }
      }))
      // Reset overall loading after a brief delay
      setTimeout(() => {
        set((state) => ({
          loading: { ...state.loading, overall: false }
        }))
      }, 500)
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      const authError = error as AuthError
      set({ error: authError.code })
    }
  },

  clearError: () => set({ error: null }),
}))

// Set up auth state listener
auth.onAuthStateChanged((user) => {
  useAuth.setState((state) => ({
    user,
    loading: { ...state.loading, initial: false }
  }))
})