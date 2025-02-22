import { ManageResume, type Resume } from "@cv-generator/core";
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
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      const result = await useCase.loadResume();
      resume.value = result;
    } catch (err) {
      console.error("Failed to load resume:", err);
      error.value = err instanceof Error ? err : new Error("Failed to load resume");
      resume.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function saveResume(data: Resume) {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      await useCase.createResume(data.toJSON());
      resume.value = data;
    } catch (err) {
      console.error("Failed to save resume:", err);
      error.value = err instanceof Error ? err : new Error("Failed to save resume");
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function exportResume(format: "json" | "pdf" | "html"): Promise<Blob> {
    if (loading.value) return Promise.reject(new Error("Operation in progress"));
    
    loading.value = true;
    error.value = null;
    try {
      const result = await useCase.exportResume(format);
      if (!result) {
        throw new Error("Failed to export resume");
      }
      return result;
    } catch (err) {
      console.error("Failed to export resume:", err);
      error.value = err instanceof Error ? err : new Error("Failed to export resume");
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function importResume(file: File) {
    if (loading.value) return Promise.reject(new Error("Operation in progress"));
    
    loading.value = true;
    error.value = null;
    try {
      const result = await useCase.importResume(file);
      if (!result) {
        throw new Error("Failed to import resume");
      }
      resume.value = result;
    } catch (err) {
      console.error("Failed to import resume:", err);
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
