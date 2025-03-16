import { describe, it, expect } from 'vitest'
import { Email } from '../email.value-object'
import { isSuccess, isFailure, ERROR_CODES, TRANSLATION_KEYS } from '@cv-generator/shared'
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock'

describe('Email', () => {
  // Create a mock i18n adapter for testing
  const mockI18n = new MockDomainI18nAdapter()

  describe('create', () => {
    it('should create a valid email', () => {
      // Arrange
      const validEmail = 'test@example.com'
      
      // Act
      const emailResult = Email.create(validEmail, mockI18n)
      
      // Assert
      expect(isSuccess(emailResult)).toBe(true)
      if (isSuccess(emailResult)) {
        expect(emailResult.value.toString()).toBe(validEmail)
      }
    })
    
    it('should fail with empty email', () => {
      // Arrange
      const emptyEmail = ''
      
      // Act
      const emailResult = Email.create(emptyEmail, mockI18n)
      
      // Assert
      expect(isFailure(emailResult)).toBe(true)
      if (isFailure(emailResult)) {
        expect(emailResult.error[0].message).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_EMAIL))
        expect(emailResult.error[0].i18nKey).toBe(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_EMAIL)
        expect(emailResult.error[0].code).toBe(ERROR_CODES.RESUME.BASICS.MISSING_EMAIL)
      }
    })
    
    describe('invalid email formats', () => {
      const invalidEmails = ['plainaddress', '#@%^%#$@#$@#.com', '@example.com', 'email.example.com']
      
      it('should fail with invalid email format', () => {
        invalidEmails.forEach(email => {
          const emailResult = Email.create(email, mockI18n)
          expect(isFailure(emailResult)).toBe(true)
          if (isFailure(emailResult)) {
            expect(emailResult.error[0].message).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_EMAIL))
            expect(emailResult.error[0].i18nKey).toBe(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_EMAIL)
            expect(emailResult.error[0].code).toBe(ERROR_CODES.RESUME.BASICS.INVALID_EMAIL)
          }
        })
      })
    })

    it('should detect personal emails and return a warning', () => {
      // Arrange
      const personalEmail = 'test@gmail.com'
      
      // Act
      const emailResult = Email.create(personalEmail, mockI18n)
      
      // Assert
      expect(isSuccess(emailResult)).toBe(true)
      if (isSuccess(emailResult) && emailResult.warnings && emailResult.warnings.length > 0) {
        expect(emailResult.warnings[0].message).toBe(mockI18n.translate(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.PERSONAL_EMAIL))
        expect(emailResult.warnings[0].i18nKey).toBe(TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.PERSONAL_EMAIL)
        expect(emailResult.warnings[0].code).toBe(ERROR_CODES.RESUME.BASICS.PERSONAL_EMAIL)
      } else {
        // If there are no warnings, the test should fail
        expect(isSuccess(emailResult) && emailResult.warnings && emailResult.warnings.length > 0).toBe(true)
      }
    })
  })
  
  describe('equals', () => {
    it('should return true for same emails', () => {
      // Arrange
      const result1 = Email.create('test@example.com', mockI18n)
      const result2 = Email.create('test@example.com', mockI18n)
      
      // Ensure both results are successful
      expect(isSuccess(result1)).toBe(true)
      expect(isSuccess(result2)).toBe(true)
      
      if (isSuccess(result1) && isSuccess(result2)) {
        const email1 = result1.value
        const email2 = result2.value
        
        // Act & Assert
        expect(email1.equals(email2)).toBe(true)
      }
    })
    
    it('should return false for different emails', () => {
      // Arrange
      const result1 = Email.create('test1@example.com', mockI18n)
      const result2 = Email.create('test2@example.com', mockI18n)
      
      // Ensure both results are successful
      expect(isSuccess(result1)).toBe(true)
      expect(isSuccess(result2)).toBe(true)
      
      if (isSuccess(result1) && isSuccess(result2)) {
        const email1 = result1.value
        const email2 = result2.value
        
        // Act & Assert
        expect(email1.equals(email2)).toBe(false)
      }
    })
  })
  
  describe('toString', () => {
    it('should return the string representation', () => {
      // Arrange
      const emailStr = 'test@example.com'
      const result = Email.create(emailStr, mockI18n)
      
      // Ensure result is successful
      expect(isSuccess(result)).toBe(true)
      
      if (isSuccess(result)) {
        const email = result.value
        
        // Act & Assert
        expect(email.toString()).toBe(emailStr)
      }
    })
  })
}) 