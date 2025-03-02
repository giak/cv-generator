import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkForm from '../WorkForm.vue'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'

// Mock composables
vi.mock('@ui/modules/cv/presentation/composables/useCVFieldValidation', () => ({
  useFieldValidation: () => ({
    errors: {},
    validateField: vi.fn(),
    validateForm: vi.fn().mockReturnValue(true)
  })
}))

vi.mock('@ui/modules/cv/presentation/composables/useModelUpdate', () => ({
  useModelUpdate: () => ({
    updateField: vi.fn()
  })
}))

// Mock Form and FormField components
vi.mock('@ui/components/shared/form/Form.vue', () => ({
  default: {
    template: '<div class="form"><slot/><slot name="actions"/></div>',
    props: ['loading', 'title', 'subtitle']
  }
}))

vi.mock('@ui/components/shared/form/FormField.vue', () => ({
  default: {
    template: '<div class="form-field"><slot/></div>',
    props: ['name', 'label', 'modelValue', 'error']
  }
}))

describe('WorkForm', () => {
  let defaultProps: { modelValue: WorkInterface, loading?: boolean, isNew?: boolean }
  
  beforeEach(() => {
    defaultProps = {
      modelValue: {
        name: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        highlights: ['Achievement 1', 'Achievement 2']
      },
      loading: false,
      isNew: true
    }
  })
  
  it('renders properly with default props', () => {
    const wrapper = mount(WorkForm, { 
      props: defaultProps,
      global: {
        stubs: ['Form', 'FormField']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
  
  it('passes isNew prop correctly', () => {
    const wrapper = mount(WorkForm, { 
      props: { ...defaultProps, isNew: false },
      global: {
        stubs: ['Form', 'FormField']
      }
    })
    expect(wrapper.props('isNew')).toBe(false)
  })
  
  it('has a cancel button that emits cancel event when clicked', async () => {
    const wrapper = mount(WorkForm, { 
      props: defaultProps,
      global: {
        stubs: {
          Form: {
            template: '<div><slot name="actions"/></div>'
          },
          FormField: true
        }
      }
    })
    
    // Use a simplified approach that just checks the emitted events
    // after interacting with the cancel button
    const cancelButton = wrapper.find('button[type="button"]:not([type="submit"])')
    await cancelButton.trigger('click')
    
    // Verify the cancel event was emitted
    expect(wrapper.emitted()).toHaveProperty('cancel')
  })
}) 