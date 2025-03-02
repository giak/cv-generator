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
      console.log('[Store] Received data to update:', JSON.stringify(data))
      loading.value = true
      
      try {
        // Création d'un repository temporaire pour charger les données actuelles
        // Ceci garantit qu'on a toujours les données les plus récentes
        const repository = new LocalStorageResumeRepository()
        
        // Obtention du CV actuel directement du localStorage
        let currentData = {}
        try {
          const rawResult = await repository.load()
          // Le type retourné doit être vérifié dynamiquement
          if (rawResult && typeof rawResult === 'object' && 'isValid' in rawResult && rawResult.isValid && 'resume' in rawResult && rawResult.resume) {
            // Utiliser une assertion de type pour indiquer à TypeScript que resume a une méthode toJSON
            const resumeWithMethods = rawResult.resume as { toJSON: () => Record<string, any> };
            currentData = resumeWithMethods.toJSON()
            console.log('[Store] Loaded current resume from storage:', JSON.stringify(currentData))
          } else {
            console.log('[Store] No valid resume found in storage, creating new')
          }
        } catch (error) {
          console.error('[Store] Error loading resume from storage:', error)
          console.log('[Store] Will proceed with empty resume')
        }
        
        // Fusion des données existantes avec les nouvelles
        const completeData = {
          // Conserver toutes les sections existantes
          ...currentData,
          // Mise à jour uniquement de la section basics
          basics: {
            name: data.basics.name || '',
            email: data.basics.email || '',
            label: data.basics.label || '',
            phone: data.basics.phone || '',
            url: data.basics.url || '',
            image: data.basics.image || '', // Inclusion explicite du champ image
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
          }
        }
        
        console.log('[Store] Merged complete data for saving:', JSON.stringify(completeData))
        
        await errorStore.executeWithErrorHandling(async () => {
          // Créer une instance de Resume avec les données fusionnées
          const resumeInstance = ResumeEntity.create(completeData)
          console.log('[Store] Created Resume instance with ALL sections:', resumeInstance)

          if (resumeInstance.resume) {
            // Sauvegarde du CV complet
            await useCase.createResume(resumeInstance.resume.toJSON())
            console.log('[Store] Resume saved successfully with all sections preserved')
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