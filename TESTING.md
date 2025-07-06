# Testing Guide

This document provides comprehensive information about the testing setup and practices for the Next.js Firebase application.

## Overview

The project uses **Jest** as the testing framework with **React Testing Library** for component testing and **TypeScript** support. The testing infrastructure covers:

- ✅ Utility functions
- ✅ Zustand stores (state management)
- ✅ Firebase integration functions
- ✅ Error handling
- ✅ Business logic (e.g., certainty factor calculations)

## Testing Infrastructure

### Framework Stack

- **Jest**: Primary testing framework
- **React Testing Library**: For React component and hook testing
- **@testing-library/jest-dom**: Additional DOM matchers
- **TypeScript**: Full TypeScript support in tests

### Configuration Files

- `jest.config.js`: Main Jest configuration
- `jest.setup.js`: Test environment setup and global mocks
- `package.json`: Test scripts and dependencies

## Running Tests

### Available Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test File Patterns

Tests are located in `src/__tests__/` directory following this structure:

```
src/__tests__/
├── utils/           # Utility function tests
├── stores/          # Zustand store tests
├── components/      # React component tests (future)
└── mocks/           # Mock files and test utilities
```

## Test Coverage

Current test coverage focuses on critical business logic:

### Utilities (High Coverage)
- ✅ `certainty-factor.ts` - Assessment calculation logic
- ✅ `shuffle.ts` - Array randomization
- ✅ `error-handler.ts` - Error categorization and handling
- ✅ `save-assessment.ts` - Firebase data persistence
- ✅ `username.ts` - Username generation logic

### Stores (Partial Coverage)
- ✅ `use-scan-store.ts` - Assessment flow state management
- ✅ `use-results-store.ts` - Results fetching and display
- 🔄 `use-auth-store.ts` - Authentication state (planned)
- 🔄 `use-admin-store.ts` - Admin functionality (planned)

## Testing Patterns

### Utility Function Testing

```typescript
import { utilityFunction } from '@/utils/utility'

describe('utilityFunction', () => {
  describe('basic functionality', () => {
    it('should handle normal input', () => {
      const result = utilityFunction('input')
      expect(result).toBe('expected')
    })
  })

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const result = utilityFunction('')
      expect(result).toBe('')
    })
  })

  describe('error handling', () => {
    it('should throw on invalid input', () => {
      expect(() => utilityFunction(null)).toThrow()
    })
  })
})
```

### Zustand Store Testing

```typescript
import { renderHook, act } from '@testing-library/react'
import { useStore } from '@/stores/use-store'

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState({/* initial state */})
  })

  it('should update state correctly', () => {
    const { result } = renderHook(() => useStore())
    
    act(() => {
      result.current.updateFunction('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })
})
```

### Async Function Testing

```typescript
it('should handle async operations', async () => {
  const mockFunction = jest.fn().mockResolvedValue('result')
  
  await act(async () => {
    await result.current.asyncFunction()
  })
  
  expect(mockFunction).toHaveBeenCalled()
})
```

## Mocking Strategy

### Firebase Mocking

Firebase services are mocked at the module level:

```javascript
// jest.setup.js
jest.mock('@/services/firebase', () => ({
  db: {},
  auth: { currentUser: null },
}))
```

### External Dependencies

- **Next.js Router**: Mocked in `jest.setup.js`
- **Internationalization**: Mocked with simple key return
- **Toast Notifications**: Mocked to prevent side effects
- **Firebase Functions**: Mocked per test file as needed

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Use clear, behavior-focused descriptions
2. **Grouped Tests**: Use `describe` blocks to group related tests
3. **Setup/Teardown**: Use `beforeEach`/`afterEach` for consistent state
4. **Isolated Tests**: Each test should be independent

### Test Structure

```typescript
describe('ComponentOrFunction', () => {
  // Setup
  beforeEach(() => {
    // Reset state, clear mocks
  })

  describe('feature group', () => {
    it('should behave correctly when conditions are met', () => {
      // Arrange
      // Act  
      // Assert
    })
  })
})
```

### Coverage Goals

- **Utilities**: Aim for 90%+ coverage
- **Stores**: Focus on business logic, 80%+ coverage
- **Components**: Test user interactions and state changes
- **Error Paths**: Ensure error handling is tested

## Firebase Testing

### Mock Strategy

Firebase functions are mocked to avoid actual database calls:

```typescript
jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  // ... other functions
}))
```

### Testing Firebase Integration

```typescript
it('should save data to Firebase', async () => {
  const mockAddDoc = require('firebase/firestore').addDoc
  mockAddDoc.mockResolvedValue({ id: 'doc-id' })
  
  const result = await saveFunction(data)
  
  expect(mockAddDoc).toHaveBeenCalledWith(
    expect.any(Object),
    expect.objectContaining(data)
  )
  expect(result).toBe('doc-id')
})
```

## Common Testing Scenarios

### 1. State Management

Testing Zustand stores for proper state updates and side effects.

### 2. Data Transformation

Testing utility functions that process and transform data.

### 3. Error Boundaries

Testing error handling and user-friendly error messages.

### 4. Async Operations

Testing Firebase operations, API calls, and loading states.

### 5. Business Logic

Testing domain-specific calculations and algorithms.

## Debugging Tests

### Common Issues

1. **Act Warnings**: Wrap state updates in `act()`
2. **Async Timing**: Use proper async/await patterns
3. **Mock Persistence**: Clear mocks between tests
4. **State Isolation**: Reset store state in `beforeEach`

### Debugging Commands

```bash
# Run specific test file
npm test -- certainty-factor.test.ts

# Run tests with verbose output
npm test -- --verbose

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Future Improvements

### Planned Additions

- [ ] Component testing with React Testing Library
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance testing
- [ ] API integration tests

### Testing Tools to Consider

- **MSW (Mock Service Worker)**: For API mocking
- **Playwright**: For E2E testing
- **Storybook**: For component testing
- **Testing Playground**: For selector debugging

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Test edge cases** and error conditions
3. **Update this documentation** if adding new patterns
4. **Maintain coverage** standards
5. **Review test quality** in PR reviews

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Zustand Testing](https://github.com/pmndrs/zustand#testing)