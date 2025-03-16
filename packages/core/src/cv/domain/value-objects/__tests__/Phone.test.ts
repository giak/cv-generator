import { describe, it, expect } from 'vitest'
import { Phone } from '../phone.value-object'
import { TRANSLATION_KEYS } from '@cv-generator/shared'
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock'

describe('Phone', () => {
  // Create a mock i18n adapter for testing
  const mockI18n = new MockDomainI18nAdapter({
    [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_PHONE]: "Format de téléphone invalide",
    [TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE]: "Format de téléphone invalide"
  })

  describe('create', () => {
    it('should create a valid phone number', () => {
      // Arrange
      const validPhones = [
        '+33612345678',
        '0612345678',
        '06 12 34 56 78',
        '06-12-34-56-78'
      ]
      
      // Act & Assert
      validPhones.forEach(phone => {
        const phoneResult = Phone.create(phone, mockI18n)
        expect(phoneResult.isSuccess).toBe(true)
      })
    })
    
    it('should fail with empty phone', () => {
      // Arrange
      const emptyPhone = ''
      
      // Act
      const phoneResult = Phone.create(emptyPhone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_PHONE))
    })
    
    it('should fail with alpha characters', () => {
      // Arrange & Act
      const phone = 'abc'
      const phoneResult = Phone.create(phone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
    
    it('should fail with very short number', () => {
      // Arrange & Act
      const phone = '123'
      const phoneResult = Phone.create(phone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
    
    it('should fail with short international prefix', () => {
      // Arrange & Act
      const phone = '+336'
      const phoneResult = Phone.create(phone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
    
    it('should fail with too short local number', () => {
      // Arrange & Act
      const phone = '061234567' // manque un chiffre
      const phoneResult = Phone.create(phone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
    
    it('should fail with too long number', () => {
      // Arrange & Act
      const phone = '0612345678901' // trop long
      const phoneResult = Phone.create(phone, mockI18n)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE))
    })
  })
  
  describe('format', () => {
    it('should format phone number correctly', () => {
      // Arrange
      const phoneResult = Phone.create('0612345678', mockI18n)
      expect(phoneResult.isSuccess).toBe(true)
      if (!phoneResult.isSuccess || !phoneResult.getValue) return
      const phone = phoneResult.getValue()
      
      // Act
      const formatted = phone.format()
      
      // Assert
      expect(formatted).toBe('06 12 34 56 78')
    })
    
    it('should format international phone number correctly', () => {
      // Arrange
      const phoneResult = Phone.create('+33612345678', mockI18n)
      expect(phoneResult.isSuccess).toBe(true)
      if (!phoneResult.isSuccess || !phoneResult.getValue) return
      const phone = phoneResult.getValue()
      
      // Act
      const formatted = phone.format()
      
      // Assert
      expect(formatted).toBe('+33 6 12 34 56 78')
    })
  })
  
  describe('equals', () => {
    it('should return true for same phones with different formatting', () => {
      // Arrange
      const phone1Result = Phone.create('0612345678', mockI18n)
      const phone2Result = Phone.create('06 12 34 56 78', mockI18n)
      
      expect(phone1Result.isSuccess).toBe(true)
      expect(phone2Result.isSuccess).toBe(true)
      
      if (!phone1Result.isSuccess || !phone1Result.getValue || 
          !phone2Result.isSuccess || !phone2Result.getValue) return
      
      const phone1 = phone1Result.getValue()
      const phone2 = phone2Result.getValue()
      
      // Act & Assert
      expect(phone1.equals(phone2)).toBe(true)
    })
    
    it('should return false for different phones', () => {
      // Arrange
      const phone1Result = Phone.create('0612345678', mockI18n)
      const phone2Result = Phone.create('0687654321', mockI18n)
      
      expect(phone1Result.isSuccess).toBe(true)
      expect(phone2Result.isSuccess).toBe(true)
      
      if (!phone1Result.isSuccess || !phone1Result.getValue || 
          !phone2Result.isSuccess || !phone2Result.getValue) return
      
      const phone1 = phone1Result.getValue()
      const phone2 = phone2Result.getValue()
      
      // Act & Assert
      expect(phone1.equals(phone2)).toBe(false)
    })
  })
  
  describe('toString', () => {
    it('should return the string representation', () => {
      // Arrange
      const phoneStr = '0612345678'
      const phoneResult = Phone.create(phoneStr, mockI18n)
      
      expect(phoneResult.isSuccess).toBe(true)
      if (!phoneResult.isSuccess || !phoneResult.getValue) return
      
      const phone = phoneResult.getValue()
      
      // Act & Assert
      expect(phone.toString()).toBe(phoneStr)
    })
  })
}) 