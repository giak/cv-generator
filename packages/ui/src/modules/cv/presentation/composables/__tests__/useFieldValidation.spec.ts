import { describe, expect, it } from 'vitest'
import { useFieldValidation } from '../useFieldValidation'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('useFieldValidation', () => {
  const { validateField, validateForm, errors } = useFieldValidation()

  describe('validateField', () => {
    it('should validate required name field', () => {
      expect(validateField('name', '')).toBe(false)
      expect(errors.value.name).toBe('Le nom est requis')

      expect(validateField('name', 'John Doe')).toBe(true)
      expect(errors.value.name).toBeUndefined()
    })

    it('should validate required email field', () => {
      expect(validateField('email', '')).toBe(false)
      expect(errors.value.email).toBe('L\'email est requis')

      expect(validateField('email', 'invalid')).toBe(false)
      expect(errors.value.email).toBe('Format email invalide')

      expect(validateField('email', 'john@example.com')).toBe(true)
      expect(errors.value.email).toBeUndefined()
    })

    it('should allow optional fields to be empty', () => {
      expect(validateField('label', '')).toBe(true)
      expect(errors.value.label).toBeUndefined()
    })
  })

  describe('validateForm', () => {
    it('should validate all required fields', () => {
      const validData: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      expect(validateForm(validData)).toBe(true)
      expect(errors.value).toEqual({})
    })

    it('should fail validation with invalid data', () => {
      const invalidData: BasicsInterface = {
        name: '',
        email: 'invalid'
      }

      expect(validateForm(invalidData)).toBe(false)
      expect(errors.value).toHaveProperty('name')
      expect(errors.value).toHaveProperty('email')
    })
  })
}) 