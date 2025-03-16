import { describe, expect, it } from 'vitest'
import { Phone } from '../phone.value-object'
import { TRANSLATION_KEYS } from '@cv-generator/shared'
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock'

describe('Phone Value Object', () => {
  // Create a mock i18n adapter for testing
  const mockI18n = new MockDomainI18nAdapter({
    [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_PHONE]: "Format de téléphone invalide",
    [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE]: "Format de téléphone invalide"
  })

  describe('create', () => {
    it('should create a valid Phone with international format', () => {
      const result = Phone.create('+33612345678', mockI18n)

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess || !result.getValue) return

      const phone = result.getValue()
      expect(phone.toString()).toBe('+33612345678')
    })

    it('should create a valid Phone with local format', () => {
      const result = Phone.create('0612345678', mockI18n)

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess || !result.getValue) return

      const phone = result.getValue()
      expect(phone.toString()).toBe('0612345678')
    })

    it('should fail with invalid phone format', () => {
      const result = Phone.create('invalid-phone', mockI18n)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })

    it('should fail with empty string', () => {
      const result = Phone.create('', mockI18n)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_PHONE))
    })

    it('should fail with too short number', () => {
      const result = Phone.create('12345', mockI18n)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
  })

  describe('equals', () => {
    it('should return true for same phone', () => {
      const phoneResult1 = Phone.create('+33612345678', mockI18n)
      const phoneResult2 = Phone.create('+33612345678', mockI18n)

      expect(phoneResult1.isSuccess).toBe(true)
      expect(phoneResult2.isSuccess).toBe(true)
      if (!phoneResult1.isSuccess || !phoneResult2.isSuccess || 
          !phoneResult1.getValue || !phoneResult2.getValue) return

      const phone1 = phoneResult1.getValue()
      const phone2 = phoneResult2.getValue()

      expect(phone1.equals(phone2)).toBe(true)
    })

    it('should return false for different phones', () => {
      const phoneResult1 = Phone.create('+33612345678', mockI18n)
      const phoneResult2 = Phone.create('+33687654321', mockI18n)

      expect(phoneResult1.isSuccess).toBe(true)
      expect(phoneResult2.isSuccess).toBe(true)
      if (!phoneResult1.isSuccess || !phoneResult2.isSuccess || 
          !phoneResult1.getValue || !phoneResult2.getValue) return

      const phone1 = phoneResult1.getValue()
      const phone2 = phoneResult2.getValue()

      expect(phone1.equals(phone2)).toBe(false)
    })
  })

  describe('format', () => {
    it('should format international number correctly', () => {
      const phoneResult = Phone.create('+33612345678', mockI18n)
      
      expect(phoneResult.isSuccess).toBe(true)
      if (!phoneResult.isSuccess || !phoneResult.getValue) return
      
      const phone = phoneResult.getValue()
      expect(phone.format()).toBe('+33 6 12 34 56 78')
    })
  })

  describe('toString', () => {
    it('should return phone string', () => {
      const phoneResult = Phone.create('+33612345678', mockI18n)
      
      expect(phoneResult.isSuccess).toBe(true)
      if (!phoneResult.isSuccess || !phoneResult.getValue) return
      
      const phone = phoneResult.getValue()
      expect(phone.toString()).toBe('+33612345678')
    })
  })
}) 