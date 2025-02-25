import { describe, it, expect } from 'vitest'
import { Phone } from '../Phone'

describe('Phone', () => {
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
        const phoneResult = Phone.create(phone)
        expect(phoneResult.isSuccess).toBe(true)
      })
    })
    
    it('should fail with empty phone', () => {
      // Arrange
      const emptyPhone = ''
      
      // Act
      const phoneResult = Phone.create(emptyPhone)
      
      // Assert
      expect(phoneResult.isFailure).toBe(true)
      expect(phoneResult.error).toBe('Format de téléphone invalide')
    })
    
    it('should fail with invalid phone format', () => {
      // Arrange & Act
      const invalidPhones = [
        'abc',
        '123',
        '+336',
        '061234567', // manque un chiffre
        '0612345678901' // trop long
      ]
      
      // Assert
      invalidPhones.forEach(phone => {
        const phoneResult = Phone.create(phone)
        expect(phoneResult.isFailure).toBe(true)
        expect(phoneResult.error).toBe('Format de téléphone invalide')
      })
    })
  })
  
  describe('format', () => {
    it('should format phone number correctly', () => {
      // Arrange
      const phone = Phone.create('0612345678').getValue()
      
      // Act
      const formatted = phone.format()
      
      // Assert
      expect(formatted).toBe('06 12 34 56 78')
    })
    
    it('should format international phone number correctly', () => {
      // Arrange
      const phone = Phone.create('+33612345678').getValue()
      
      // Act
      const formatted = phone.format()
      
      // Assert
      expect(formatted).toBe('+33 6 12 34 56 78')
    })
  })
  
  describe('equals', () => {
    it('should return true for same phones with different formatting', () => {
      // Arrange
      const phone1 = Phone.create('0612345678').getValue()
      const phone2 = Phone.create('06 12 34 56 78').getValue()
      
      // Act & Assert
      expect(phone1.equals(phone2)).toBe(true)
    })
    
    it('should return false for different phones', () => {
      // Arrange
      const phone1 = Phone.create('0612345678').getValue()
      const phone2 = Phone.create('0687654321').getValue()
      
      // Act & Assert
      expect(phone1.equals(phone2)).toBe(false)
    })
  })
  
  describe('toString', () => {
    it('should return the string representation', () => {
      // Arrange
      const phoneStr = '0612345678'
      const phone = Phone.create(phoneStr).getValue()
      
      // Act & Assert
      expect(phone.toString()).toBe(phoneStr)
    })
  })
}) 