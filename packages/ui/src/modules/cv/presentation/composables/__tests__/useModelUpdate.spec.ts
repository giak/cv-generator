import { describe, expect, it, vi } from 'vitest'
import { useModelUpdate } from '../useModelUpdate'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

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
      const { updateField } = useModelUpdate(mockEmit, mockBasics)

      updateField('name', 'Jane Doe')

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
        ...mockBasics,
        name: 'Jane Doe'
      })
    })

    it('should preserve other fields when updating a single field', () => {
      const { updateField } = useModelUpdate(mockEmit, mockBasics)

      updateField('email', 'jane@example.com')

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
        ...mockBasics,
        email: 'jane@example.com'
      })
      expect(mockEmit).toHaveBeenCalledTimes(1)
    })

    it('should handle optional fields', () => {
      const { updateField } = useModelUpdate(mockEmit, mockBasics)

      updateField('label', 'Developer')

      expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
        ...mockBasics,
        label: 'Developer'
      })
    })
  })
}) 