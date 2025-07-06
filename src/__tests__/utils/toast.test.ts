import { toast } from '@/utils/toast'

// Mock Sonner
jest.mock('sonner', () => ({
  toast: Object.assign(
    jest.fn(),
    {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    }
  ),
}))

describe('toast utility', () => {
  const mockSonnerToast = require('sonner').toast

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('detailed API', () => {
    it('should create info toast by default', () => {
      toast({ title: 'Info message' })

      expect(mockSonnerToast).toHaveBeenCalledWith('Info message', {})
    })

    it('should create success toast', () => {
      toast({ title: 'Success message', type: 'success' })

      expect(mockSonnerToast.success).toHaveBeenCalledWith('Success message', {})
    })

    it('should create error toast', () => {
      toast({ title: 'Error message', type: 'error' })

      expect(mockSonnerToast.error).toHaveBeenCalledWith('Error message', {})
    })

    it('should create warning toast', () => {
      toast({ title: 'Warning message', type: 'warning' })

      expect(mockSonnerToast.warning).toHaveBeenCalledWith('Warning message', {})
    })

    it('should fallback to default toast for unknown type', () => {
      toast({ title: 'Default message', type: 'info' })

      expect(mockSonnerToast).toHaveBeenCalledWith('Default message', {})
    })
  })

  describe('simple API extensions', () => {
    it('should create success toast via toast.success', () => {
      toast.success('Success message')

      expect(mockSonnerToast.success).toHaveBeenCalledWith('Success message', {})
    })

    it('should create error toast via toast.error', () => {
      toast.error('Error message')

      expect(mockSonnerToast.error).toHaveBeenCalledWith('Error message', {})
    })

    it('should create warning toast via toast.warning', () => {
      toast.warning('Warning message')

      expect(mockSonnerToast.warning).toHaveBeenCalledWith('Warning message', {})
    })

    it('should create info toast via toast.info', () => {
      toast.info('Info message')

      expect(mockSonnerToast).toHaveBeenCalledWith('Info message', {})
    })
  })

  describe('return values', () => {
    it('should return toast ID from sonner', () => {
      mockSonnerToast.success.mockReturnValue('toast-id-123')

      const result = toast.success('Success message')

      expect(result).toBe('toast-id-123')
    })

    it('should return toast ID from default toast', () => {
      mockSonnerToast.mockReturnValue('toast-id-456')

      const result = toast({ title: 'Default message' })

      expect(result).toBe('toast-id-456')
    })
  })

  describe('edge cases', () => {
    it('should handle empty message', () => {
      toast.success('')

      expect(mockSonnerToast.success).toHaveBeenCalledWith('', {})
    })

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000)
      toast.error(longMessage)

      expect(mockSonnerToast.error).toHaveBeenCalledWith(longMessage, {})
    })

    it('should handle special characters in messages', () => {
      const specialMessage = '🎉 Success! @#$%^&*(){}[]|\\:";\'<>?,./'
      toast.success(specialMessage)

      expect(mockSonnerToast.success).toHaveBeenCalledWith(specialMessage, {})
    })
  })
})