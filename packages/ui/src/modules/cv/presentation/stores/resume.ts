import type { Resume, ResumeInterface } from "@cv-generator/core"
import { ManageResume, Resume as ResumeEntity } from "@cv-generator/core"
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useErrorStore } from "../../../../core/stores/error"

interface ResumeStoreState {
  resume: Resume | null
  loading: boolean
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
  
  // Get error store
  const errorStore = useErrorStore()

  // Use case instance
  const useCase = createUseCase()

  // Actions
  const actions: ResumeStoreActions = {
    async loadResume() {
      console.log('=== [Store] loadResume ===')
      loading.value = true
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await useCase.loadResume()
        })
        
        if (result) {
          console.log('[Store] Loaded resume:', result)
          resume.value = result
        }
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
            url: data.basics.url || '',
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
        
        await errorStore.executeWithErrorHandling(async () => {
          // Créer une instance de Resume avec les données nettoyées
          const resumeInstance = ResumeEntity.create(cleanData)
          console.log('[Store] Created Resume instance:', resumeInstance)

          if (resumeInstance.resume) {
            await useCase.createResume(resumeInstance.resume.toJSON())
            console.log('[Store] Resume saved successfully')
            resume.value = resumeInstance.resume
          } else {
            throw new Error('Failed to create Resume instance')
          }
        }, { showToast: true });
      } finally {
        loading.value = false
      }
    },

    async exportResume(format: "json" | "pdf" | "html"): Promise<Blob> {
      if (loading.value) return Promise.reject(new Error("Operation in progress"))
      
      loading.value = true
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          const exportResult = await useCase.exportResume(format)
          if (!exportResult) {
            throw new Error("Failed to export resume")
          }
          return exportResult
        }, { rethrow: true });
        
        return result as Blob;
      } finally {
        loading.value = false
      }
    },

    async importResume(file: File): Promise<void> {
      if (loading.value) return Promise.reject(new Error("Operation in progress"))
      
      loading.value = true
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await useCase.importResume(file)
        });
        
        if (result) {
          resume.value = result
        }
      } finally {
        loading.value = false
      }
    }
  }

  return {
    // State
    resume,
    loading,
    // Actions
    ...actions,
    // Expose hasErrors pour les composants
    get hasErrors() {
      return errorStore.hasErrors
    },
    // Expose les méthodes pour vérifier les erreurs de champ
    hasFieldError(field: string) {
      return errorStore.hasFieldError(field)
    },
    getFieldError(field: string) {
      return errorStore.getFieldError(field)
    }
  }
}); 