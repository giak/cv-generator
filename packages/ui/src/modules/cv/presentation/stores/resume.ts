import type { Resume } from "@cv-generator/core"
import { ManageResume } from "@cv-generator/core"
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository"
import { defineStore } from "pinia"
import { ref } from "vue"

interface ResumeStoreState {
  resume: Resume | null
  loading: boolean
  error: Error | null
}

interface ResumeStoreActions {
  loadResume(): Promise<void>
  saveResume(data: Resume): Promise<void>
  exportResume(format: "json" | "pdf" | "html"): Promise<Blob>
  importResume(file: File): Promise<void>
}

// Factory pour créer le use case, ce qui facilite le mock dans les tests
const createUseCase = () => {
  const repository = new LocalStorageResumeRepository()
  return new ManageResume(repository)
}

export const useResumeStore = defineStore("cv.resume", () => {
  // State
  const resume = ref<Resume | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Use case instance
  const useCase = createUseCase()

  // Actions
  const actions: ResumeStoreActions = {
    async loadResume() {
      if (loading.value) return
      
      loading.value = true
      error.value = null
      try {
        const result = await useCase.loadResume()
        resume.value = result
      } catch (err) {
        console.error("Failed to load resume:", err)
        error.value = err instanceof Error ? err : new Error("Failed to load resume")
        resume.value = null
      } finally {
        loading.value = false
      }
    },

    async saveResume(data: Resume) {
      if (loading.value) return
      
      loading.value = true
      error.value = null
      try {
        await useCase.createResume(data.toJSON())
        resume.value = data
      } catch (err) {
        console.error("Failed to save resume:", err)
        error.value = err instanceof Error ? err : new Error("Failed to save resume")
        throw error.value
      } finally {
        loading.value = false
      }
    },

    async exportResume(format: "json" | "pdf" | "html"): Promise<Blob> {
      if (loading.value) return Promise.reject(new Error("Operation in progress"))
      
      loading.value = true
      error.value = null
      try {
        const result = await useCase.exportResume(format)
        if (!result) {
          throw new Error("Failed to export resume")
        }
        return result
      } catch (err) {
        console.error("Failed to export resume:", err)
        error.value = err instanceof Error ? err : new Error("Failed to export resume")
        throw error.value
      } finally {
        loading.value = false
      }
    },

    async importResume(file: File) {
      if (loading.value) return Promise.reject(new Error("Operation in progress"))
      
      loading.value = true
      error.value = null
      try {
        const result = await useCase.importResume(file)
        if (!result) {
          throw new Error("Failed to import resume")
        }
        resume.value = result
      } catch (err) {
        console.error("Failed to import resume:", err)
        error.value = err instanceof Error ? err : new Error("Failed to import resume")
        throw error.value
      } finally {
        loading.value = false
      }
    }
  }

  return {
    // State
    resume,
    loading,
    error,
    
    // Actions
    ...actions
  }
}) 