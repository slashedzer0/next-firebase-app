import { shuffleArray } from '@/utils/shuffle'

describe('shuffleArray', () => {
  describe('basic functionality', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result).toHaveLength(input.length)
    })

    it('should not modify the original array', () => {
      const input = [1, 2, 3, 4, 5]
      const original = [...input]
      shuffleArray(input)
      expect(input).toEqual(original)
    })

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      
      // Check that all original elements are present
      input.forEach(element => {
        expect(result).toContain(element)
      })
    })

    it('should return a new array instance', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result).not.toBe(input)
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const input: number[] = []
      const result = shuffleArray(input)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should handle single element array', () => {
      const input = [42]
      const result = shuffleArray(input)
      expect(result).toEqual([42])
      expect(result).toHaveLength(1)
    })

    it('should handle two element array', () => {
      const input = [1, 2]
      const result = shuffleArray(input)
      expect(result).toHaveLength(2)
      expect(result).toContain(1)
      expect(result).toContain(2)
    })
  })

  describe('different data types', () => {
    it('should work with strings', () => {
      const input = ['apple', 'banana', 'cherry', 'date']
      const result = shuffleArray(input)
      
      expect(result).toHaveLength(input.length)
      input.forEach(fruit => {
        expect(result).toContain(fruit)
      })
    })

    it('should work with objects', () => {
      const input = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]
      const result = shuffleArray(input)
      
      expect(result).toHaveLength(input.length)
      input.forEach(person => {
        expect(result).toContainEqual(person)
      })
    })

    it('should work with mixed types', () => {
      const input = [1, 'hello', { foo: 'bar' }, true, null]
      const result = shuffleArray(input)
      
      expect(result).toHaveLength(input.length)
      input.forEach(element => {
        expect(result).toContain(element)
      })
    })
  })

  describe('randomness behavior', () => {
    it('should potentially change order (statistical test)', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      let orderChanged = false
      
      // Run the shuffle multiple times to statistically verify randomness
      for (let i = 0; i < 50; i++) {
        const result = shuffleArray(input)
        if (!arraysEqual(input, result)) {
          orderChanged = true
          break
        }
      }
      
      // With 10 elements, the probability of maintaining original order
      // in 50 attempts is extremely low (1/10!)^50
      expect(orderChanged).toBe(true)
    })

    it('should produce different results on multiple calls (statistical test)', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const results = new Set()
      
      // Generate multiple shuffles and check for variety
      for (let i = 0; i < 20; i++) {
        const result = shuffleArray(input)
        results.add(JSON.stringify(result))
      }
      
      // Should have multiple different arrangements
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('Fisher-Yates algorithm properties', () => {
    it('should not have any bias in position distribution (basic check)', () => {
      const input = [1, 2, 3, 4, 5]
      const positionCounts = new Map()
      
      // Initialize position tracking
      input.forEach((_, index) => {
        positionCounts.set(index, new Map())
        input.forEach(value => {
          positionCounts.get(index).set(value, 0)
        })
      })
      
      // Run multiple shuffles
      for (let i = 0; i < 100; i++) {
        const result = shuffleArray(input)
        result.forEach((value, position) => {
          const current = positionCounts.get(position).get(value)
          positionCounts.get(position).set(value, current + 1)
        })
      }
      
      // Each element should appear in each position at least once
      // (this is a weak test, but validates basic randomness)
      positionCounts.forEach(positionMap => {
        positionMap.forEach(count => {
          expect(count).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('large arrays', () => {
    it('should handle large arrays efficiently', () => {
      const input = Array.from({ length: 1000 }, (_, i) => i)
      const start = Date.now()
      const result = shuffleArray(input)
      const end = Date.now()
      
      expect(result).toHaveLength(1000)
      expect(end - start).toBeLessThan(100) // Should complete in less than 100ms
      
      // Verify all elements are present
      const sortedInput = [...input].sort((a, b) => a - b)
      const sortedResult = [...result].sort((a, b) => a - b)
      expect(sortedResult).toEqual(sortedInput)
    })
  })
})

// Helper function to check if two arrays are equal in order
function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}