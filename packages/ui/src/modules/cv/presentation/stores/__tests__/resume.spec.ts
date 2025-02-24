import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface"
import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Resume } from "@cv-generator/core"

// Mock des dépendances
const mockRepository = {
  load: vi.fn(),
  save: vi.fn(),
  export: vi.fn(),
  import: vi.fn(),
}

// Mock du résumé complet
const mockResumeData: ResumeInterface = {
  basics: {
    name: "John Doe",
    email: "john@example.com",
  },
  work: [],
  education: [],
  skills: [],
}

// Mock du package core
vi.mock("@cv-generator/core", () => ({
  Resume: {
    create: (data: ResumeInterface) => ({
      isValid: true,
      resume: {
        data,
        get basics() {
          return { ...data.basics }
        },
        get work() {
          return [...(data.work || [])]
        },
        get education() {
          return [...(data.education || [])]
        },
        get skills() {
          return [...(data.skills || [])]
        },
        toJSON: () => ({ ...data }),
      },
    }),
  },
  ManageResume: vi.fn().mockImplementation(() => ({
    loadResume: () => mockRepository.load(),
    createResume: (data: ResumeInterface) => mockRepository.save(data),
    exportResume: (format: string) => mockRepository.export(format),
    importResume: (file: Blob) => mockRepository.import(file),
  })),
}))

vi.mock("@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository", () => ({
  LocalStorageResumeRepository: vi.fn().mockImplementation(() => mockRepository),
}))

// Import après les mocks
import { useResumeStore } from "../resume"

describe("Resume Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe("loadResume", () => {
    it("should load resume successfully", async () => {
      const { resume: mockResume } = Resume.create(mockResumeData)
      mockRepository.load.mockResolvedValue(mockResume)

      const store = useResumeStore()
      await store.loadResume()

      expect(mockRepository.load).toHaveBeenCalled()
      expect(store.resume).toBeDefined()
    })

    it("should handle load error", async () => {
      const error = new Error("Load failed")
      mockRepository.load.mockRejectedValue(error)

      const store = useResumeStore()
      await expect(store.loadResume()).rejects.toThrow("Load failed")
    })
  })

  describe("saveResume", () => {
    it("should save resume successfully", async () => {
      const { resume: mockResume } = Resume.create(mockResumeData)
      mockRepository.save.mockResolvedValue(mockResume)

      const store = useResumeStore()
      await store.saveResume(mockResume)

      expect(mockRepository.save).toHaveBeenCalledWith({
        basics: {
          name: "John Doe",
          email: "john@example.com",
          label: "",
          phone: "",
          url: "",
          summary: "",
          location: undefined,
          profiles: []
        },
        work: [],
        education: [],
        skills: []
      })
    })

    it("should handle save error", async () => {
      const error = new Error("Save failed")
      mockRepository.save.mockRejectedValue(error)

      const store = useResumeStore()
      const { resume: mockResume } = Resume.create(mockResumeData)

      await expect(store.saveResume(mockResume)).rejects.toThrow("Save failed")
    })
  })

  describe("exportResume", () => {
    it("should export resume successfully", async () => {
      const { resume: mockResume } = Resume.create(mockResumeData)
      mockRepository.export.mockResolvedValue("exported-data")

      const store = useResumeStore()
      store.resume = mockResume
      const result = await store.exportResume("json")

      expect(mockRepository.export).toHaveBeenCalledWith("json")
      expect(result).toBe("exported-data")
    })

    it("should handle export error", async () => {
      const error = new Error("Export failed")
      mockRepository.export.mockRejectedValue(error)

      const store = useResumeStore()
      const { resume: mockResume } = Resume.create(mockResumeData)
      await expect(store.exportResume("json")).rejects.toThrow("Export failed")
    })
  })

  describe("importResume", () => {
    it("should import resume successfully", async () => {
      const { resume: mockResume } = Resume.create(mockResumeData)
      mockRepository.import.mockResolvedValue(mockResume)

      const store = useResumeStore()
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json"
      })
      await store.importResume(file)

      expect(mockRepository.import).toHaveBeenCalledWith(file)
      expect(store.resume).toBeDefined()
    })

    it("should handle import error", async () => {
      const error = new Error("Import failed")
      mockRepository.import.mockRejectedValue(error)

      const store = useResumeStore()
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json"
      })
      await expect(store.importResume(file)).rejects.toThrow("Import failed")
    })
  })
}) 