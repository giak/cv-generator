import { mount, type VueWrapper } from '@vue/test-utils'
import BasicsForm from '../components/BasicsForm.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('BasicsForm', () => {
  const defaultProps = {
    modelValue: {
      name: 'John Doe',
      email: 'john@example.com',
      label: ''
    } as BasicsInterface,
    loading: false
  }

  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(BasicsForm, {
      props: defaultProps,
      global: {
        stubs: {
          'Form': {
            template: '<div><slot /></div>',
            props: ['loading']
          },
          'FormField': {
            template: '<div><slot /></div>',
            props: ['label', 'modelValue', 'name', 'type', 'error', 'required']
          }
        }
      }
    })
  })

  it('should mount', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  describe('rendering', () => {
    it('should render all required fields with initial values', () => {
      const nameField = wrapper.findComponent({ name: 'FormField', props: { name: 'name' } })
      const emailField = wrapper.findComponent({ name: 'FormField', props: { name: 'email' } })
      
      expect(nameField.exists()).toBe(true)
      expect(emailField.exists()).toBe(true)
      expect(nameField.props('modelValue')).toBe(defaultProps.modelValue.name)
      expect(emailField.props('modelValue')).toBe(defaultProps.modelValue.email)
    })
  })

  describe('validation', () => {
    it('should show error for empty required fields', async () => {
      await wrapper.setProps({
        modelValue: {
          name: '',
          email: '',
          label: ''
        }
      })

      const form = wrapper.findComponent({ name: 'Form' })
      await form.trigger('submit')

      const nameField = wrapper.findComponent({ name: 'FormField', props: { name: 'name' } })
      const emailField = wrapper.findComponent({ name: 'FormField', props: { name: 'email' } })

      expect(nameField.props('error')).toBeTruthy()
      expect(emailField.props('error')).toBeTruthy()
    })
  })
}) 