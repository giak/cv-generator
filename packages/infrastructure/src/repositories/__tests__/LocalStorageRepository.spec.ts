import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageRepository } from '../LocalStorageRepository'

describe('LocalStorageRepository', () => {
  let repository: LocalStorageRepository

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    repository = new LocalStorageRepository()
  })

  describe('save', () => {
    it('should save data to localStorage', async () => {
      const testData = { id: '1', name: 'Test' }
      const key = 'test-key'
      
      await repository.save(key, testData)
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(testData)
      )
    })
  })

  describe('load', () => {
    it('should load data from localStorage', async () => {
      const testData = { id: '1', name: 'Test' }
      const key = 'test-key'
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(testData))
      
      const result = await repository.load(key)
      
      expect(localStorage.getItem).toHaveBeenCalledWith(key)
      expect(result).toEqual(testData)
    })

    it('should return null when key does not exist', async () => {
      const key = 'non-existent-key'
      
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const result = await repository.load(key)
      
      expect(localStorage.getItem).toHaveBeenCalledWith(key)
      expect(result).toBeNull()
    })
  })
}) 