import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import Checkbox from '../Checkbox.vue'

// Mock pour useErrorStore
vi.mock('../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    hasFieldError: vi.fn((fieldPath) => fieldPath === 'test.field'),
    getFieldError: vi.fn((fieldPath) => fieldPath === 'test.field' 
      ? { message: 'Error from store', field: 'test.field' } 
      : undefined)
  }))
}))

describe('Checkbox', () => {
  it('renders properly with default props', () => {
    const { getByRole } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false
      }
    })
    
    const checkbox = getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })
  
  it('renders with checked state when modelValue is true', () => {
    const { getByRole } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: true
      }
    })
    
    const checkbox = getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })
  
  it('emits update:modelValue event when clicked', async () => {
    const { getByRole, emitted } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false
      }
    })
    
    const checkbox = getByRole('checkbox')
    await fireEvent.click(checkbox)
    
    expect(emitted()).toHaveProperty('update:modelValue')
    expect(emitted()['update:modelValue'][0]).toEqual([true])
  })
  
  it('renders label text correctly', () => {
    const { getByText } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false,
        label: 'Test Label'
      }
    })
    
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  
  it('renders help text when provided', () => {
    const { getByText } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false,
        helpText: 'This is a help text'
      }
    })
    
    expect(getByText('This is a help text')).toBeInTheDocument()
  })
  
  it('renders error message when error prop is provided', () => {
    const { getByText } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false,
        error: 'This field is required'
      }
    })
    
    expect(getByText('This field is required')).toBeInTheDocument()
  })
  
  it('adds proper data-test attribute', () => {
    const { getByTestId } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false,
        testId: 'custom-test-id'
      }
    })
    
    expect(getByTestId('custom-test-id')).toBeInTheDocument()
  })
  
  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(Checkbox, {
      props: {
        name: 'test-checkbox',
        modelValue: false,
        disabled: true
      }
    })
    
    const checkbox = getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })
}) 