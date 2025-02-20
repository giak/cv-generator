import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Resume } from "@cv-generator/core";

// Mock des dépendances
const mockRepository = {
  load: vi.fn(),
  save: vi.fn(),
  export: vi.fn(),
  import: vi.fn(),
};

// Mock du package core
vi.mock("@cv-generator/core", () => ({
  Resume: {
    create: (data: ResumeInterface) => ({
      isValid: true,
      resume: {
        ...data,
        toJSON: () => ({ ...data }),
        get basics() {
          return { ...data.basics };
        },
        get work() {
          return [...(data.work || [])];
        },
        get education() {
          return [...(data.education || [])];
        },
        get skills() {
          return [...(data.skills || [])];
        },
      },
    }),
  },
  ManageResume: vi.fn().mockImplementation(() => ({
    loadResume: () => mockRepository.load(),
    createResume: (data: ResumeInterface) => mockRepository.save(data),
    exportResume: (format: string) => mockRepository.export(format),
    importResume: (file: Blob) => mockRepository.import(file),
  })),
}));

vi.mock("@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository", () => ({
  LocalStorageResumeRepository: vi.fn().mockImplementation(() => mockRepository),
}));

// Import après les mocks
import { useResumeStore } from "../resume";

// Mock du résumé complet
const mockResumeData: ResumeInterface = {
  basics: {
    name: "John Doe",
    email: "john@example.com",
  },
  work: [],
  education: [],
  skills: [],
};

// Création d'un mock Resume
const createMockResume = () => {
  const { resume } = Resume.create(mockResumeData);
  return resume;
};

describe("Resume Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("loadResume", () => {
    it("should load resume successfully", async () => {
      const store = useResumeStore();
      const mockResume = createMockResume();
      mockRepository.load.mockResolvedValue(mockResume);

      await store.loadResume();

      expect(store.resume).toEqual(mockResume);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(mockRepository.load).toHaveBeenCalledTimes(1);
    });

    it("should handle load error", async () => {
      const store = useResumeStore();
      const error = new Error("Load failed");
      mockRepository.load.mockRejectedValue(error);

      await store.loadResume();

      expect(store.resume).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBe(error);
      expect(mockRepository.load).toHaveBeenCalledTimes(1);
    });

    it("should handle non-Error load error", async () => {
      const store = useResumeStore();
      mockRepository.load.mockRejectedValue("Invalid resume");

      await store.loadResume();

      expect(store.resume).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBeInstanceOf(Error);
      expect(store.error?.message).toBe("Failed to load resume");
    });
  });

  describe("saveResume", () => {
    it("should save resume successfully", async () => {
      const store = useResumeStore();
      const mockResume = createMockResume();

      mockRepository.save.mockResolvedValue(undefined);

      await store.saveResume(mockResume);

      expect(store.resume).toEqual(mockResume);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(mockResumeData));
    });

    it("should handle save error", async () => {
      const store = useResumeStore();
      const mockResume = createMockResume();
      const error = new Error("Save failed");

      mockRepository.save.mockRejectedValue(error);

      await expect(store.saveResume(mockResume)).rejects.toThrow("Save failed");
      expect(store.loading).toBe(false);
      expect(store.error).toBe(error);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(mockResumeData));
    });

    it("should handle non-Error save error", async () => {
      const store = useResumeStore();
      const mockResume = createMockResume();

      mockRepository.save.mockRejectedValue("Invalid data");

      await expect(store.saveResume(mockResume)).rejects.toThrow("Failed to save resume");
      expect(store.loading).toBe(false);
      expect(store.error).toBeInstanceOf(Error);
      expect(store.error?.message).toBe("Failed to save resume");
    });
  });

  describe("exportResume", () => {
    it.each(["json", "pdf", "html"] as const)(
      "should export resume as %s successfully",
      async (format) => {
        const store = useResumeStore();
        const mockExport = new File([`${format} content`], `resume.${format}`, {
          type: `application/${format}`,
        });
        mockRepository.export.mockResolvedValue(mockExport);

        const result = await store.exportResume(format);

        expect(result).toEqual(mockExport);
        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(mockRepository.export).toHaveBeenCalledWith(format);
      }
    );

    it.each(["json", "pdf", "html"] as const)(
      "should handle export error for %s format",
      async (format) => {
        const store = useResumeStore();
        const error = new Error(`Export failed for ${format}`);
        mockRepository.export.mockRejectedValue(error);

        await expect(store.exportResume(format)).rejects.toThrow(`Export failed for ${format}`);
        expect(store.loading).toBe(false);
        expect(store.error).toBe(error);
        expect(mockRepository.export).toHaveBeenCalledWith(format);
      }
    );

    it("should handle non-Error export error", async () => {
      const store = useResumeStore();
      mockRepository.export.mockRejectedValue("Export failed");

      await expect(store.exportResume("json")).rejects.toThrow("Failed to export resume as json");
      expect(store.loading).toBe(false);
      expect(store.error).toBeInstanceOf(Error);
      expect(store.error?.message).toBe("Failed to export resume as json");
    });
  });

  describe("importResume", () => {
    it("should import resume successfully", async () => {
      const store = useResumeStore();
      const mockResume = createMockResume();
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json",
      });
      mockRepository.import.mockResolvedValue(mockResume);

      await store.importResume(file);

      expect(store.resume).toEqual(mockResume);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(mockRepository.import).toHaveBeenCalledWith(file);
    });

    it("should handle import error", async () => {
      const store = useResumeStore();
      const error = new Error("Import failed");
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json",
      });
      mockRepository.import.mockRejectedValue(error);

      await expect(store.importResume(file)).rejects.toThrow("Import failed");
      expect(store.loading).toBe(false);
      expect(store.error).toBe(error);
      expect(mockRepository.import).toHaveBeenCalledWith(file);
    });

    it("should handle non-Error import error", async () => {
      const store = useResumeStore();
      const file = new File([JSON.stringify(mockResumeData)], "resume.json", {
        type: "application/json",
      });
      mockRepository.import.mockRejectedValue("Invalid file");

      await expect(store.importResume(file)).rejects.toThrow("Failed to import resume");
      expect(store.loading).toBe(false);
      expect(store.error).toBeInstanceOf(Error);
      expect(store.error?.message).toBe("Failed to import resume");
    });
  });
});
