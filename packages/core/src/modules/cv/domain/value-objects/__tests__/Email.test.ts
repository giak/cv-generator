import { describe, it, expect } from 'vitest'
import { Email } from '../Email'

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      // Arrange
      const validEmail = 'test@example.com'
      
      // Act
      const emailResult = Email.create(validEmail)
      
      // Assert
      expect(emailResult.isSuccess).toBe(true)
      expect(emailResult.getValue().toString()).toBe(validEmail)
    })
    
    it('should fail with empty email', () => {
      // Arrange
      const emptyEmail = ''
      
      // Act
      const emailResult = Email.create(emptyEmail)
      
      // Assert
      expect(emailResult.isFailure).toBe(true)
      expect(emailResult.error).toBe('Format email invalide')
    })
    
    it('should fail with invalid email format', () => {
      // Arrange & Act
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test@example',
        'test.example.com'
      ]
      
      // Assert
      invalidEmails.forEach(email => {
        const emailResult = Email.create(email)
        expect(emailResult.isFailure).toBe(true)
        expect(emailResult.error).toBe('Format email invalide')
      })
    })
  })
  
  describe('equals', () => {
    it('should return true for same emails', () => {
      // Arrange
      const email1 = Email.create('test@example.com').getValue()
      const email2 = Email.create('test@example.com').getValue()
      
      // Act & Assert
      expect(email1.equals(email2)).toBe(true)
    })
    
    it('should return false for different emails', () => {
      // Arrange
      const email1 = Email.create('test1@example.com').getValue()
      const email2 = Email.create('test2@example.com').getValue()
      
      // Act & Assert
      expect(email1.equals(email2)).toBe(false)
    })
  })
  
  describe('toString', () => {
    it('should return the string representation', () => {
      // Arrange
      const emailStr = 'test@example.com'
      const email = Email.create(emailStr).getValue()
      
      // Act & Assert
      expect(email.toString()).toBe(emailStr)
    })
  })
}) 