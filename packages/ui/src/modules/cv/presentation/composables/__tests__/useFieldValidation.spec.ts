import { describe, expect, it } from 'vitest'
import { useFieldValidation } from '../useFieldValidation'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('useFieldValidation', () => {
  const { validateField, validateForm, errors } = useFieldValidation()

  describe('validateField', () => {
    it('should validate required name field', () => {
      const isValid = validateField('name', '')
      expect(isValid).toBe(false)
      expect(errors.value.name).toBe('Le nom est requis')

      expect(validateField('name', 'John Doe')).toBe(true)
      expect(errors.value.name).toBeUndefined()
    })

    it('should validate required email field', () => {
      const isValid = validateField('email', '')
      expect(isValid).toBe(false)
      expect(errors.value.email).toBe('L\'email est requis')

      expect(validateField('email', 'invalid')).toBe(false)
      expect(errors.value.email).toBe('Format email invalide')

      expect(validateField('email', 'john@example.com')).toBe(true)
      expect(errors.value.email).toBeUndefined()
    })

    it('should validate email format', () => {
      const isValid = validateField('email', 'invalid-email')
      expect(isValid).toBe(false)
      expect(errors.value.email).toBeDefined()
    })

    it('should clear errors when field becomes valid', () => {
      validateField('email', '')
      expect(errors.value.email).toBeDefined()

      validateField('email', 'valid@example.com')
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

    it('should validate entire form', () => {
      const isValid = validateForm({
        name: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      })

      expect(isValid).toBe(false)
      expect(errors.value.name).toBeDefined()
      expect(errors.value.email).toBeDefined()
    })

    it('should validate form with valid data', () => {
      const isValid = validateForm({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        url: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      })

      expect(isValid).toBe(true)
      expect(errors.value.name).toBeUndefined()
      expect(errors.value.email).toBeUndefined()
    })
  })
}) 