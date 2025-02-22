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
      resume.value = await useCase.loadResume();
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

  async function exportResume(format: "json" | "pdf" | "html") {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      return await useCase.exportResume(format);
    } catch (err) {
      console.error(`Failed to export resume as ${format}:`, err);
      error.value = err instanceof Error ? err : new Error(`Failed to export resume as ${format}`);
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function importResume(file: Blob) {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    try {
      resume.value = await useCase.importResume(file);
    } catch (err) {
      console.error("Failed to import resume:", err);
      error.value = err instanceof Error ? err : new Error("Failed to import resume");
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  // Charger les données immédiatement
  loadResume();

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
