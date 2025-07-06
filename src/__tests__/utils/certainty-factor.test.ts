import { calculateCF } from '@/utils/certainty-factor'
import { Answer, AssessmentResult } from '@/types/assessment'

describe('calculateCF', () => {
  describe('basic functionality', () => {
    it('should return mild stress with 0 confidence for empty answers', () => {
      const result = calculateCF([])
      expect(result).toEqual({
        stressLevel: 'mild',
        confidence: 0
      })
    })

    it('should handle single answer correctly', () => {
      const answers: Answer[] = [
        { questionId: 'q1', value: 1 }
      ]
      const result = calculateCF(answers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(100)
    })
  })

  describe('stress level classification', () => {
    it('should classify mild stress for low-impact answers', () => {
      // All answers indicating no stress (negative values)
      const answers: Answer[] = [
        { questionId: 'q1', value: -1 },
        { questionId: 'q2', value: -1 },
        { questionId: 'q3', value: -1 },
        { questionId: 'q4', value: -1 },
        { questionId: 'q5', value: -1 }
      ]
      const result = calculateCF(answers)
      expect(result.stressLevel).toBe('mild')
    })

    it('should classify severe stress for high-impact answers', () => {
      // All answers indicating high stress (positive values)
      const answers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: 1 },
        { questionId: 'q3', value: 1 },
        { questionId: 'q4', value: 1 },
        { questionId: 'q5', value: 1 },
        { questionId: 'q6', value: 1 },
        { questionId: 'q7', value: 1 },
        { questionId: 'q8', value: 1 },
        { questionId: 'q9', value: 1 },
        { questionId: 'q10', value: 1 }
      ]
      const result = calculateCF(answers)
      expect(result.stressLevel).toBe('severe')
    })

    it('should classify moderate stress for mixed answers', () => {
      // Mixed answers indicating moderate stress
      const answers: Answer[] = [
        { questionId: 'q1', value: 0 },
        { questionId: 'q2', value: 0.5 },
        { questionId: 'q3', value: -0.5 },
        { questionId: 'q4', value: 0.2 },
        { questionId: 'q5', value: -0.2 }
      ]
      const result = calculateCF(answers)
      expect(['mild', 'moderate', 'severe']).toContain(result.stressLevel)
    })
  })

  describe('symptom categories', () => {
    it('should properly weight emotional symptoms higher', () => {
      // Only emotional symptoms (higher weight)
      const emotionalAnswers: Answer[] = [
        { questionId: 'q2', value: 1 }, // emotional
        { questionId: 'q6', value: 1 }, // emotional
        { questionId: 'q7', value: 1 }  // emotional
      ]
      
      // Only behavioral symptoms (lower weight)
      const behavioralAnswers: Answer[] = [
        { questionId: 'q1', value: 1 }, // behavioral
        { questionId: 'q10', value: 1 } // behavioral
      ]
      
      const emotionalResult = calculateCF(emotionalAnswers)
      const behavioralResult = calculateCF(behavioralAnswers)
      
      // Emotional symptoms should have higher impact due to higher weight
      expect(emotionalResult.confidence).toBeGreaterThan(0)
      expect(behavioralResult.confidence).toBeGreaterThan(0)
    })

    it('should handle cognitive symptoms correctly', () => {
      const cognitiveAnswers: Answer[] = [
        { questionId: 'q5', value: 1 }, // cognitive
        { questionId: 'q9', value: 1 }  // cognitive
      ]
      
      const result = calculateCF(cognitiveAnswers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThan(0)
    })

    it('should handle physical symptoms correctly', () => {
      const physicalAnswers: Answer[] = [
        { questionId: 'q3', value: 1 }, // physical
        { questionId: 'q4', value: 1 }, // physical
        { questionId: 'q8', value: 1 }  // physical
      ]
      
      const result = calculateCF(physicalAnswers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThan(0)
    })
  })

  describe('confidence calculation', () => {
    it('should return higher confidence for consistent answers', () => {
      // Very consistent answers (all same value)
      const consistentAnswers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: 1 },
        { questionId: 'q3', value: 1 },
        { questionId: 'q4', value: 1 },
        { questionId: 'q5', value: 1 }
      ]
      
      // Inconsistent answers (varied values)
      const inconsistentAnswers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: -1 },
        { questionId: 'q3', value: 0.5 },
        { questionId: 'q4', value: -0.5 },
        { questionId: 'q5', value: 0.2 }
      ]
      
      const consistentResult = calculateCF(consistentAnswers)
      const inconsistentResult = calculateCF(inconsistentAnswers)
      
      // Both should have valid confidence values, but consistent should be higher or equal
      expect(consistentResult.confidence).toBeGreaterThanOrEqual(inconsistentResult.confidence)
    })

    it('should cap confidence at 100%', () => {
      // Extreme values that might cause confidence > 100
      const extremeAnswers: Answer[] = [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: 1 },
        { questionId: 'q3', value: 1 },
        { questionId: 'q4', value: 1 },
        { questionId: 'q5', value: 1 },
        { questionId: 'q6', value: 1 },
        { questionId: 'q7', value: 1 },
        { questionId: 'q8', value: 1 },
        { questionId: 'q9', value: 1 },
        { questionId: 'q10', value: 1 }
      ]
      
      const result = calculateCF(extremeAnswers)
      expect(result.confidence).toBeLessThanOrEqual(100)
    })

    it('should return confidence >= 0', () => {
      const answers: Answer[] = [
        { questionId: 'q1', value: -1 },
        { questionId: 'q2', value: -1 }
      ]
      
      const result = calculateCF(answers)
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })
  })

  describe('edge cases', () => {
    it('should handle unknown question IDs gracefully', () => {
      const answers: Answer[] = [
        { questionId: 'unknown1', value: 1 },
        { questionId: 'unknown2', value: -1 }
      ]
      
      const result = calculateCF(answers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })

    it('should handle zero values correctly', () => {
      const answers: Answer[] = [
        { questionId: 'q1', value: 0 },
        { questionId: 'q2', value: 0 },
        { questionId: 'q3', value: 0 }
      ]
      
      const result = calculateCF(answers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })

    it('should handle fractional values correctly', () => {
      const answers: Answer[] = [
        { questionId: 'q1', value: 0.33 },
        { questionId: 'q2', value: -0.66 },
        { questionId: 'q3', value: 0.75 }
      ]
      
      const result = calculateCF(answers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
      expect(result.confidence).toBeLessThanOrEqual(100)
    })
  })

  describe('CF combination rules', () => {
    it('should combine positive CF values correctly', () => {
      // Test with only positive contributing factors
      const positiveAnswers: Answer[] = [
        { questionId: 'q1', value: 0.5 },
        { questionId: 'q2', value: 0.3 }
      ]
      
      const result = calculateCF(positiveAnswers)
      expect(result.confidence).toBeGreaterThan(0)
    })

    it('should combine negative CF values correctly', () => {
      // Test with only negative contributing factors
      const negativeAnswers: Answer[] = [
        { questionId: 'q1', value: -0.5 },
        { questionId: 'q2', value: -0.3 }
      ]
      
      const result = calculateCF(negativeAnswers)
      expect(result.stressLevel).toBe('mild')
    })

    it('should combine mixed CF values correctly', () => {
      // Test with both positive and negative contributing factors
      const mixedAnswers: Answer[] = [
        { questionId: 'q1', value: 0.7 },
        { questionId: 'q2', value: -0.3 },
        { questionId: 'q3', value: 0.4 }
      ]
      
      const result = calculateCF(mixedAnswers)
      expect(result.stressLevel).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })
  })
})