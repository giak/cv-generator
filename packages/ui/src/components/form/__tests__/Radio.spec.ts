import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import Radio from '../Radio.vue'

// Mock pour useErrorStore
vi.mock('../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    hasFieldError: vi.fn((fieldPath) => fieldPath === 'test.field'),
    getFieldError: vi.fn((fieldPath) => fieldPath === 'test.field' 
      ? { message: 'Error from store', field: 'test.field' } 
      : undefined)
  }))
}))

describe('Radio', () => {
  it('renders properly with default props', () => {
    const { getByRole } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: ''
      }
    })
    
    const radio = getByRole('radio')
    expect(radio).toBeInTheDocument()
    expect(radio).not.toBeChecked()
  })
  
  it('renders with checked state when modelValue matches value', () => {
    const { getByRole } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: 'option1'
      }
    })
    
    const radio = getByRole('radio')
    expect(radio).toBeChecked()
  })
  
  it('emits update:modelValue event with correct value when clicked', async () => {
    const { getByRole, emitted } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: ''
      }
    })
    
    const radio = getByRole('radio')
    await fireEvent.click(radio)
    
    expect(emitted()).toHaveProperty('update:modelValue')
    expect(emitted()['update:modelValue'][0]).toEqual(['option1'])
  })
  
  it('renders label text correctly', () => {
    const { getByText } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: '',
        label: 'Test Label'
      }
    })
    
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  
  it('renders help text when provided', () => {
    const { getByText } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: '',
        helpText: 'This is a help text'
      }
    })
    
    expect(getByText('This is a help text')).toBeInTheDocument()
  })
  
  it('renders error message when error prop is provided', () => {
    const { getByText } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: '',
        error: 'This field is required'
      }
    })
    
    expect(getByText('This field is required')).toBeInTheDocument()
  })
  
  it('adds proper data-test attribute', () => {
    const { getByTestId } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: '',
        testId: 'custom-test-id'
      }
    })
    
    expect(getByTestId('custom-test-id')).toBeInTheDocument()
  })
  
  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(Radio, {
      props: {
        name: 'test-radio',
        value: 'option1',
        modelValue: '',
        disabled: true
      }
    })
    
    const radio = getByRole('radio')
    expect(radio).toBeDisabled()
  })
}) 