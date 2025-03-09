import { describe, it, expect } from 'vitest'
import { Email } from '../email.value-object'
import { isSuccess, isFailure } from '@cv-generator/shared'

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      // Arrange
      const validEmail = 'test@example.com'
      
      // Act
      const emailResult = Email.create(validEmail)
      
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
      const emailResult = Email.create(emptyEmail)
      
      // Assert
      expect(isFailure(emailResult)).toBe(true)
      if (isFailure(emailResult)) {
        expect(emailResult.error[0].message).toBe('Format email invalide')
      }
    })
    
    describe('invalid email formats', () => {
      const invalidEmails = ['plainaddress', '#@%^%#$@#$@#.com', '@example.com', 'email.example.com']
      
      it('should fail with invalid email format', () => {
        invalidEmails.forEach(email => {
          const emailResult = Email.create(email)
          expect(isFailure(emailResult)).toBe(true)
          if (isFailure(emailResult)) {
            expect(emailResult.error[0].message).toBe('Format email invalide')
          }
        })
      })
    })
  })
  
  describe('equals', () => {
    it('should return true for same emails', () => {
      // Arrange
      const result1 = Email.create('test@example.com')
      const result2 = Email.create('test@example.com')
      
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
      const result1 = Email.create('test1@example.com')
      const result2 = Email.create('test2@example.com')
      
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
      const result = Email.create(emailStr)
      
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