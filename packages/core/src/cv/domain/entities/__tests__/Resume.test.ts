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
      expect(result.errors).toEqual([])
      expect(result.resume).toBeDefined()
      expect(result.resume?.basics.name).toBe('John Doe')
      expect(result.resume?.basics.email).toBe('john@example.com')
    })
    
    it('should fail if basics is missing', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {}
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors?.length).toBeGreaterThan(0)
      expect(result.resume).toBeUndefined()
    })
    
    it('should fail if name is missing', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: '', // Nom vide au lieu de manquant pour éviter l'erreur du type
          email: 'john@example.com'
        }
      }
      
      // Act
      const result = Resume.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors?.some(err => err.includes('nom'))).toBe(true)
      expect(result.resume).toBeUndefined()
    })
    
    it('should fail if email is invalid', () => {
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
      expect(result.errors?.length).toBeGreaterThan(0)
      expect(result.resume).toBeUndefined()
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
  
  describe('createWithResultType', () => {
    it('should create a valid Resume with minimal data', () => {
      // Arrange
      const minimalData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      
      // Act
      const result = Resume.createWithResultType(minimalData)
      
      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
      expect(result.hasWarnings()).toBe(false)
      expect(result.getErrors()).toEqual([])
      expect(result.entity).toBeDefined()
      
      // Vérification des données de l'entité
      const resumeData = result.getValue()
      expect(resumeData.basics.name).toBe('John Doe')
      expect(resumeData.basics.email).toBe('john@example.com')
      
      // Vérification de l'entité
      const resume = result.entity!
      expect(resume.basics.name).toBe('John Doe')
      expect(resume.basics.email).toBe('john@example.com')
    })
    
    it('should create a valid Resume with complete data', () => {
      // Arrange
      const completeData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+33123456789',
          url: 'https://johndoe.com',
          summary: 'Experienced developer',
          location: {
            city: 'Paris',
            countryCode: 'FR'
          },
          profiles: [
            {
              network: 'LinkedIn',
              url: 'https://linkedin.com/in/johndoe',
              username: 'johndoe'
            }
          ]
        },
        work: [
          {
            name: 'Acme Inc',
            position: 'Software Developer',
            startDate: '2020-01-01',
            endDate: '2022-12-31'
          }
        ],
        skills: [
          {
            name: 'Web Development',
            level: 'Advanced',
            keywords: ['JavaScript', 'TypeScript', 'Vue.js']
          }
        ]
      }
      
      // Act
      const result = Resume.createWithResultType(completeData)
      
      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
      expect(result.getErrors()).toEqual([])
      
      // Vérification des données
      const resumeData = result.getValue()
      expect(resumeData.basics.name).toBe('John Doe')
      expect(resumeData.basics.email).toBe('john@example.com')
      expect(resumeData.work?.length).toBe(1)
      expect(resumeData.work?.[0].name).toBe('Acme Inc')
      expect(resumeData.skills?.length).toBe(1)
      
      // Vérification de l'entité
      const resume = result.entity!
      expect(resume.work.length).toBe(1)
      expect(resume.work[0].name).toBe('Acme Inc')
      expect(resume.skills.length).toBe(1)
      expect(resume.skills[0].name).toBe('Web Development')
    })
    
    it('should fail if basics is missing', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {}
      
      // Act
      const result = Resume.createWithResultType(invalidData)
      
      // Assert
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      
      // Vérification des erreurs
      const errors = result.getErrors()
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].field).toBe('basics')
      
      // Vérification que l'entité n'est pas définie
      expect(result.entity).toBeUndefined()
      expect(() => result.getValue()).toThrow()
    })
    
    it('should fail if name is missing', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: '', // Nom vide au lieu de manquant pour éviter l'erreur du type
          email: 'john@example.com'
        }
      }
      
      // Act
      const result = Resume.createWithResultType(invalidData)
      
      // Assert
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      
      const errors = result.getErrors()
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(e => e.field === 'basics.name')).toBe(true)
      
      // Vérification que getValue() lève une exception
      expect(() => result.getValue()).toThrow()
    })
    
    it('should fail with detailed validation errors for invalid date formats', () => {
      // Arrange
      const invalidData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        work: [
          {
            name: 'Acme Inc',
            position: 'Software Developer',
            startDate: '01/01/2020' // Format invalide, devrait être YYYY-MM-DD
          }
        ]
      }
      
      // Act
      const result = Resume.createWithResultType(invalidData)
      
      // Assert
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      
      const errors = result.getErrors()
      expect(errors.length).toBeGreaterThan(0)
      
      // Vérification des erreurs spécifiques
      expect(errors.some(e => e.field === 'work[0].startDate')).toBe(true)
      
      // Vérification des codes d'erreur
      const dateError = errors.find(e => e.field === 'work[0].startDate')
      expect(dateError?.code).toBeDefined()
      expect(dateError?.i18nKey).toBeDefined()
      expect(dateError?.severity).toBe('error')
    })
  })
  
  describe('toJSON', () => {
    it('should convert Resume to JSON format correctly', () => {
      // Arrange
      const data: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        work: [
          {
            name: 'Acme Inc',
            position: 'Software Developer',
            startDate: '2020-01-01'
          }
        ]
      }
      
      const createResult = Resume.createWithResultType(data)
      const resume = createResult.entity!
      
      // Act
      const json = resume.toJSON()
      
      // Assert
      expect(json.basics.name).toBe('John Doe')
      expect(json.basics.email).toBe('john@example.com')
      expect(json.work?.length).toBe(1)
      expect(json.work?.[0].name).toBe('Acme Inc')
    })
  })
}) 