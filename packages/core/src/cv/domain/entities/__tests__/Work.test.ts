import { describe, it, expect } from 'vitest'
import { Work } from '../Work'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('Work Entity', () => {
  describe('create', () => {
    it('should create a valid Work with minimal data', () => {
      // Arrange
      const minimalData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      // Act
      const result = Work.create(minimalData)
      
      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(result.work).toBeDefined()
      expect(result.work?.name).toBe('Acme Inc')
      expect(result.work?.position).toBe('Software Developer')
      expect(result.work?.startDate.getValue()).toBe('2020-01-01')
    })
    
    it('should create a valid Work with complete data', () => {
      // Arrange
      const completeData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        url: 'https://acme.com',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects',
        highlights: ['Project A', 'Project B']
      }
      
      // Act
      const result = Work.create(completeData)
      
      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
      expect(result.work).toBeDefined()
      expect(result.work?.name).toBe('Acme Inc')
      expect(result.work?.position).toBe('Software Developer')
      expect(result.work?.url).toBe('https://acme.com')
      expect(result.work?.startDate.getValue()).toBe('2020-01-01')
      expect(result.work?.endDate?.getValue()).toBe('2022-12-31')
      expect(result.work?.summary).toBe('Worked on various projects')
      expect(result.work?.highlights).toEqual(['Project A', 'Project B'])
    })
    
    it('should fail if name is missing', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Le nom de l'entreprise est requis")
      expect(result.work).toBeUndefined()
    })
    
    it('should fail if position is missing', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        startDate: '2020-01-01'
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le poste est requis')
      expect(result.work).toBeUndefined()
    })
    
    it('should fail if startDate is missing', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer'
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La date de début est requise')
      expect(result.work).toBeUndefined()
    })
    
    it('should fail if url is invalid', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01',
        url: 'invalid-url'
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("L'URL fournie n'est pas valide")
      expect(result.work).toBeUndefined()
    })
    
    it('should fail if startDate has invalid format', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '01/01/2020' // Format invalide, devrait être YYYY-MM-DD
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('Date de début invalide')
      expect(result.work).toBeUndefined()
    })
    
    it('should fail if endDate is before startDate', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2019-12-31' // Avant la date de début
      }
      
      // Act
      const result = Work.create(invalidData)
      
      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La date de fin doit être postérieure à la date de début')
      expect(result.work).toBeUndefined()
    })
  })
  
  describe('createWithResultType', () => {
    it('should create a valid Work with minimal data', () => {
      // Arrange
      const minimalData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      // Act
      const result = Work.createWithResultType(minimalData)
      
      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
      expect(result.hasWarnings()).toBe(false)
      expect(result.getErrors()).toEqual([])
      expect(result.entity).toBeDefined()
      
      // Vérification des données de l'entité
      const workData = result.getValue()
      expect(workData.name).toBe('Acme Inc')
      expect(workData.position).toBe('Software Developer')
      expect(workData.startDate).toBe('2020-01-01')
      
      // Vérification de l'entité
      const work = result.entity!
      expect(work.name).toBe('Acme Inc')
      expect(work.position).toBe('Software Developer')
      expect(work.startDate.getValue()).toBe('2020-01-01')
    })
    
    it('should create a valid Work with complete data', () => {
      // Arrange
      const completeData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        url: 'https://acme.com',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects',
        highlights: ['Project A', 'Project B']
      }
      
      // Act
      const result = Work.createWithResultType(completeData)
      
      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
      expect(result.getErrors()).toEqual([])
      
      // Vérification des données
      const workData = result.getValue()
      expect(workData.name).toBe('Acme Inc')
      expect(workData.position).toBe('Software Developer')
      expect(workData.url).toBe('https://acme.com')
      expect(workData.startDate).toBe('2020-01-01')
      expect(workData.endDate).toBe('2022-12-31')
      expect(workData.summary).toBe('Worked on various projects')
      expect(workData.highlights).toEqual(['Project A', 'Project B'])
      
      // Vérification de l'entité
      const work = result.entity!
      expect(work.name).toBe('Acme Inc')
      expect(work.position).toBe('Software Developer')
      expect(work.url).toBe('https://acme.com')
    })
    
    it('should fail if required fields are missing', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        position: 'Software Developer'
        // name et startDate manquants
      }
      
      // Act
      const result = Work.createWithResultType(invalidData)
      
      // Assert
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      
      // Vérification des erreurs
      const errors = result.getErrors()
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(e => e.field === 'name')).toBe(true)
      expect(errors.some(e => e.field === 'startDate')).toBe(true)
      
      // Vérification que l'entité n'est pas définie
      expect(result.entity).toBeUndefined()
      expect(() => result.getValue()).toThrow()
    })
    
    it('should fail with detailed validation errors for invalid data', () => {
      // Arrange
      const invalidData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2019-12-31', // Avant la date de début
        url: 'invalid-url' // URL invalide
      }
      
      // Act
      const result = Work.createWithResultType(invalidData)
      
      // Assert
      expect(result.isSuccess()).toBe(false)
      expect(result.isFailure()).toBe(true)
      
      const errors = result.getErrors()
      expect(errors.length).toBeGreaterThanOrEqual(2)
      
      // Vérification des erreurs spécifiques
      expect(errors.some(e => e.field === 'url')).toBe(true)
      expect(errors.some(e => e.field === 'endDate')).toBe(true)
      
      // Vérification des codes d'erreur
      const urlError = errors.find(e => e.field === 'url')
      expect(urlError?.code).toBeDefined()
      expect(urlError?.i18nKey).toBeDefined()
      expect(urlError?.severity).toBe('error')
    })
  })
  
  describe('updateWithResultType', () => {
    it('should update a Work entity correctly', () => {
      // Arrange
      const initialData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      const createResult = Work.createWithResultType(initialData)
      const work = createResult.entity!
      
      // Act
      const updateResult = work.updateWithResultType({
        position: 'Senior Developer',
        endDate: '2022-12-31'
      })
      
      // Assert
      expect(updateResult.isSuccess()).toBe(true)
      
      const updatedWorkData = updateResult.getValue()
      expect(updatedWorkData.name).toBe('Acme Inc') // Inchangé
      expect(updatedWorkData.position).toBe('Senior Developer') // Mis à jour
      expect(updatedWorkData.startDate).toBe('2020-01-01') // Inchangé
      expect(updatedWorkData.endDate).toBe('2022-12-31') // Ajouté
      
      const updatedWork = updateResult.entity!
      expect(updatedWork.position).toBe('Senior Developer')
      expect(updatedWork.endDate?.getValue()).toBe('2022-12-31')
    })
    
    it('should validate updated data and return errors', () => {
      // Arrange
      const initialData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      const createResult = Work.createWithResultType(initialData)
      const work = createResult.entity!
      
      // Act
      const updateResult = work.updateWithResultType({
        endDate: '2019-01-01' // Date antérieure à la date de début
      })
      
      // Assert
      expect(updateResult.isSuccess()).toBe(false)
      expect(updateResult.isFailure()).toBe(true)
      
      const errors = updateResult.getErrors()
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(e => e.field === 'endDate')).toBe(true)
      
      // Vérification que getValue() lève une exception
      expect(() => updateResult.getValue()).toThrow()
    })
  })
  
  describe('update', () => {
    it('should update a Work entity correctly', () => {
      // Arrange
      const initialData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      const work = Work.create(initialData).work!
      
      // Act
      const updateResult = work.update({
        position: 'Senior Developer',
        endDate: '2022-12-31'
      })
      
      // Assert
      expect(updateResult.isValid).toBe(true)
      expect(updateResult.work).toBeDefined()
      expect(updateResult.work?.name).toBe('Acme Inc') // Inchangé
      expect(updateResult.work?.position).toBe('Senior Developer') // Mis à jour
      expect(updateResult.work?.startDate.getValue()).toBe('2020-01-01') // Inchangé
      expect(updateResult.work?.endDate?.getValue()).toBe('2022-12-31') // Ajouté
    })
    
    it('should validate updated data and return errors', () => {
      // Arrange
      const initialData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      const work = Work.create(initialData).work!
      
      // Act
      const updateResult = work.update({
        endDate: '2019-01-01' // Date antérieure à la date de début
      })
      
      // Assert
      expect(updateResult.isValid).toBe(false)
      expect(updateResult.errors).toContain('La date de fin doit être postérieure à la date de début')
      expect(updateResult.work).toBeUndefined()
    })
  })
  
  describe('toJSON', () => {
    it('should convert Work to JSON format correctly with minimal data', () => {
      // Arrange
      const minimalData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      }
      
      const work = Work.create(minimalData).work!
      
      // Act
      const json = work.toJSON()
      
      // Assert
      expect(json).toEqual({
        name: 'Acme Inc',
        position: 'Software Developer',
        startDate: '2020-01-01'
      })
    })
    
    it('should convert Work to JSON format correctly with complete data', () => {
      // Arrange
      const completeData: Partial<WorkInterface> = {
        name: 'Acme Inc',
        position: 'Software Developer',
        url: 'https://acme.com',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects',
        highlights: ['Project A', 'Project B']
      }
      
      const work = Work.create(completeData).work!
      
      // Act
      const json = work.toJSON()
      
      // Assert
      expect(json).toEqual({
        name: 'Acme Inc',
        position: 'Software Developer',
        url: 'https://acme.com',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects',
        highlights: ['Project A', 'Project B']
      })
    })
  })
}) 