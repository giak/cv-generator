import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import ValidationFeedback from '../ValidationFeedback.vue'

// Mock pour useErrorStore
vi.mock('../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    hasFieldError: vi.fn((fieldPath) => fieldPath === 'test.field'),
    getFieldError: vi.fn((fieldPath) => fieldPath === 'test.field' 
      ? { message: 'Error from store', field: 'test.field' } 
      : undefined)
  }))
}))

describe('ValidationFeedback', () => {
  it('should not render when no error is present', () => {
    const { queryByRole } = render(ValidationFeedback, {
      props: {
        error: ''
      }
    })

    expect(queryByRole('alert')).toBeNull()
  })

  it('should render error message with error styling', () => {
    const { getByText, container } = render(ValidationFeedback, {
      props: {
        error: 'This field is required'
      }
    })

    const errorElement = getByText('This field is required')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveClass('text-red-500')
  })

  it('should render with custom styling', () => {
    const { getByText } = render(ValidationFeedback, {
      props: {
        error: 'Custom error',
        class: 'custom-class'
      }
    })

    const errorElement = getByText('Custom error')
    expect(errorElement).toHaveClass('custom-class')
  })

  it('should be accessible', () => {
    const { container } = render(ValidationFeedback, {
      props: {
        error: 'Accessibility error'
      }
    })

    const errorElement = container.firstChild
    expect(errorElement).toHaveAttribute('role', 'alert')
    expect(errorElement).toHaveAttribute('aria-live', 'polite')
  })
  
  it('should use data-test attribute based on fieldPath', () => {
    const { container } = render(ValidationFeedback, {
      props: {
        error: 'Field error',
        fieldPath: 'user.email'
      }
    })
    
    const errorElement = container.firstChild
    expect(errorElement).toHaveAttribute('data-test', 'user.email-error')
  })
  
  it('should get error from store when useErrorStore is true and fieldPath is provided', () => {
    const { getByText } = render(ValidationFeedback, {
      global: {
        plugins: [createTestingPinia()]
      },
      props: {
        useErrorStore: true,
        fieldPath: 'test.field'
      }
    })
    
    expect(getByText('Error from store')).toBeInTheDocument()
  })
  
  it('should use prop error when store has no error for field', () => {
    const { getByText } = render(ValidationFeedback, {
      global: {
        plugins: [createTestingPinia()]
      },
      props: {
        useErrorStore: true,
        fieldPath: 'other.field',
        error: 'Fallback error'
      }
    })
    
    expect(getByText('Fallback error')).toBeInTheDocument()
  })
}) 