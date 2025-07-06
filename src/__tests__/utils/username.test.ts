import { generateUsername } from '@/utils/username'

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}))

jest.mock('@/services/firebase', () => ({
  db: { __type: 'mockFirestore' },
}))

describe('generateUsername', () => {
  const mockDoc = require('firebase/firestore').doc
  const mockGetDoc = require('firebase/firestore').getDoc

  beforeEach(() => {
    jest.clearAllMocks()
    mockDoc.mockReturnValue({ __type: 'mockDocRef' })
  })

  describe('basic functionality', () => {
    it('should generate username from full name', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('John Doe')

      expect(result).toBe('johndoe')
      expect(mockDoc).toHaveBeenCalledWith({ __type: 'mockFirestore' }, 'usernames', 'johndoe')
      expect(mockGetDoc).toHaveBeenCalledWith({ __type: 'mockDocRef' })
    })

    it('should clean special characters from name', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('John-Paul O\'Connor III')

      expect(result).toBe('johnpauloconnoriii')
    })

    it('should handle names with numbers', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('User123 Test456')

      expect(result).toBe('user123test456')
    })

    it('should trim whitespace', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('   John Doe   ')

      expect(result).toBe('johndoe')
    })
  })

  describe('username collision handling', () => {
    it('should append number when username exists', async () => {
      mockGetDoc
        .mockResolvedValueOnce({ exists: () => true }) // johndoe exists
        .mockResolvedValueOnce({ exists: () => false }) // johndoe1 doesn't exist

      const result = await generateUsername('John Doe')

      expect(result).toBe('johndoe1')
      expect(mockGetDoc).toHaveBeenCalledTimes(2)
    })

    it('should increment number until unique username found', async () => {
      mockGetDoc
        .mockResolvedValueOnce({ exists: () => true }) // johndoe exists
        .mockResolvedValueOnce({ exists: () => true }) // johndoe1 exists
        .mockResolvedValueOnce({ exists: () => true }) // johndoe2 exists
        .mockResolvedValueOnce({ exists: () => false }) // johndoe3 doesn't exist

      const result = await generateUsername('John Doe')

      expect(result).toBe('johndoe3')
      expect(mockGetDoc).toHaveBeenCalledTimes(4)
    })

    it('should handle many collisions efficiently', async () => {
      // Mock first 10 usernames as existing
      for (let i = 0; i < 10; i++) {
        mockGetDoc.mockResolvedValueOnce({ exists: () => true })
      }
      // 11th username is available
      mockGetDoc.mockResolvedValueOnce({ exists: () => false })

      const result = await generateUsername('popular')

      expect(result).toBe('popular10')
      expect(mockGetDoc).toHaveBeenCalledTimes(11)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('')

      expect(result).toBe('')
    })

    it('should handle single character', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('A')

      expect(result).toBe('a')
    })

    it('should handle special characters only', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('@#$%^&*()')

      expect(result).toBe('')
    })

    it('should handle unicode characters', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('José María')

      expect(result).toBe('josmara')
    })

    it('should handle very long names', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const longName = 'A'.repeat(100) + ' ' + 'B'.repeat(100)
      const result = await generateUsername(longName)

      expect(result).toBe('a'.repeat(100) + 'b'.repeat(100))
    })
  })

  describe('error handling', () => {
    it('should throw error after 100 attempts', async () => {
      // Mock all usernames up to 100 as existing
      for (let i = 0; i <= 99; i++) {
        mockGetDoc.mockResolvedValueOnce({ exists: () => true })
      }

      await expect(generateUsername('popular')).rejects.toThrow('Unable to generate unique username')

      expect(mockGetDoc).toHaveBeenCalledTimes(100) // base + 1-99
    })

    it('should handle Firestore errors', async () => {
      const firestoreError = new Error('Firestore connection failed')
      mockGetDoc.mockRejectedValue(firestoreError)

      await expect(generateUsername('John Doe')).rejects.toThrow('Firestore connection failed')
    })

    it('should handle malformed document responses', async () => {
      mockGetDoc.mockResolvedValue(null)

      await expect(generateUsername('John Doe')).rejects.toThrow()
    })
  })

  describe('case variations', () => {
    it('should handle mixed case names', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('JoHn DoE')

      expect(result).toBe('johndoe')
    })

    it('should handle ALL CAPS names', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('JOHN DOE')

      expect(result).toBe('johndoe')
    })
  })

  describe('realistic scenarios', () => {
    it('should handle common first/last name combination', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('John Smith')

      expect(result).toBe('johnsmith')
    })

    it('should handle name with middle initial', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('John F. Kennedy')

      expect(result).toBe('johnfkennedy')
    })

    it('should handle hyphenated last names', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('Mary Jane Watson-Parker')

      expect(result).toBe('maryjanewatsonparker')
    })

    it('should handle names with suffixes', async () => {
      mockGetDoc.mockResolvedValue({ exists: () => false })

      const result = await generateUsername('Robert Downey Jr.')

      expect(result).toBe('robertdowneyjr')
    })
  })
})