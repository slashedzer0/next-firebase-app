import { saveAssessmentResult } from '@/utils/save-assessment'
import { Answer, AssessmentResult } from '@/types/assessment'

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => ({ __type: 'serverTimestamp' })),
}))

jest.mock('@/services/firebase', () => ({
  db: { __type: 'mockFirestore' },
}))

jest.mock('@/schemas/assessment', () => ({
  assessmentSchema: {
    parse: jest.fn(),
  },
}))

describe('saveAssessmentResult', () => {
  const mockAddDoc = require('firebase/firestore').addDoc
  const mockCollection = require('firebase/firestore').collection
  const mockServerTimestamp = require('firebase/firestore').serverTimestamp
  const mockAssessmentSchema = require('@/schemas/assessment').assessmentSchema

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mock behaviors
    mockAddDoc.mockResolvedValue({ id: 'mock-doc-id' })
    mockCollection.mockReturnValue({ __type: 'mockCollection' })
    mockAssessmentSchema.parse.mockReturnValue(true)
    
    // Mock current date to be predictable
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T10:30:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('successful save operations', () => {
    it('should save assessment result successfully', async () => {
      const userId = 'user123'
      const answers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: -1 },
      ]
      const result: AssessmentResult = {
        stressLevel: 'moderate',
        confidence: 75,
      }

      const docId = await saveAssessmentResult(userId, answers, result)

      expect(docId).toBe('mock-doc-id')
      expect(mockAddDoc).toHaveBeenCalledTimes(1)
      expect(mockCollection).toHaveBeenCalledWith(
        { __type: 'mockFirestore' },
        'assessments'
      )
    })

    it('should format assessment data correctly', async () => {
      const userId = 'user123'
      const answers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: -1 },
      ]
      const result: AssessmentResult = {
        stressLevel: 'severe',
        confidence: 90,
      }

      await saveAssessmentResult(userId, answers, result)

      expect(mockAddDoc).toHaveBeenCalledWith(
        { __type: 'mockCollection' },
        {
          userId: 'user123',
          stressLevel: 'severe',
          confidence: 90,
          answers: [
            { questionId: 'q1', value: 1 },
            { questionId: 'q2', value: -1 },
          ],
          date: '15-01-2024', // DD-MM-YYYY format
          day: 'Monday',
          createdAt: { __type: 'serverTimestamp' },
        }
      )
    })

    it('should validate assessment with schema', async () => {
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await saveAssessmentResult(userId, answers, result)

      expect(mockAssessmentSchema.parse).toHaveBeenCalledWith({
        userId: 'user123',
        stressLevel: 'mild',
        confidence: 60,
        answers: [{ questionId: 'q1', value: 1 }],
        date: '15-01-2024',
        day: 'Monday',
        createdAt: { __type: 'serverTimestamp' },
      })
    })
  })

  describe('date formatting', () => {
    it('should format date correctly for single digit day and month', async () => {
      jest.setSystemTime(new Date('2024-03-05T10:30:00Z'))
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await saveAssessmentResult(userId, answers, result)

      const callArgs = mockAddDoc.mock.calls[0][1]
      expect(callArgs.date).toBe('05-03-2024')
      expect(callArgs.day).toBe('Tuesday')
    })

    it('should format date correctly for double digit day and month', async () => {
      jest.setSystemTime(new Date('2024-12-25T10:30:00Z'))
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await saveAssessmentResult(userId, answers, result)

      const callArgs = mockAddDoc.mock.calls[0][1]
      expect(callArgs.date).toBe('25-12-2024')
      expect(callArgs.day).toBe('Wednesday')
    })
  })

  describe('error handling', () => {
    it('should throw error when userId is null', async () => {
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult(null, answers, result)
      ).rejects.toThrow('Authentication required to save assessment results')
    })

    it('should throw error when userId is empty string', async () => {
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult('', answers, result)
      ).rejects.toThrow('Authentication required to save assessment results')
    })

    it('should handle Firebase permission errors', async () => {
      const firebaseError = new Error('Firebase: Permission denied')
      mockAddDoc.mockRejectedValue(firebaseError)
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult(userId, answers, result)
      ).rejects.toThrow("Firebase: Permission denied")
    })

    it('should handle authentication errors', async () => {
      const authError = new Error('Authentication required to save assessment results')
      mockAddDoc.mockRejectedValue(authError)
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult(userId, answers, result)
      ).rejects.toThrow('Authentication required to save assessment results')
    })

    it('should re-throw unknown errors', async () => {
      const unknownError = new Error('Unknown Firebase error')
      mockAddDoc.mockRejectedValue(unknownError)
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult(userId, answers, result)
      ).rejects.toThrow('Unknown Firebase error')
    })

    it('should handle schema validation errors', async () => {
      const validationError = new Error('Invalid assessment data')
      mockAssessmentSchema.parse.mockImplementation(() => {
        throw validationError
      })
      
      const userId = 'user123'
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      await expect(
        saveAssessmentResult(userId, answers, result)
      ).rejects.toThrow('Invalid assessment data')
    })
  })

  describe('edge cases', () => {
    it('should handle empty answers array', async () => {
      const userId = 'user123'
      const answers: Answer[] = []
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 0,
      }

      const docId = await saveAssessmentResult(userId, answers, result)

      expect(docId).toBe('mock-doc-id')
      expect(mockAddDoc).toHaveBeenCalledWith(
        { __type: 'mockCollection' },
        expect.objectContaining({
          answers: [],
        })
      )
    })

    it('should handle very long userId', async () => {
      const userId = 'a'.repeat(1000)
      const answers: Answer[] = [{ questionId: 'q1', value: 1 }]
      const result: AssessmentResult = {
        stressLevel: 'mild',
        confidence: 60,
      }

      const docId = await saveAssessmentResult(userId, answers, result)

      expect(docId).toBe('mock-doc-id')
      expect(mockAddDoc).toHaveBeenCalledWith(
        { __type: 'mockCollection' },
        expect.objectContaining({
          userId: userId,
        })
      )
    })

    it('should handle special characters in questionId', async () => {
      const userId = 'user123'
      const answers: Answer[] = [
        { questionId: 'q1_special-chars.test', value: 1 },
        { questionId: 'q2@domain.com', value: -1 },
      ]
      const result: AssessmentResult = {
        stressLevel: 'moderate',
        confidence: 75,
      }

      const docId = await saveAssessmentResult(userId, answers, result)

      expect(docId).toBe('mock-doc-id')
      expect(mockAddDoc).toHaveBeenCalledWith(
        { __type: 'mockCollection' },
        expect.objectContaining({
          answers: [
            { questionId: 'q1_special-chars.test', value: 1 },
            { questionId: 'q2@domain.com', value: -1 },
          ],
        })
      )
    })
  })
})