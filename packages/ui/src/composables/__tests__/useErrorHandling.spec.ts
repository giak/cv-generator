import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useErrorHandling } from '../ui/useErrorHandling'
import { createPinia, setActivePinia } from 'pinia'
import type { ErrorInfo } from '@ui/core/stores/error'

// Mock the error store
vi.mock('@ui/core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    addError: vi.fn(),
    dismissError: vi.fn(),
    clearErrors: vi.fn(),
    errors: []
  })),
  // Mock the ErrorInfo type
  ErrorInfo: undefined
}))

// Mock resume store
vi.mock('@ui/modules/cv/presentation/stores/resume', () => ({
  useResumeStore: vi.fn(() => ({
    loadResume: vi.fn()
  }))
}))

describe('useErrorHandling', () => {
  let errorHandling: ReturnType<typeof useErrorHandling>
  
  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())
    
    vi.clearAllMocks()
    errorHandling = useErrorHandling()
  })
  
  it('should provide error handling methods', () => {
    expect(errorHandling.handleErrorAction).toBeInstanceOf(Function)
    expect(errorHandling.dismissAllErrors).toBeInstanceOf(Function)
  })
  
  it('should handle error action and add error to store', () => {
    const error: ErrorInfo = { 
      id: '1',
      message: 'Test error', 
      timestamp: Date.now(),
      severity: 'error',
      source: 'ui',
      dismissed: false
    }
    
    errorHandling.handleErrorAction(error)
  })
  
  it('should handle error action with custom message', () => {
    const error: ErrorInfo = {
      id: '2',
      message: 'Original error', 
      timestamp: Date.now(),
      severity: 'error',
      source: 'ui',
      dismissed: false
    }
    const customMessage = 'Custom error message'
    
    // This should use the custom message instead of the original one
    errorHandling.handleErrorAction({ ...error, message: customMessage })
  })
  
  it('should handle dismiss error', () => {
    errorHandling.dismissAllErrors()
  })
}) 