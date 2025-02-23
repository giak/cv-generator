import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface"
import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Resume, ManageResume } from "@cv-generator/core"

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
      const store = useResumeStore()
      const mockResume = Resume.create(mockResumeData).resume
      mockRepository.load.mockResolvedValue(mockResume)

      await store.loadResume()

      expect(store.resume).toEqual(mockResume)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it("should handle load error", async () => {
      const store = useResumeStore()
      const error = new Error("Load failed")
      mockRepository.load.mockRejectedValue(error)

      await store.loadResume()

      expect(store.resume).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(error)
    })
  })

  describe("saveResume", () => {
    it("should save resume successfully", async () => {
      const store = useResumeStore()
      const mockResume = Resume.create(mockResumeData).resume
      mockRepository.save.mockResolvedValue(undefined)

      await store.saveResume(mockResume)

      expect(store.resume).toEqual(mockResume)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockRepository.save).toHaveBeenCalledWith(mockResumeData)
    })

    it("should handle save error", async () => {
      const store = useResumeStore()
      const mockResume = Resume.create(mockResumeData).resume
      const error = new Error("Save failed")
      mockRepository.save.mockRejectedValue(error)

      await expect(store.saveResume(mockResume)).rejects.toThrow(error)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(error)
    })
  })

  describe("exportResume", () => {
    it.each(["json", "pdf", "html"] as const)("should export resume as %s", async (format) => {
      const store = useResumeStore()
      const mockBlob = new Blob(["test"])
      mockRepository.export.mockResolvedValue(mockBlob)

      const result = await store.exportResume(format)

      expect(result).toBe(mockBlob)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockRepository.export).toHaveBeenCalledWith(format)
    })

    it("should handle export error", async () => {
      const store = useResumeStore()
      const error = new Error("Export failed")
      mockRepository.export.mockRejectedValue(error)

      await expect(store.exportResume("json")).rejects.toThrow(error)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(error)
    })
  })

  describe("importResume", () => {
    it("should import resume successfully", async () => {
      const store = useResumeStore()
      const mockResume = Resume.create(mockResumeData).resume
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json",
      })
      mockRepository.import.mockResolvedValue(mockResume)

      await store.importResume(file)

      expect(store.resume).toEqual(mockResume)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(mockRepository.import).toHaveBeenCalledWith(file)
    })

    it("should handle import error", async () => {
      const store = useResumeStore()
      const error = new Error("Import failed")
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json",
      })
      mockRepository.import.mockRejectedValue(error)

      await expect(store.importResume(file)).rejects.toThrow(error)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(error)
    })
  })
}) 