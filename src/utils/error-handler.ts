import { FirebaseError } from 'firebase/app';
import { AuthError } from 'firebase/auth';
import { FirestoreError } from 'firebase/firestore';
import { toast } from './toast';

// Define error categories
type ErrorCategory = 'auth' | 'database' | 'network' | 'validation' | 'unknown';

// Error handling configuration
interface ErrorConfig {
  logToConsole?: boolean;
  showToast?: boolean;
  throwError?: boolean;
}

const defaultConfig: ErrorConfig = {
  logToConsole: true,
  showToast: true,
  throwError: false,
};

/**
 * Centralized error handler for the application
 */
export function handleError(
  error: unknown,
  userMessage = 'Something went wrong.',
  config: ErrorConfig = defaultConfig
) {
  const { logToConsole, showToast, throwError } = { ...defaultConfig, ...config };

  // Get error details based on type
  const errorDetails = getErrorDetails(error);

  // Log to console if enabled
  if (logToConsole) {
    console.error(`[${errorDetails.category}] ${errorDetails.message}`, error);
  }

  // Show toast notification if enabled
  if (showToast) {
    toast.error(userMessage);
  }

  // Re-throw the error if requested
  if (throwError) {
    throw error;
  }

  return errorDetails;
}

/**
 * Extract error details based on error type
 */
function getErrorDetails(error: unknown): {
  message: string;
  code: string;
  category: ErrorCategory;
} {
  // Handle Firebase Auth errors
  if ((error as FirebaseError)?.code?.startsWith('auth/')) {
    const authError = error as AuthError;
    return {
      message: authError.message || 'Authentication error',
      code: authError.code || 'auth/unknown',
      category: 'auth',
    };
  }

  // Handle Firestore errors
  if (error instanceof FirestoreError || (error as FirebaseError)?.code?.startsWith('firestore/')) {
    const firestoreError = error as FirestoreError;
    return {
      message: firestoreError.message || 'Database error',
      code: firestoreError.code || 'firestore/unknown',
      category: 'database',
    };
  }

  // Handle standard errors
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('network') || error.message.includes('connection')) {
      return {
        message: error.message,
        code: 'network/error',
        category: 'network',
      };
    }

    // General error case
    return {
      message: error.message,
      code: 'unknown/error',
      category: 'unknown',
    };
  }

  // Handle any other type of error
  return {
    message: String(error),
    code: 'unknown/error',
    category: 'unknown',
  };
}

/**
 * Map Firebase auth error codes to user-friendly messages
 */
export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful login attempts';
    default:
      return 'An authentication error occurred';
  }
}
