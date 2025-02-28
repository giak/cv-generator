import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import Switch from '../Switch.vue'

// Mock pour useErrorStore
vi.mock('../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    hasFieldError: vi.fn((fieldPath) => fieldPath === 'test.field'),
    getFieldError: vi.fn((fieldPath) => fieldPath === 'test.field' 
      ? { message: 'Error from store', field: 'test.field' } 
      : undefined)
  }))
}))

describe('Switch', () => {
  it('renders properly with default props', () => {
    const { getByRole } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false
      }
    })
    
    const switchInput = getByRole('checkbox')
    expect(switchInput).toBeInTheDocument()
    expect(switchInput).not.toBeChecked()
  })
  
  it('renders with checked state when modelValue is true', () => {
    const { getByRole } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: true
      }
    })
    
    const switchInput = getByRole('checkbox')
    expect(switchInput).toBeChecked()
  })
  
  it('emits update:modelValue event when clicked', async () => {
    const { getByRole, emitted } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false
      }
    })
    
    const switchInput = getByRole('checkbox')
    await fireEvent.click(switchInput)
    
    expect(emitted()).toHaveProperty('update:modelValue')
    expect(emitted()['update:modelValue'][0]).toEqual([true])
  })
  
  it('renders label text correctly', () => {
    const { getByText } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false,
        label: 'Test Label'
      }
    })
    
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  
  it('renders help text when provided', () => {
    const { getByText } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false,
        helpText: 'This is a help text'
      }
    })
    
    expect(getByText('This is a help text')).toBeInTheDocument()
  })
  
  it('renders error message when error prop is provided', () => {
    const { getByText } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false,
        error: 'This field is required'
      }
    })
    
    expect(getByText('This field is required')).toBeInTheDocument()
  })
  
  it('adds proper data-test attribute', () => {
    const { getByTestId } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false,
        testId: 'custom-test-id'
      }
    })
    
    expect(getByTestId('custom-test-id')).toBeInTheDocument()
  })
  
  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(Switch, {
      props: {
        name: 'test-switch',
        modelValue: false,
        disabled: true
      }
    })
    
    const switchInput = getByRole('checkbox')
    expect(switchInput).toBeDisabled()
  })
}) 