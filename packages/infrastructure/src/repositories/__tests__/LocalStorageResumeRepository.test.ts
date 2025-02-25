import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { Resume } from '@cv-generator/core'
import { LocalStorageResumeRepository, StorageValidationError } from '../LocalStorageResumeRepository'
import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn((index: number): string | null => {
      return Array.from(Object.keys(store))[index] || null
    }),
    length: Object.keys(store).length
  }
})()

describe('LocalStorageResumeRepository', () => {
  let repository: LocalStorageResumeRepository
  let validResume: Resume

  beforeEach(() => {
    // Remplacer localStorage global par notre mock
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    localStorageMock.clear()
    vi.clearAllMocks()
    
    repository = new LocalStorageResumeRepository()
    
    // Create a valid resume for tests
    const validData: Partial<ResumeInterface> = {
      basics: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
    const result = Resume.create(validData)
    validResume = result.resume!
  })
  
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('save', () => {
    it('should validate and save a valid resume', async () => {
      // Act
      await repository.save(validResume)
      
      // Assert - On vérifie que les données ont été sauvegardées
      // Note: Nous ne pouvons pas vérifier si setItem a été appelé directement 
      // car c'est fait à l'intérieur de la classe, pas avec notre mock
      const storedData = localStorage.getItem('cv-generator-resume')
      expect(storedData).not.toBeNull()
      
      const savedData = JSON.parse(storedData!)
      expect(savedData.basics.name).toBe('John Doe')
      expect(savedData.basics.email).toBe('john@example.com')
    })
    
    it('should throw when localStorage throws an error', async () => {
      // Arrange - Simuler une erreur lors de la sauvegarde
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('Storage error')
      })
      
      // Act & Assert
      await expect(repository.save(validResume)).rejects.toThrow(/Storage (operation failed|error)/)
    })
  })
  
  describe('load', () => {
    it('should load and validate stored resume', async () => {
      // Arrange
      const validData = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
      localStorage.setItem('cv-generator-resume', JSON.stringify(validData))
      
      // Act
      const result = await repository.load()
      
      // Assert
      expect(result).toBeInstanceOf(Resume)
      expect(result.basics.name).toBe('John Doe')
      expect(result.basics.email).toBe('john@example.com')
    })
    
    it('should throw when stored data is invalid JSON', async () => {
      // Arrange - Store invalid JSON
      localStorage.setItem('cv-generator-resume', 'invalid-json')
      
      // Act & Assert
      await expect(repository.load()).rejects.toThrow('Invalid JSON format in storage')
    })
    
    it('should return empty resume when no data exists', async () => {
      // Act
      const result = await repository.load()
      
      // Assert
      expect(result).toBeInstanceOf(Resume)
      expect(result.basics.name).toBe('')
      expect(result.basics.email).toBe('')
    })
  })
  
  describe('export', () => {
    it('should export resume as JSON blob', async () => {
      // Arrange
      await repository.save(validResume)
      
      // Act
      const blob = await repository.export('json', validResume)
      
      // Assert
      expect(blob).toBeInstanceOf(Blob)
      const content = await blob.text()
      const parsed = JSON.parse(content)
      expect(parsed.basics.name).toBe('John Doe')
      expect(parsed.basics.email).toBe('john@example.com')
    })
    
    it('should throw for unsupported export formats', async () => {
      // Arrange - Utiliser directement validResume pour éviter la validation de données vides
      
      // Act & Assert
      await expect(repository.export('pdf', validResume)).rejects.toThrow('not implemented yet')
      await expect(repository.export('html', validResume)).rejects.toThrow('not implemented yet')
    })
  })
  
  describe('import', () => {
    it('should import valid resume data from blob', async () => {
      // Arrange
      const validData = {
        basics: {
          name: 'Imported Name',
          email: 'imported@example.com'
        }
      }
      const blob = new Blob([JSON.stringify(validData)], { type: 'application/json' })
      
      // Act
      const result = await repository.import(blob)
      
      // Assert
      expect(result).toBeInstanceOf(Resume)
      expect(result.basics.name).toBe('Imported Name')
      expect(result.basics.email).toBe('imported@example.com')
      
      // Vérifier que les données ont été stockées
      const storedData = localStorage.getItem('cv-generator-resume')
      expect(storedData).not.toBeNull()
      expect(storedData).toContain('Imported Name')
    })
    
    it('should throw when importing data that fails storage validation', async () => {
      // Arrange
      const invalidData = {
        basics: {
          // Missing required name
          email: 'invalid@example.com'
        }
      }
      const blob = new Blob([JSON.stringify(invalidData)], { type: 'application/json' })
      
      // Act & Assert
      await expect(repository.import(blob)).rejects.toThrow(StorageValidationError)
      await expect(repository.import(blob)).rejects.toThrow('Storage validation failed')
    })
    
    it('should throw when importing invalid JSON', async () => {
      // Arrange
      const invalidBlob = new Blob(['invalid-json'], { type: 'application/json' })
      
      // Act & Assert
      await expect(repository.import(invalidBlob)).rejects.toThrow('Invalid JSON format')
    })
  })
}) 