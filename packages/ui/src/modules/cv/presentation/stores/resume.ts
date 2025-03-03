import type { Resume, ResumeInterface } from "@cv-generator/core"
import { ManageResume, Resume as ResumeEntity } from "@cv-generator/core"
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useErrorStore } from "../../../../core/stores/error"
import { useWorkStore } from "./work"
import { useVolunteerStore } from "./volunteer"
import { useEducationStore } from "./education"

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
      console.log('[Store] Received data to save:', JSON.stringify(data))
      loading.value = true
      
      try {
        // Step 1: Load current data using a temporary repository
        // This ensures we have the most recent data
        const repository = new LocalStorageResumeRepository()
        // Initialize with empty object that has the required basics property
        let currentData: ResumeInterface = {
          basics: {
            name: '',
            email: '',
            label: '',
            phone: '',
            url: '',
            image: '',
            summary: '',
            location: {
              address: '',
              postalCode: '',
              city: '',
              countryCode: '',
              region: ''
            },
            profiles: []
          }
        }
        
        try {
          const rawResult = await repository.load()
          if (rawResult) {
            // Convert resume instance to JSON
            currentData = rawResult.toJSON()
            console.log('[Store] Loaded current resume from storage:', JSON.stringify(currentData))
          } else {
            console.log('[Store] No valid resume found in storage, creating new')
          }
        } catch (error) {
          console.error('[Store] Error loading resume from storage:', error)
          console.log('[Store] Will proceed with empty resume')
        }
        
        // Step 2: Load data from other stores if they're initialized
        // This ensures we have the most recent data from all sections
        // (they might have been modified but not yet saved)
        let workData = currentData.work || []
        let volunteerData = currentData.volunteer || []
        let educationData = currentData.education || []
        
        // Get the work store instance and ensure it's loaded
        const workStore = useWorkStore()
        if (workStore) {
          try {
            if (!workStore.works || workStore.works.length === 0) {
              console.log('[Store] Loading work data from work store')
              await workStore.loadWorks()
            }
            
            if (workStore.works && workStore.works.length > 0) {
              console.log('[Store] Using data from work store:', workStore.works.length, 'entries')
              workData = workStore.works.map(work => work.toJSON())
            } else {
              console.log('[Store] Work store has no data, using current data from storage')
            }
          } catch (e) {
            console.error('[Store] Error loading work data:', e)
          }
        }
        
        // Get the volunteer store instance and ensure it's loaded
        const volunteerStore = useVolunteerStore()
        if (volunteerStore) {
          try {
            if (!volunteerStore.volunteers || volunteerStore.volunteers.length === 0) {
              console.log('[Store] Loading volunteer data from volunteer store')
              await volunteerStore.loadVolunteers()
            }
            
            if (volunteerStore.volunteers && volunteerStore.volunteers.length > 0) {
              console.log('[Store] Using data from volunteer store:', volunteerStore.volunteers.length, 'entries')
              volunteerData = volunteerStore.volunteers.map(volunteer => volunteer.toJSON())
            } else {
              console.log('[Store] Volunteer store has no data, using current data from storage')
            }
          } catch (e) {
            console.error('[Store] Error loading volunteer data:', e)
          }
        }
        
        // Get the education store instance and ensure it's loaded
        const educationStore = useEducationStore()
        if (educationStore) {
          try {
            if (!educationStore.educations || educationStore.educations.length === 0) {
              console.log('[Store] Loading education data from education store')
              await educationStore.loadEducation()
            }
            
            if (educationStore.educations && educationStore.educations.length > 0) {
              console.log('[Store] Using data from education store:', educationStore.educations.length, 'entries')
              console.log('[Store] Education data BEFORE mapping:', JSON.stringify(educationStore.educations))
              educationData = educationStore.educations.map(education => {
                const mapped = education.toJSON()
                console.log('[Store] Mapped education entry:', JSON.stringify(mapped))
                return mapped
              })
              console.log('[Store] Final education data AFTER mapping:', JSON.stringify(educationData))
            } else {
              console.log('[Store] Education store has no data, using current data from storage')
            }
          } catch (e) {
            console.error('[Store] Error loading education data:', e)
          }
        }
        
        // Step 3: Create complete resume data by merging everything
        const completeData: ResumeInterface = {
          // Start with any existing data
          ...currentData,
          
          // Update with new data provided to this method (typically basics)
          basics: data.basics || currentData.basics || {
            name: '',
            email: '',
            label: '',
            phone: '',
            url: '',
            image: '',
            summary: '',
            location: {
              address: '',
              postalCode: '',
              city: '',
              countryCode: '',
              region: ''
            },
            profiles: []
          },
          
          // Explicitly include work, volunteer, and education data from their respective stores
          work: workData,
          volunteer: volunteerData,
          education: educationData,
          
          // Preserve other sections if they exist
          awards: currentData.awards || [],
          certificates: currentData.certificates || [],
          publications: currentData.publications || [],
          skills: currentData.skills || [],
          languages: currentData.languages || [],
          interests: currentData.interests || [],
          references: currentData.references || [],
          projects: currentData.projects || []
        }
        
        console.log('[Store] Complete aggregate data for saving:', JSON.stringify(completeData))
        
        // Step 4: Save the complete resume
        await errorStore.executeWithErrorHandling(async () => {
          // Create a Resume instance with the complete data
          const resumeInstance = ResumeEntity.create(completeData)
          console.log('[Store] Created Resume instance with ALL sections:', resumeInstance)

          if (resumeInstance.resume) {
            // Save the complete CV
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