import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import BasicsForm from '../components/BasicsForm.vue'
import { nextTick } from 'vue'

const mockBasics: BasicsInterface = {
  name: 'John Doe',
  email: 'john@example.com',
  label: 'Software Engineer'
}

describe('BasicsForm', () => {
  const mountComponent = (props = {}) => {
    return mount(BasicsForm, {
      props: {
        modelValue: mockBasics,
        ...props
      },
      global: {
        plugins: [createTestingPinia()]
      }
    })
  }

  describe('rendering', () => {
    it('should render all required fields', () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: '',
            email: '',
            label: 'Software Engineer'
          }
        }
      })

      expect(wrapper.find('[data-test="name-input"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-input"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="label-input"]').exists()).toBe(true)
    })
  })

  describe('validation', () => {
    it('should show error for empty required fields', async () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: '',
            email: '',
            label: 'Software Engineer'
          }
        }
      })

      await wrapper.find('form').trigger('submit.prevent')
      console.log('Form submission - Current model:', wrapper.props('modelValue'))
      console.log('Form validation result:', wrapper.emitted('validate'))

      await nextTick()
      const nameError = wrapper.find('[data-test="name-error"]')
      expect(nameError.exists()).toBe(true)
      expect(nameError.text()).toBe('Le nom est requis')
    })

    it('should show error for invalid email format', async () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: 'John Doe',
            email: 'invalid-email',
            label: 'Software Engineer'
          }
        }
      })

      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      const emailError = wrapper.find('[data-test="email-error"]')
      expect(emailError.exists()).toBe(true)
      expect(emailError.text()).toBe('Format email invalide')
    })
  })

  describe('events', () => {
    it('should emit update:modelValue on field change', async () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: 'John Doe',
            email: 'john@example.com',
            label: 'Software Engineer'
          }
        }
      })

      await wrapper.find('[data-test="name-input"]').setValue('Jane Doe')
      console.log('Updating field name with value: Jane Doe')
      console.log('Emitting update with data:', wrapper.emitted('update:modelValue'))

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toEqual({
        name: 'Jane Doe',
        email: 'john@example.com',
        label: 'Software Engineer'
      })
    })

    it('should emit validate on valid form submit', async () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: 'John Doe',
            email: 'john@example.com',
            label: 'Software Engineer'
          }
        }
      })

      await wrapper.find('form').trigger('submit.prevent')
      console.log('Form submission - Current model:', wrapper.props('modelValue'))
      console.log('Form validation result:', wrapper.emitted('validate'))

      expect(wrapper.emitted('validate')).toBeTruthy()
    })

    it('should not emit validate on invalid form submit', async () => {
      const wrapper = mount(BasicsForm, {
        props: {
          modelValue: {
            name: 'John Doe',
            email: 'invalid-email',
            label: 'Software Engineer'
          }
        }
      })

      await wrapper.find('form').trigger('submit.prevent')
      console.log('Form submission - Current model:', wrapper.props('modelValue'))
      console.log('Form validation result:', wrapper.emitted('validate'))

      expect(wrapper.emitted('validate')).toBeFalsy()
    })
  })
}) 