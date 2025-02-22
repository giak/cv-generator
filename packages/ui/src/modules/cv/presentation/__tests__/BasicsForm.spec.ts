import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import BasicsForm from '../components/BasicsForm.vue'

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
    it('should render all required fields with initial values', () => {
      const wrapper = mountComponent()

      // Vérifier la présence des champs requis
      expect(wrapper.find('[data-test="name-input"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="email-input"]').exists()).toBe(true)

      // Vérifier les valeurs initiales
      const nameInput = wrapper.find('[data-test="name-input"]').element as HTMLInputElement
      const emailInput = wrapper.find('[data-test="email-input"]').element as HTMLInputElement

      expect(nameInput.value).toBe(mockBasics.name)
      expect(emailInput.value).toBe(mockBasics.email)
    })
  })

  describe('validation', () => {
    it('should show error for empty required fields', async () => {
      const wrapper = mountComponent({
        modelValue: {
          ...mockBasics,
          name: '',
          email: ''
        }
      })

      // Déclencher la validation
      const form = wrapper.find('form')
      await form.trigger('submit')

      // Vérifier les messages d'erreur
      expect(wrapper.find('[data-test="name-error"]').text()).toContain('Le nom est requis')
      expect(wrapper.find('[data-test="email-error"]').text()).toContain('L\'email est requis')
    })

    it('should show error for invalid email format', async () => {
      const wrapper = mountComponent({
        modelValue: {
          ...mockBasics,
          email: 'invalid-email'
        }
      })

      const emailInput = wrapper.find('[data-test="email-input"]')
      await emailInput.trigger('blur')

      expect(wrapper.find('[data-test="email-error"]').text()).toContain('Format email invalide')
    })
  })

  describe('events', () => {
    it('should emit update:modelValue on field change', async () => {
      const wrapper = mountComponent()
      const nameInput = wrapper.find('[data-test="name-input"]')

      await nameInput.setValue('Jane Doe')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted![0][0]).toEqual({
        ...mockBasics,
        name: 'Jane Doe'
      })
    })

    it('should emit validate on valid form submit', async () => {
      const wrapper = mountComponent()
      const form = wrapper.find('form')
      
      await form.trigger('submit')

      const emitted = wrapper.emitted()
      expect(emitted.validate).toBeTruthy()
    })

    it('should not emit validate on invalid form submit', async () => {
      const wrapper = mountComponent({
        modelValue: {
          ...mockBasics,
          email: 'invalid-email'
        }
      })
      
      const form = wrapper.find('form')
      await form.trigger('submit')

      const emitted = wrapper.emitted()
      expect(emitted.validate).toBeFalsy()
    })
  })
}) 