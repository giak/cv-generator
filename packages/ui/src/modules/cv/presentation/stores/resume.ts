import type { Resume, ResumeInterface } from "@cv-generator/core"
import { ManageResume, Resume as ResumeEntity } from "@cv-generator/core"
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
  saveResume(data: ResumeInterface): Promise<void>
  exportResume(format: "json" | "pdf" | "html"): Promise<Blob>
  importResume(file: File): Promise<void>
}

// Create use case instance
function createUseCase() {
  return new ManageResume(new LocalStorageResumeRepository())
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
      console.log('=== [Store] loadResume ===')
      loading.value = true
      
      try {
        const result = await useCase.loadResume()
        console.log('[Store] Loaded resume:', result)
        resume.value = result
      } catch (err) {
        console.error('[Store] Failed to load resume:', err)
        error.value = err instanceof Error ? err : new Error('Failed to load resume')
        resume.value = null
      } finally {
        loading.value = false
      }
    },

    async saveResume(data: ResumeInterface) {
      console.log('=== [Store] saveResume ===')
      console.log('[Store] Received data:', data)
      loading.value = true
      
      try {
        // Nettoyer les données avant de créer l'instance
        const cleanData = {
          basics: {
            name: data.basics.name || '',
            email: data.basics.email || '',
            label: data.basics.label || '',
            phone: data.basics.phone || '',
            url: data.basics.url || '',  // Utiliser une chaîne vide au lieu de null
            summary: data.basics.summary || '',
            location: data.basics.location ? {
              address: data.basics.location.address || '',
              postalCode: data.basics.location.postalCode || '',
              city: data.basics.location.city || '',
              countryCode: data.basics.location.countryCode || '',
              region: data.basics.location.region || ''
            } : undefined,
            profiles: (data.basics.profiles || []).map(profile => ({
              network: profile.network || '',
              username: profile.username || '',
              url: profile.url || ''
            }))
          },
          work: [],
          education: [],
          skills: []
        }
        
        console.log('[Store] Cleaned data:', cleanData)
        
        // Créer une instance de Resume avec les données nettoyées
        const resumeInstance = ResumeEntity.create(cleanData)
        console.log('[Store] Created Resume instance:', resumeInstance)

        if (resumeInstance.resume) {
          await useCase.createResume(resumeInstance.resume)
          console.log('[Store] Resume saved successfully')
          
          const loadedResume = await useCase.loadResume()
          console.log('[Store] Reloaded resume:', loadedResume)
          resume.value = loadedResume
        } else {
          throw new Error('Failed to create Resume instance')
        }
      } catch (err) {
        console.error('[Store] Error saving resume:', err)
        error.value = err instanceof Error ? err : new Error('Failed to save resume')
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

    async importResume(file: File): Promise<void> {
      if (loading.value) return Promise.reject(new Error("Operation in progress"))
      
      loading.value = true
      error.value = null
      try {
        const result = await useCase.importResume(file)
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