import { describe, it, expect } from 'vitest'
import { Resume } from '../Resume'
import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('Resume Entity', () => {
  describe('create', () => {
    it('should create a valid Resume with minimal data', () => {
      // Arrange
      const minimalData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      
      // Act
      const result = Resume.create(minimalData)
      
      // Assert
      expect(result.isValid).toBe(true)
      expect(result.resume).toBeDefined()
      expect(result.resume?.basics.name).toBe('John Doe')
      expect(result.resume?.basics.email).toBe('john@example.com')
    })
    
    it('should validate email in basics section', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'invalid-email'
        }
      }
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Format email invalide')
    })
    
    it('should require name in basics section', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: '',
          email: 'john@example.com'
        }
      }
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le nom est requis')
    })
    
    it('should validate work experience dates', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        work: [
          {
            name: 'Company',
            position: 'Developer',
            startDate: 'invalid-date',
            endDate: '2020-01-01'
          }
        ]
      }
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Format de date invalide pour l'expérience 1")
    })
    
    it('should validate phone number when provided', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: 'invalid-phone'
        }
      }
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Format de téléphone invalide')
    })
  })
  
  describe('toJSON', () => {
    it('should return a valid JSON object', () => {
      // Arrange
      const data: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0612345678'
        },
        work: [
          {
            name: 'Company',
            position: 'Developer',
            startDate: '2019-01-01',
            endDate: '2020-01-01'
          }
        ]
      }
      
      // Act
      const resume = Resume.create(data).resume
      const json = resume?.toJSON()
      
      // Assert
      expect(json).toBeDefined()
      expect(json?.basics.name).toBe('John Doe')
      expect(json?.basics.email).toBe('john@example.com')
      expect(json?.basics.phone).toBe('0612345678')
      expect(json?.work?.[0].name).toBe('Company')
    })
  })
}) 