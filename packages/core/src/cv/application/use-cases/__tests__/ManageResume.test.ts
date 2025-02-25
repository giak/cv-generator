import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ManageResume, type ResumeRepository } from '../ManageResume'
import { Resume } from '../../../domain/entities/Resume'
import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'

describe('ManageResume UseCase', () => {
  let repository: ResumeRepository
  let manageResume: ManageResume

  beforeEach(() => {
    repository = {
      load: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
      export: vi.fn().mockResolvedValue(new Blob()),
      import: vi.fn().mockResolvedValue(null)
    }
    
    manageResume = new ManageResume(repository)
  })

  describe('createResume', () => {
    it('should validate and save valid data', async () => {
      // Arrange
      const validData: ResumeInterface = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      
      // Act
      await manageResume.createResume(validData)
      
      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1)
    })
    
    it('should not save invalid data (validation failure)', async () => {
      // Arrange
      const invalidData: ResumeInterface = {
        basics: {
          name: '',  // nom vide (invalide)
          email: 'john@example.com'
        }
      }
      
      // Act & Assert
      await expect(manageResume.createResume(invalidData)).rejects.toThrow('Validation failed')
      expect(repository.save).not.toHaveBeenCalled()
    })
    
    it('should not save if end date is before start date', async () => {
      // Arrange
      const invalidData: ResumeInterface = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        work: [
          {
            name: 'Company',
            position: 'Developer',
            startDate: '2020-01-01',
            endDate: '2019-01-01'  // date de fin avant date de début (règle métier)
          }
        ]
      }
      
      // Act & Assert
      await expect(manageResume.createResume(invalidData)).rejects.toThrow('Validation failed')
      expect(repository.save).not.toHaveBeenCalled()
    })
    
    it('should accept valid Resume instance directly', async () => {
      // Arrange
      const validData: Partial<ResumeInterface> = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      const resume = Resume.create(validData).resume!
      
      // Act
      await manageResume.createResume(resume)
      
      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1)
      expect(repository.save).toHaveBeenCalledWith(resume)
    })
  })
  
  describe('loadResume', () => {
    it('should load resume from repository', async () => {
      // Arrange
      const mockResume = Resume.create({
        basics: { name: 'John Doe', email: 'john@example.com' }
      }).resume!
      
      repository.load = vi.fn().mockResolvedValue(mockResume)
      
      // Act
      const result = await manageResume.loadResume()
      
      // Assert
      expect(repository.load).toHaveBeenCalledTimes(1)
      expect(result).toBe(mockResume)
    })
  })
}) 