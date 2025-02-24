import { describe, expect, it, vi } from 'vitest'
import { useModelUpdate } from '../useModelUpdate'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { ref } from 'vue'

describe('useModelUpdate', () => {
  const mockBasics: BasicsInterface = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    url: 'https://example.com',
    summary: 'Test summary',
    location: {
      address: '123 Street',
      postalCode: '12345',
      city: 'City',
      countryCode: 'US',
      region: 'Region'
    }
  }

  const mockEmit = vi.fn()

  describe('updateField', () => {
    it('should emit update:modelValue with updated field', () => {
      const emit = vi.fn()
      const modelValue = ref({
        name: 'John Doe',
        email: 'john@example.com'
      })

      const { updateField } = useModelUpdate({ emit, modelValue })
      updateField('name', 'Jane Doe')

      expect(emit).toHaveBeenCalledWith('update:modelValue', {
        name: 'Jane Doe',
        email: 'john@example.com'
      })
    })

    it('should preserve other fields when updating a single field', () => {
      const emit = vi.fn()
      const modelValue = ref({
        name: 'John Doe',
        email: 'john@example.com',
        label: 'Developer'
      })

      const { updateField } = useModelUpdate({ emit, modelValue })
      updateField('email', 'jane@example.com')

      expect(emit).toHaveBeenCalledWith('update:modelValue', {
        name: 'John Doe',
        email: 'jane@example.com',
        label: 'Developer'
      })
    })

    it('should handle optional fields', () => {
      const emit = vi.fn()
      const modelValue = ref({
        name: 'John Doe',
        email: 'john@example.com'
      })

      const { updateField } = useModelUpdate({ emit, modelValue })
      updateField('label', 'Developer')

      expect(emit).toHaveBeenCalledWith('update:modelValue', {
        name: 'John Doe',
        email: 'john@example.com',
        label: 'Developer'
      })
    })
  })
}) 