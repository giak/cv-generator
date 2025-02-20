import { describe, expect, it } from 'vitest'
import { Email } from '../Email'

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid Email', () => {
      const result = Email.create('test@example.com')

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const email = result.getValue()
      expect(email.toString()).toBe('test@example.com')
    })

    it('should fail with invalid email format', () => {
      const result = Email.create('invalid-email')

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('Format email invalide')
    })

    it('should fail with empty string', () => {
      const result = Email.create('')

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('Format email invalide')
    })
  })

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = Email.create('test@example.com').getValue()
      const email2 = Email.create('test@example.com').getValue()

      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com').getValue()
      const email2 = Email.create('test2@example.com').getValue()

      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return email string', () => {
      const email = Email.create('test@example.com').getValue()

      expect(email.toString()).toBe('test@example.com')
    })
  })
}) 