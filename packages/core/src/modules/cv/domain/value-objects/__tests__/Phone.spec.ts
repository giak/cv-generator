import { describe, expect, it } from 'vitest'
import { Phone } from '../Phone'

describe('Phone Value Object', () => {
  describe('create', () => {
    it('should create a valid Phone with international format', () => {
      const result = Phone.create('+33612345678')

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const phone = result.getValue()
      expect(phone.toString()).toBe('+33612345678')
    })

    it('should create a valid Phone with local format', () => {
      const result = Phone.create('0612345678')

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const phone = result.getValue()
      expect(phone.toString()).toBe('0612345678')
    })

    it('should fail with invalid phone format', () => {
      const result = Phone.create('invalid-phone')

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('Format de téléphone invalide')
    })

    it('should fail with empty string', () => {
      const result = Phone.create('')

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('Format de téléphone invalide')
    })

    it('should fail with too short number', () => {
      const result = Phone.create('12345')

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('Format de téléphone invalide')
    })
  })

  describe('equals', () => {
    it('should return true for same phone', () => {
      const phone1 = Phone.create('+33612345678').getValue()
      const phone2 = Phone.create('+33612345678').getValue()

      expect(phone1.equals(phone2)).toBe(true)
    })

    it('should return false for different phones', () => {
      const phone1 = Phone.create('+33612345678').getValue()
      const phone2 = Phone.create('+33687654321').getValue()

      expect(phone1.equals(phone2)).toBe(false)
    })
  })

  describe('format', () => {
    it('should format international number correctly', () => {
      const phone = Phone.create('+33612345678').getValue()

      expect(phone.format()).toBe('+33 61 23 45 67')
    })
  })

  describe('toString', () => {
    it('should return phone string', () => {
      const phone = Phone.create('+33612345678').getValue()

      expect(phone.toString()).toBe('+33612345678')
    })
  })
}) 