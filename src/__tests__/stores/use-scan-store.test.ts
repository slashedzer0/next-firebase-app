import { act, renderHook } from '@testing-library/react'
import { useScanStore } from '@/stores/use-scan-store'

// Mock the utilities
jest.mock('@/utils', () => ({
  calculateCF: jest.fn(),
  saveAssessmentResult: jest.fn(),
  shuffleArray: jest.fn((arr) => [...arr].reverse()), // Mock shuffle to return reversed array for predictability
}))

// Mock the questions
jest.mock('@/types/questions', () => ({
  scanQuestions: [
    { id: 'q1', text: 'Question 1' },
    { id: 'q2', text: 'Question 2' },
    { id: 'q3', text: 'Question 3' },
  ],
}))

describe('useScanStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useScanStore.setState({
      step: 'intro',
      currentQuestion: 0,
      answers: [],
      result: null,
      isSaving: false,
      questions: [],
      selectedOption: '',
    })
    
    jest.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useScanStore())
      
      expect(result.current.step).toBe('intro')
      expect(result.current.currentQuestion).toBe(0)
      expect(result.current.answers).toEqual([])
      expect(result.current.result).toBeNull()
      expect(result.current.isSaving).toBe(false)
      expect(result.current.questions).toEqual([])
      expect(result.current.selectedOption).toBe('')
    })
  })

  describe('setters', () => {
    it('should update step', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setStep('questions')
      })
      
      expect(result.current.step).toBe('questions')
    })

    it('should update current question', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setCurrentQuestion(2)
      })
      
      expect(result.current.currentQuestion).toBe(2)
    })

    it('should update answers', () => {
      const { result } = renderHook(() => useScanStore())
      const newAnswers = [{ questionId: 'q1', value: 1 }]
      
      act(() => {
        result.current.setAnswers(newAnswers)
      })
      
      expect(result.current.answers).toEqual(newAnswers)
    })

    it('should update result', () => {
      const { result } = renderHook(() => useScanStore())
      const newResult = { stressLevel: 'moderate' as const, confidence: 75 }
      
      act(() => {
        result.current.setResult(newResult)
      })
      
      expect(result.current.result).toEqual(newResult)
    })

    it('should update saving status', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setIsSaving(true)
      })
      
      expect(result.current.isSaving).toBe(true)
    })

    it('should update selected option', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setSelectedOption('option1')
      })
      
      expect(result.current.selectedOption).toBe('option1')
    })
  })

  describe('addAnswer', () => {
    it('should add answer at current question index', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setCurrentQuestion(1)
        result.current.addAnswer('q2', 1)
      })
      
      expect(result.current.answers).toEqual([
        undefined,
        { questionId: 'q2', value: 1 }
      ])
    })

    it('should update existing answer', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setAnswers([{ questionId: 'q1', value: 0 }])
        result.current.setCurrentQuestion(0)
        result.current.addAnswer('q1', 1)
      })
      
      expect(result.current.answers).toEqual([
        { questionId: 'q1', value: 1 }
      ])
    })
  })

  describe('shuffleQuestions', () => {
    it('should shuffle questions using shuffleArray utility', () => {
      const { result } = renderHook(() => useScanStore())
      const { shuffleArray } = require('@/utils')
      
      act(() => {
        result.current.shuffleQuestions()
      })
      
      expect(shuffleArray).toHaveBeenCalledWith([
        { id: 'q1', text: 'Question 1' },
        { id: 'q2', text: 'Question 2' },
        { id: 'q3', text: 'Question 3' },
      ])
      
      // Our mock returns reversed array
      expect(result.current.questions).toEqual([
        { id: 'q3', text: 'Question 3' },
        { id: 'q2', text: 'Question 2' },
        { id: 'q1', text: 'Question 1' },
      ])
    })
  })

  describe('handleStart', () => {
    it('should initialize scan session', () => {
      const { result } = renderHook(() => useScanStore())
      const { shuffleArray } = require('@/utils')
      
      act(() => {
        result.current.handleStart()
      })
      
      expect(result.current.step).toBe('questions')
      expect(result.current.currentQuestion).toBe(0)
      expect(result.current.answers).toEqual([])
      expect(shuffleArray).toHaveBeenCalled()
      expect(result.current.questions).toEqual([
        { id: 'q3', text: 'Question 3' },
        { id: 'q2', text: 'Question 2' },
        { id: 'q1', text: 'Question 1' },
      ])
    })
  })

  describe('handleAnswer', () => {
    beforeEach(() => {
      const { calculateCF } = require('@/utils')
      calculateCF.mockReturnValue({ stressLevel: 'moderate', confidence: 75 })
    })

    it('should add answer and move to next question', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        // Set questions directly on state since there's no setQuestions method
        useScanStore.setState({
          questions: [
            { id: 'q1', text: 'Question 1' },
            { id: 'q2', text: 'Question 2' },
          ],
          currentQuestion: 0
        })
        result.current.handleAnswer(1)
      })
      
      expect(result.current.answers).toEqual([
        { questionId: 'q1', value: 1 }
      ])
      expect(result.current.currentQuestion).toBe(1)
    })

    it('should handle last question and calculate result', (done) => {
      const { result } = renderHook(() => useScanStore())
      const { calculateCF } = require('@/utils')
      
      act(() => {
        useScanStore.setState({
          questions: [{ id: 'q1', text: 'Question 1' }],
          currentQuestion: 0
        })
        result.current.handleAnswer(1)
      })
      
      expect(result.current.step).toBe('loading')
      expect(result.current.answers).toEqual([
        { questionId: 'q1', value: 1 }
      ])
      
      // Wait for setTimeout to complete
      setTimeout(() => {
        const currentState = useScanStore.getState()
        expect(calculateCF).toHaveBeenCalledWith([
          { questionId: 'q1', value: 1 }
        ])
        expect(currentState.result).toEqual({ stressLevel: 'moderate', confidence: 75 })
        expect(currentState.step).toBe('results')
        done()
      }, 3100) // LOADING_DURATION is 3000ms
    })

    it('should handle answer update for existing question', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        useScanStore.setState({
          questions: [
            { id: 'q1', text: 'Question 1' },
            { id: 'q2', text: 'Question 2' },
          ],
          answers: [{ questionId: 'q1', value: 0 }],
          currentQuestion: 0
        })
        result.current.handleAnswer(1)
      })
      
      expect(result.current.answers).toEqual([
        { questionId: 'q1', value: 1 }
      ])
      expect(result.current.currentQuestion).toBe(1)
    })
  })

  describe('handleBack', () => {
    it('should go to previous question', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setCurrentQuestion(2)
        result.current.handleBack()
      })
      
      expect(result.current.currentQuestion).toBe(1)
    })

    it('should go to intro when at first question', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setCurrentQuestion(0)
        result.current.setStep('questions')
        result.current.handleBack()
      })
      
      expect(result.current.step).toBe('intro')
      expect(result.current.currentQuestion).toBe(0)
    })

    it('should not go below zero', () => {
      const { result } = renderHook(() => useScanStore())
      
      act(() => {
        result.current.setCurrentQuestion(0)
        result.current.setStep('intro')
        result.current.handleBack()
      })
      
      expect(result.current.step).toBe('intro')
      expect(result.current.currentQuestion).toBe(0)
    })
  })

  describe('handleSaveResult', () => {
    beforeEach(() => {
      const { saveAssessmentResult } = require('@/utils')
      saveAssessmentResult.mockResolvedValue('doc-id')
    })

    it('should save result successfully', async () => {
      const { result } = renderHook(() => useScanStore())
      const { saveAssessmentResult } = require('@/utils')
      const onSuccess = jest.fn()
      
      act(() => {
        result.current.setResult({ stressLevel: 'moderate', confidence: 75 })
        result.current.setAnswers([{ questionId: 'q1', value: 1 }])
      })
      
      await act(async () => {
        await result.current.handleSaveResult('user123', onSuccess)
      })
      
      expect(saveAssessmentResult).toHaveBeenCalledWith(
        'user123',
        [{ questionId: 'q1', value: 1 }],
        { stressLevel: 'moderate', confidence: 75 }
      )
      expect(onSuccess).toHaveBeenCalled()
      expect(result.current.isSaving).toBe(false)
    })

    it('should handle save error', async () => {
      const { result } = renderHook(() => useScanStore())
      const { saveAssessmentResult } = require('@/utils')
      const error = new Error('Save failed')
      saveAssessmentResult.mockRejectedValue(error)
      
      act(() => {
        result.current.setResult({ stressLevel: 'moderate', confidence: 75 })
        result.current.setAnswers([{ questionId: 'q1', value: 1 }])
      })
      
      await expect(async () => {
        await act(async () => {
          await result.current.handleSaveResult('user123')
        })
      }).rejects.toThrow('Save failed')
      
      expect(result.current.isSaving).toBe(false)
    })

    it('should return early if no result', async () => {
      const { result } = renderHook(() => useScanStore())
      const { saveAssessmentResult } = require('@/utils')
      
      await act(async () => {
        await result.current.handleSaveResult('user123')
      })
      
      expect(saveAssessmentResult).not.toHaveBeenCalled()
      expect(result.current.isSaving).toBe(false)
    })

    it('should set saving state during operation', async () => {
      const { result } = renderHook(() => useScanStore())
      const { saveAssessmentResult } = require('@/utils')
      
      act(() => {
        result.current.setResult({ stressLevel: 'moderate', confidence: 75 })
        result.current.setAnswers([{ questionId: 'q1', value: 1 }])
      })
      
      // Start save operation
      const savePromise = act(async () => {
        return result.current.handleSaveResult('user123')
      })
      
      // Check that saving is true during operation
      expect(result.current.isSaving).toBe(true)
      
      await savePromise
      
      // Check that saving is false after completion
      expect(result.current.isSaving).toBe(false)
    })
  })
})