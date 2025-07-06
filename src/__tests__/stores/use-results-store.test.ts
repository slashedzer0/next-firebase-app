import { act, renderHook } from '@testing-library/react'
import { useResultsStore } from '@/stores/use-results-store'

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}))

jest.mock('@/services/firebase', () => ({
  db: { __type: 'mockFirestore' },
}))

describe('useResultsStore', () => {
  const mockCollection = require('firebase/firestore').collection
  const mockQuery = require('firebase/firestore').query
  const mockWhere = require('firebase/firestore').where
  const mockGetDocs = require('firebase/firestore').getDocs

  beforeEach(() => {
    // Reset store to initial state before each test
    useResultsStore.setState({
      assessments: [],
      loading: true,
    })
    
    jest.clearAllMocks()
    
    // Setup default mock returns
    mockCollection.mockReturnValue({ __type: 'mockCollection' })
    mockQuery.mockReturnValue({ __type: 'mockQuery' })
    mockWhere.mockReturnValue({ __type: 'mockWhere' })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useResultsStore())
      
      expect(result.current.assessments).toEqual([])
      expect(result.current.loading).toBe(true)
    })
  })

  describe('fetchUserAssessments', () => {
    it('should return early if no userId provided', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      await act(async () => {
        await result.current.fetchUserAssessments('')
      })
      
      expect(mockCollection).not.toHaveBeenCalled()
      expect(result.current.loading).toBe(true)
    })

    it('should fetch and process assessments correctly', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      // Mock Firestore query snapshot
      const mockDoc1 = {
        id: 'doc1',
        data: () => ({
          stressLevel: 'mild',
          confidence: 65,
          date: '15-01-2024',
          createdAt: { 
            toMillis: () => 1705315200000 // Mock timestamp
          }
        })
      }
      
      const mockDoc2 = {
        id: 'doc2',
        data: () => ({
          stressLevel: 'moderate',
          confidence: 80,
          date: '16-01-2024',
          createdAt: { 
            toMillis: () => 1705401600000 // Mock timestamp (later)
          }
        })
      }
      
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback(mockDoc1)
          callback(mockDoc2)
        })
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      expect(mockCollection).toHaveBeenCalledWith({ __type: 'mockFirestore' }, 'assessments')
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'user123')
      expect(result.current.loading).toBe(false)
      expect(result.current.assessments).toEqual([
        {
          id: '2', // Newest gets highest number and appears first
          level: 'moderate',
          confidence: 80,
          date: '16-01-2024',
        },
        {
          id: '1', // Oldest gets lowest number
          level: 'mild',
          confidence: 65,
          date: '15-01-2024',
        }
      ])
    })

    it('should sort by timestamp when available', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockDoc1 = {
        id: 'doc1',
        data: () => ({
          stressLevel: 'severe',
          confidence: 90,
          date: '15-01-2024',
          createdAt: { 
            toMillis: () => 1705401600000 // Later timestamp
          }
        })
      }
      
      const mockDoc2 = {
        id: 'doc2',
        data: () => ({
          stressLevel: 'mild',
          confidence: 60,
          date: '16-01-2024',
          createdAt: { 
            toMillis: () => 1705315200000 // Earlier timestamp
          }
        })
      }
      
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback(mockDoc1)
          callback(mockDoc2)
        })
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      // Should be sorted by timestamp (oldest first), then reversed for display
      expect(result.current.assessments).toEqual([
        {
          id: '2', // Latest by timestamp appears first
          level: 'severe',
          confidence: 90,
          date: '15-01-2024',
        },
        {
          id: '1', // Earliest by timestamp
          level: 'mild',
          confidence: 60,
          date: '16-01-2024',
        }
      ])
    })

    it('should fallback to date string sorting when no timestamp', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockDoc1 = {
        id: 'doc1',
        data: () => ({
          stressLevel: 'mild',
          confidence: 65,
          date: '15-01-2024',
          // No createdAt timestamp
        })
      }
      
      const mockDoc2 = {
        id: 'doc2',
        data: () => ({
          stressLevel: 'moderate',
          confidence: 80,
          date: '14-01-2024',
          // No createdAt timestamp
        })
      }
      
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback(mockDoc1)
          callback(mockDoc2)
        })
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      // Should be sorted by date string (oldest first), then reversed
      expect(result.current.assessments).toEqual([
        {
          id: '2', // Latest date appears first after reverse
          level: 'mild',
          confidence: 65,
          date: '15-01-2024',
        },
        {
          id: '1', // Earlier date
          level: 'moderate',
          confidence: 80,
          date: '14-01-2024',
        }
      ])
    })

    it('should handle missing data fields gracefully', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockDoc1 = {
        id: 'doc1',
        data: () => ({
          // Missing stressLevel
          confidence: 65,
          date: '15-01-2024',
        })
      }
      
      const mockDoc2 = {
        id: 'doc2',
        data: () => ({
          stressLevel: 'moderate',
          // Missing confidence
          date: '16-01-2024',
        })
      }
      
      const mockDoc3 = {
        id: 'doc3',
        data: () => ({
          stressLevel: 'severe',
          confidence: 90,
          // Missing date
        })
      }
      
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback(mockDoc1)
          callback(mockDoc2)
          callback(mockDoc3)
        })
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      expect(result.current.assessments).toEqual([
        {
          id: '3',
          level: 'severe',
          confidence: 90,
          date: 'N/A',
        },
        {
          id: '2',
          level: 'moderate',
          confidence: 0,
          date: '16-01-2024',
        },
        {
          id: '1',
          level: 'unknown',
          confidence: 65,
          date: '15-01-2024',
        }
      ])
    })

    it('should handle empty query results', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockQuerySnapshot = {
        forEach: jest.fn()
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      expect(result.current.assessments).toEqual([])
      expect(result.current.loading).toBe(false)
    })

    it('should handle Firestore errors gracefully', async () => {
      const { result } = renderHook(() => useResultsStore())
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const error = new Error('Firestore error')
      mockGetDocs.mockRejectedValue(error)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching assessments:', error)
      expect(result.current.loading).toBe(false)
      expect(result.current.assessments).toEqual([])
      
      consoleSpy.mockRestore()
    })

    it('should set loading state correctly during fetch', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockQuerySnapshot = {
        forEach: jest.fn()
      }
      
      let resolvePromise: () => void
      const mockPromise = new Promise<typeof mockQuerySnapshot>((resolve) => {
        resolvePromise = () => resolve(mockQuerySnapshot)
      })
      mockGetDocs.mockReturnValue(mockPromise)
      
      // Start the fetch
      const fetchPromise = act(async () => {
        return result.current.fetchUserAssessments('user123')
      })
      
      // Should still be loading
      expect(result.current.loading).toBe(true)
      
      // Resolve the promise
      resolvePromise!()
      await fetchPromise
      
      // Should no longer be loading
      expect(result.current.loading).toBe(false)
    })

    it('should handle mixed timestamp and date sorting', async () => {
      const { result } = renderHook(() => useResultsStore())
      
      const mockDoc1 = {
        id: 'doc1',
        data: () => ({
          stressLevel: 'mild',
          confidence: 65,
          date: '15-01-2024',
          createdAt: { 
            toMillis: () => 1705315200000
          }
        })
      }
      
      const mockDoc2 = {
        id: 'doc2',
        data: () => ({
          stressLevel: 'moderate',
          confidence: 80,
          date: '16-01-2024',
          // No timestamp
        })
      }
      
      const mockDoc3 = {
        id: 'doc3',
        data: () => ({
          stressLevel: 'severe',
          confidence: 90,
          date: '17-01-2024',
          createdAt: { 
            toMillis: () => 1705488000000 // Later timestamp
          }
        })
      }
      
      const mockQuerySnapshot = {
        forEach: jest.fn((callback) => {
          callback(mockDoc1)
          callback(mockDoc2)
          callback(mockDoc3)
        })
      }
      
      mockGetDocs.mockResolvedValue(mockQuerySnapshot)
      
      await act(async () => {
        await result.current.fetchUserAssessments('user123')
      })
      
      // Should handle mixed sorting gracefully
      expect(result.current.assessments).toHaveLength(3)
      expect(result.current.loading).toBe(false)
    })
  })
})