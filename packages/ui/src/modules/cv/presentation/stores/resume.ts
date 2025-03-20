import type { ResumeInterface } from "@cv-generator/core"
import { ManageResume, Resume as ResumeEntity } from "@cv-generator/core"
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/repositories/LocalStorageResumeRepository"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useErrorStore } from "../../../../core/stores/error"
import { useWorkStore } from "./work"
import { useVolunteerStore } from "./volunteer"
import { useEducationStore } from "./education"
import { useProjectStore } from "./project"

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
  const resume = ref<ResumeEntity | null>(null)
  const loading = ref(false)
  
  // Get error store
  const errorStore = useErrorStore()

  // Use case instance
  const useCase = createUseCase()

  // Actions
  const actions: ResumeStoreActions = {
    async loadResume() {

      loading.value = true
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await useCase.loadResume()
        })
        
        if (result) {

          resume.value = result
        }
      } finally {
        loading.value = false
      }
    },

    async saveResume(data: ResumeInterface) {

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

          } else {}
        } catch (error) {}
        
        // Step 2: Load data from other stores if they're initialized
        // This ensures we have the most recent data from all sections
        // (they might have been modified but not yet saved)
        let workData = currentData.work || []
        let volunteerData = currentData.volunteer || []
        let educationData = currentData.education || []
        let projectData = currentData.projects || []
        
        // Get the work store instance and ensure it's loaded
        const workStore = useWorkStore()
        if (workStore) {
          try {
            if (!workStore.works || workStore.works.length === 0) {

              await workStore.loadWorks()
            }
            
            if (workStore.works && workStore.works.length > 0) {

              workData = workStore.works.map(work => work.toJSON())
            } else {}
          } catch (e) {}
        }
        
        // Get the volunteer store instance and ensure it's loaded
        const volunteerStore = useVolunteerStore()
        if (volunteerStore) {
          try {
            if (!volunteerStore.volunteers || volunteerStore.volunteers.length === 0) {

              await volunteerStore.loadVolunteers()
            }
            
            if (volunteerStore.volunteers && volunteerStore.volunteers.length > 0) {

              volunteerData = volunteerStore.volunteers.map(volunteer => volunteer.toJSON())
            } else {}
          } catch (e) {}
        }
        
        // Get the education store instance and ensure it's loaded
        const educationStore = useEducationStore()
        if (educationStore) {
          try {
            if (!educationStore.educations || educationStore.educations.length === 0) {

              await educationStore.loadEducation()
            }
            
            if (educationStore.educations && educationStore.educations.length > 0) {

              educationData = educationStore.educations.map(education => {
                const mapped = education.toJSON()

                return mapped
              })

            } else {}
          } catch (e) {}
        }
        
        // Get the project store instance and ensure it's loaded
        const projectStore = useProjectStore()
        if (projectStore) {
          try {
            if (!projectStore.projects || projectStore.projects.length === 0) {

              await projectStore.loadProjects()
            }
            
            if (projectStore.projects && projectStore.projects.length > 0) {

              projectData = projectStore.projects
            } else {}
          } catch (e) {}
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
          
          // Explicitly include work, volunteer, education and project data from their respective stores
          work: workData,
          volunteer: volunteerData,
          education: educationData,
          projects: projectData,
          
          // Preserve other sections if they exist
          awards: currentData.awards || [],
          certificates: currentData.certificates || [],
          publications: currentData.publications || [],
          skills: currentData.skills || [],
          languages: currentData.languages || [],
          interests: currentData.interests || [],
          references: currentData.references || []
        }

        // Step 4: Save the complete resume
        await errorStore.executeWithErrorHandling(async () => {
          // Create a Resume instance with the complete data
          const resumeInstance = ResumeEntity.create(completeData)

          if (resumeInstance.resume) {
            // Save the complete CV
            await useCase.createResume(resumeInstance.resume.toJSON())

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
