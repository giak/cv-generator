import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface"
import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest"
import { ManageResume, Resume } from "@cv-generator/core"
import { useErrorStore } from '../../../../../core/stores/error'
import { useResumeStore } from "../resume"

// Mock the dependencies
vi.mock("@cv-generator/core", () => {
  const mockResume = {
    toJSON: vi.fn().mockReturnValue({ basics: { name: "John Doe" } })
  };
  
  return {
    ManageResume: vi.fn().mockImplementation(() => ({
      loadResume: vi.fn().mockResolvedValue(mockResumeData),
      createResume: vi.fn().mockResolvedValue(undefined),
      exportResume: vi.fn().mockResolvedValue(new Blob(['test'])),
      importResume: vi.fn().mockResolvedValue(mockResumeData)
    })),
    Resume: {
      create: vi.fn(() => ({
        resume: {
          toJSON: vi.fn(() => mockResumeData)
        }
      }))
    }
  };
});

vi.mock('../../../../../core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    executeWithErrorHandling: vi.fn(async (fn, options) => {
      try {
        return await fn()
      } catch (error) {
        console.error('Error in executeWithErrorHandling mock:', error)
        throw error
      }
    }),
    hasError: false,
    error: null,
    recoveryAction: null
  }))
}));

// Mock resume data for tests
const mockResumeData: ResumeInterface = {
  basics: {
    name: "John Doe",
    email: "john@example.com",
    label: "Software Engineer",
    phone: "+1234567890",
    url: "https://johndoe.com",
    summary: "Summary of John Doe",
    location: {
      address: "123 Main St",
      postalCode: "12345",
      city: "New York",
      countryCode: "US",
      region: "NY"
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "johndoe",
        url: "https://linkedin.com/in/johndoe"
      }
    ]
  },
  work: [],
  education: [],
  skills: []
}

describe("Resume Store", () => {
  let store: ReturnType<typeof useResumeStore>
  let mockManageResume: any
  let mockErrorStore: any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Initialize mock implementations
    mockManageResume = {
      loadResume: vi.fn().mockResolvedValue(mockResumeData),
      createResume: vi.fn().mockResolvedValue(undefined),
      exportResume: vi.fn().mockResolvedValue(new Blob(['test'])),
      importResume: vi.fn().mockResolvedValue(mockResumeData)
    }
    
    mockErrorStore = {
      hasErrors: false,
      hasFieldError: vi.fn().mockReturnValue(false),
      getFieldError: vi.fn().mockReturnValue(null),
      executeWithErrorHandling: vi.fn().mockImplementation(async (fn) => await fn()),
      addError: vi.fn(),
      dismissError: vi.fn(),
      clearErrors: vi.fn()
    }
    
    // Set up the mocks
    vi.mocked(ManageResume).mockImplementation(() => mockManageResume)
    vi.mocked(useErrorStore).mockReturnValue(mockErrorStore)
    
    // Create testing pinia
    setActivePinia(createPinia())
    
    // Get the store instance
    store = useResumeStore()
    
    // Silence console logs during tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("State", () => {
    it("should have initial state", () => {
      expect(store.resume).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe("Actions with Error Handling", () => {
    it("should use errorStore.executeWithErrorHandling when loading resume", async () => {
      await store.loadResume()
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
      expect(mockManageResume.loadResume).toHaveBeenCalled()
    })

    it("should use errorStore.executeWithErrorHandling when saving resume", async () => {
      await store.saveResume({ basics: { name: 'Test User', email: 'test@example.com' } } as ResumeInterface)
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
      expect(mockManageResume.createResume).toHaveBeenCalled()
    })

    it("should use errorStore.executeWithErrorHandling when exporting resume", async () => {
      await store.exportResume('json')
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
      expect(mockManageResume.exportResume).toHaveBeenCalledWith('json')
    })

    it("should use errorStore.executeWithErrorHandling when importing resume", async () => {
      const mockFile = new File(['{"basics":{"name":"John Doe"}}'], 'resume.json', { type: 'application/json' })
      await store.importResume(mockFile)
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
      expect(mockManageResume.importResume).toHaveBeenCalledWith(mockFile)
    })
  })

  describe("Error State Exposure", () => {
    it("should expose error state from errorStore", () => {
      const store = useResumeStore()
      
      store.hasFieldError('test.field')
      store.getFieldError('test.field')
      
      expect(mockErrorStore.hasFieldError).toHaveBeenCalledWith('test.field')
      expect(mockErrorStore.getFieldError).toHaveBeenCalledWith('test.field')
    })
  })

  describe("loadResume", () => {
    it("should load resume successfully", async () => {
      await store.loadResume()
      
      expect(mockManageResume.loadResume).toHaveBeenCalled()
      expect(store.resume).toEqual(mockResumeData)
    })

    it("should handle load error through errorStore", async () => {
      const error = new Error("Load failed")
      mockManageResume.loadResume.mockRejectedValueOnce(error)
      mockErrorStore.executeWithErrorHandling.mockRejectedValueOnce(error)
      
      try {
        await store.loadResume()
      } catch (err) {
        // Intentional catch to handle the error
      }
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
      expect(store.resume).toBeNull()
    })
  })

  describe("saveResume", () => {
    it("should save resume successfully", async () => {
      await store.saveResume(mockResumeData)
      
      expect(mockManageResume.createResume).toHaveBeenCalled()
    })

    it("should handle save error through errorStore", async () => {
      const error = new Error("Save failed")
      mockManageResume.createResume.mockRejectedValueOnce(error)
      mockErrorStore.executeWithErrorHandling.mockRejectedValueOnce(error)
      
      try {
        await store.saveResume(mockResumeData)
      } catch (err) {
        // Intentional catch to handle the error
      }
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
    })
  })

  describe("exportResume", () => {
    it("should export resume successfully", async () => {
      const blobData = new Blob(['exported-data'], { type: 'application/json' })
      mockManageResume.exportResume.mockResolvedValueOnce(blobData)
      
      const result = await store.exportResume("json")
      
      expect(mockManageResume.exportResume).toHaveBeenCalledWith("json")
      expect(result).toBe(blobData)
    })

    it("should handle export error through errorStore", async () => {
      const error = new Error("Export failed")
      mockManageResume.exportResume.mockRejectedValueOnce(error)
      mockErrorStore.executeWithErrorHandling.mockRejectedValueOnce(error)
      
      await expect(store.exportResume("json")).rejects.toThrow("Export failed")
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
    })
  })

  describe("importResume", () => {
    it("should import resume successfully", async () => {
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json"
      })
      
      await store.importResume(file)
      
      expect(mockManageResume.importResume).toHaveBeenCalledWith(file)
      expect(store.resume).toEqual(mockResumeData)
    })

    it("should handle import error through errorStore", async () => {
      const error = new Error("Import failed")
      mockManageResume.importResume.mockRejectedValueOnce(error)
      mockErrorStore.executeWithErrorHandling.mockRejectedValueOnce(error)
      
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json"
      })
      
      try {
        await store.importResume(file)
      } catch (err) {
        // Intentional catch to handle the error
      }
      
      expect(mockErrorStore.executeWithErrorHandling).toHaveBeenCalled()
    })
  })
}) 