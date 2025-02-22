import { setActivePinia, createPinia } from 'pinia'
import { useResumeStore } from '../resume'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Resume } from '@cv-generator/core'

describe('Resume Store', () => {
  const mockResume = {
    basics: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  } as Resume

  const mockRepository = {
    load: vi.fn(),
    save: vi.fn(),
    export: vi.fn(),
    import: vi.fn()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useResumeStore()
    expect(store.resume).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('loadResume', () => {
    it('should load resume successfully', async () => {
      mockRepository.load.mockResolvedValue(mockResume)
      const store = useResumeStore()
      store.repository = mockRepository

      await store.loadResume()

      expect(store.resume).toEqual(mockResume)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle load error', async () => {
      const error = new Error('Load failed')
      mockRepository.load.mockRejectedValue(error)
      const store = useResumeStore()
      store.repository = mockRepository

      await store.loadResume()

      expect(store.resume).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(error)
    })
  })

  describe('saveResume', () => {
    it('should save resume successfully', async () => {
      mockRepository.save.mockResolvedValue(undefined)
      const store = useResumeStore()
      store.repository = mockRepository

      await store.saveResume(mockResume)

      expect(store.resume).toEqual(mockResume)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })
}) 