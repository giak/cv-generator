import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import ValidationFeedback from '../ValidationFeedback.vue'

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
}) 