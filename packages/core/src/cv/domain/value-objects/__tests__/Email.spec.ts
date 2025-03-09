import { describe, it, expect } from 'vitest'
import { Email } from '../email.value-object'
import { isSuccess, isFailure } from '@cv-generator/shared'

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid Email', () => {
      const result = Email.create('test@example.com')

      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value instanceof Email).toBe(true)
        expect(result.value.getValue()).toBe('test@example.com')
      }
    })

    it('should fail with invalid email format', () => {
      const result = Email.create('invalid-email')

      expect(isFailure(result)).toBe(true)
      if (isFailure(result)) {
        expect(result.error[0].message).toBe('Format email invalide')
      }
    })

    it('should fail with empty string', () => {
      const result = Email.create('')

      expect(isFailure(result)).toBe(true)
      if (isFailure(result)) {
        expect(result.error[0].message).toBe('Format email invalide')
      }
    })
  })

  describe('equals', () => {
    it('should return true for same email', () => {
      const result1 = Email.create('test@example.com')
      const result2 = Email.create('test@example.com')
      
      expect(isSuccess(result1)).toBe(true)
      expect(isSuccess(result2)).toBe(true)
      
      if (isSuccess(result1) && isSuccess(result2)) {
        expect(result1.value.equals(result2.value)).toBe(true)
      }
    })

    it('should return false for different emails', () => {
      const result1 = Email.create('test1@example.com')
      const result2 = Email.create('test2@example.com')
      
      expect(isSuccess(result1)).toBe(true)
      expect(isSuccess(result2)).toBe(true)
      
      if (isSuccess(result1) && isSuccess(result2)) {
        expect(result1.value.equals(result2.value)).toBe(false)
      }
    })
  })

  describe('toString', () => {
    it('should return email string', () => {
      const result = Email.create('test@example.com')
      
      expect(isSuccess(result)).toBe(true)
      
      if (isSuccess(result)) {
        expect(result.value.toString()).toBe('test@example.com')
      }
    })
  })
}) 