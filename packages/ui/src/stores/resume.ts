import { ManageResume } from "@cv-generator/core/src/application/useCases/ManageResume";
import type { Resume } from "@cv-generator/core/src/domain/entities/Resume";
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository";
import { defineStore } from "pinia";
import { ref } from "vue";

// Factory pour créer le use case, ce qui facilite le mock dans les tests
export const createUseCase = () => {
  const repository = new LocalStorageResumeRepository();
  return new ManageResume(repository);
};

export const useResumeStore = defineStore("resume", () => {
  const resume = ref<Resume | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const useCase = createUseCase();

  async function loadResume() {
    loading.value = true;
    error.value = null;
    try {
      resume.value = await useCase.loadResume();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Failed to load resume");
      resume.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function saveResume(data: Resume) {
    loading.value = true;
    error.value = null;
    try {
      await useCase.createResume(data.toJSON());
      resume.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Failed to save resume");
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function exportResume(format: "json" | "pdf" | "html") {
    loading.value = true;
    error.value = null;
    try {
      return await useCase.exportResume(format);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(`Failed to export resume as ${format}`);
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function importResume(file: Blob) {
    loading.value = true;
    error.value = null;
    try {
      resume.value = await useCase.importResume(file);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Failed to import resume");
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    resume,
    loading,
    error,
    loadResume,
    saveResume,
    exportResume,
    importResume,
  };
});
