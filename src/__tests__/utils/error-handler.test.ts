import { handleError, getAuthErrorMessage } from '@/utils/error-handler'

// Mock the toast utility
jest.mock('@/utils/toast', () => ({
  toast: {
    error: jest.fn(),
  },
}))

describe('handleError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should handle standard Error objects', () => {
      const error = new Error('Test error message')
      const result = handleError(error)

      expect(result).toEqual({
        message: 'Test error message',
        code: 'unknown/error',
        category: 'unknown',
      })
    })

    it('should handle string errors', () => {
      const error = 'String error message'
      const result = handleError(error)

      expect(result).toEqual({
        message: 'String error message',
        code: 'unknown/error',
        category: 'unknown',
      })
    })

    it('should handle null/undefined errors', () => {
      const result = handleError(null)

      expect(result).toEqual({
        message: 'null',
        code: 'unknown/error',
        category: 'unknown',
      })
    })
  })

  describe('Firebase Auth errors', () => {
    it('should handle Firebase Auth errors correctly', () => {
      const authError = {
        code: 'auth/user-not-found',
        message: 'User not found',
      }
      
      const result = handleError(authError)

      expect(result).toEqual({
        message: 'User not found',
        code: 'auth/user-not-found',
        category: 'auth',
      })
    })

    it('should handle Auth errors without message', () => {
      const authError = {
        code: 'auth/invalid-email',
      }
      
      const result = handleError(authError)

      expect(result).toEqual({
        message: 'Authentication error',
        code: 'auth/invalid-email',
        category: 'auth',
      })
    })

    it('should handle Auth errors without code', () => {
      const authError = new Error('Authentication failed')
      
      const result = handleError(authError)

      expect(result).toEqual({
        message: 'Authentication failed',
        code: 'unknown/error',
        category: 'unknown',
      })
    })
  })

  describe('Firestore errors', () => {
    it('should handle Firestore errors correctly', () => {
      const firestoreError = {
        code: 'firestore/permission-denied',
        message: 'Permission denied',
      }
      
      const result = handleError(firestoreError)

      expect(result).toEqual({
        message: 'Permission denied',
        code: 'firestore/permission-denied',
        category: 'database',
      })
    })

    it('should handle Firestore errors without message', () => {
      const firestoreError = {
        code: 'firestore/unavailable',
      }
      
      const result = handleError(firestoreError)

      expect(result).toEqual({
        message: 'Database error',
        code: 'firestore/unavailable',
        category: 'database',
      })
    })
  })

  describe('network errors', () => {
    it('should detect network errors by message content', () => {
      const networkError = new Error('Network connection failed')
      const result = handleError(networkError)

      expect(result).toEqual({
        message: 'Network connection failed',
        code: 'network/error',
        category: 'network',
      })
    })

    it('should detect connection errors by message content', () => {
      const connectionError = new Error('connection timeout')
      const result = handleError(connectionError)

      expect(result).toEqual({
        message: 'connection timeout',
        code: 'network/error',
        category: 'network',
      })
    })
  })

  describe('error handling configuration', () => {
    it('should log to console by default', () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const error = new Error('Test error')
      
      handleError(error)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[unknown] Test error',
        error
      )
    })

    it('should show toast by default', () => {
      const { toast } = require('@/utils/toast')
      const error = new Error('Test error')
      
      handleError(error, 'Custom message')

      expect(toast.error).toHaveBeenCalledWith('Custom message')
    })

    it('should not log to console when disabled', () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const error = new Error('Test error')
      
      handleError(error, 'Custom message', { logToConsole: false })

      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should not show toast when disabled', () => {
      const { toast } = require('@/utils/toast')
      const error = new Error('Test error')
      
      handleError(error, 'Custom message', { showToast: false })

      expect(toast.error).not.toHaveBeenCalled()
    })

    it('should throw error when throwError is true', () => {
      const error = new Error('Test error')
      
      expect(() => {
        handleError(error, 'Custom message', { throwError: true })
      }).toThrow('Test error')
    })

    it('should not throw error by default', () => {
      const error = new Error('Test error')
      
      expect(() => {
        handleError(error)
      }).not.toThrow()
    })

    it('should use custom user message', () => {
      const { toast } = require('@/utils/toast')
      const error = new Error('Test error')
      const customMessage = 'Something went wrong with your request'
      
      handleError(error, customMessage)

      expect(toast.error).toHaveBeenCalledWith(customMessage)
    })

    it('should use default user message when not provided', () => {
      const { toast } = require('@/utils/toast')
      const error = new Error('Test error')
      
      handleError(error)

      expect(toast.error).toHaveBeenCalledWith('Something went wrong.')
    })
  })

  describe('configuration merging', () => {
    it('should merge custom config with defaults', () => {
      const consoleSpy = jest.spyOn(console, 'error')
      const { toast } = require('@/utils/toast')
      const error = new Error('Test error')
      
      handleError(error, 'Custom message', { logToConsole: false })

      expect(consoleSpy).not.toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith('Custom message') // showToast still true
    })
  })
})

describe('getAuthErrorMessage', () => {
  it('should return correct message for user-not-found', () => {
    expect(getAuthErrorMessage('auth/user-not-found')).toBe('Invalid email or password')
  })

  it('should return correct message for wrong-password', () => {
    expect(getAuthErrorMessage('auth/wrong-password')).toBe('Invalid email or password')
  })

  it('should return correct message for email-already-in-use', () => {
    expect(getAuthErrorMessage('auth/email-already-in-use')).toBe('This email is already registered')
  })

  it('should return correct message for weak-password', () => {
    expect(getAuthErrorMessage('auth/weak-password')).toBe('Password is too weak')
  })

  it('should return correct message for invalid-email', () => {
    expect(getAuthErrorMessage('auth/invalid-email')).toBe('Invalid email address')
  })

  it('should return correct message for too-many-requests', () => {
    expect(getAuthErrorMessage('auth/too-many-requests')).toBe('Too many unsuccessful login attempts')
  })

  it('should return default message for unknown error codes', () => {
    expect(getAuthErrorMessage('auth/unknown-error')).toBe('An authentication error occurred')
  })

  it('should return default message for non-auth error codes', () => {
    expect(getAuthErrorMessage('firestore/permission-denied')).toBe('An authentication error occurred')
  })

  it('should return default message for empty string', () => {
    expect(getAuthErrorMessage('')).toBe('An authentication error occurred')
  })
})