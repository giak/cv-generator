import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { EducationInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Interface extended to include ID
export interface EducationWithId extends EducationInterface {
  id?: string
}

// Interface for validated education
export interface ValidatedEducation {
  id: string
  institution: string
  area: string
  studyType: string
  startDate: string
  endDate?: string
  score?: string
  url?: string
  courses?: string[]
  toJSON: () => EducationWithId
}

// Interface for the Education Store state
export interface EducationStoreState {
  educations: ValidatedEducation[] | null
  loading: boolean
}

// Interface for the Education Store actions
export interface EducationStoreActions {
  // Load education entries
  loadEducation(): Promise<ValidatedEducation[]>
  
  // Add a new education entry
  addEducation(education: EducationInterface): Promise<void>
  
  // Update an existing education entry
  updateEducation(id: string, education: EducationInterface): Promise<void>
  
  // Delete an education entry
  deleteEducation(id: string): Promise<void>
  
  // Reorder education entries
  reorderEducation(newOrder: string[]): Promise<void>
}

// Define the Education Store
export const useEducationStore = defineStore('education', () => {
  // State
  const educations = ref<ValidatedEducation[] | null>(null)
  const loading = ref(false)
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  
  // Resume manager with repository instance
  const manageResume = new ManageResume(repository)
  
  // Helper to generate a unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
  
  // Load education entries
  const loadEducation = async (): Promise<ValidatedEducation[]> => {
    loading.value = true
    
    try {
      console.log('Loading education entries...')
      
      // Create repository and load resume
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      // If resumeData is valid and resume property exists
      if (result) {
        // Check if have education data
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error);
          resumeData = { education: [] };
        }
        
        const educationData = resumeData.education || []
        
        console.log('Loaded education data:', educationData)
        
        // Map to ValidatedEducation objects
        educations.value = educationData.map(edu => {
          const education = edu as EducationWithId
          return {
            id: education.id || generateId(),
            institution: education.institution || '',
            area: education.area || '',
            studyType: education.studyType || '',
            startDate: education.startDate || '',
            endDate: education.endDate || '',
            score: education.score || '',
            url: education.url || '',
            courses: education.courses || [],
            toJSON: () => ({
              ...education,
              id: education.id || generateId()
            })
          }
        })
        
        return educations.value
      } else {
        console.warn('No valid resume found or no education data')
        educations.value = []
        return []
      }
    } catch (error) {
      console.error('Error loading education entries:', error)
      educations.value = []
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Add a new education entry
  const addEducation = async (education: EducationInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Adding new education entry:', education)
      
      if (!education.institution || !education.area || !education.studyType || !education.startDate) {
        throw new Error('Missing required fields')
      }
      
      // Generate ID for the new education entry
      const educationWithId: EducationWithId = {
        ...education,
        id: generateId()
      }
      
      // Load current education entries if needed
      if (!educations.value) {
        await loadEducation()
      }
      
      // Add to local state first
      const newItem: ValidatedEducation = {
        id: educationWithId.id as string,
        institution: education.institution,
        area: education.area,
        studyType: education.studyType,
        startDate: education.startDate,
        endDate: education.endDate || '',
        score: education.score || '',
        url: education.url || '',
        courses: education.courses || [],
        toJSON: () => educationWithId
      }
      
      educations.value = [newItem, ...(educations.value || [])]
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty education array if needed
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON, creating new data structure');
          updatedData = {
            basics: {
              name: '',
              email: '',
              label: '',
              phone: '',
              summary: '',
              location: { address: '', postalCode: '', city: '', region: '' },
              profiles: []
            },
            education: []
          };
        }
        
        // Ensure education array exists
        if (!updatedData.education) {
          updatedData.education = [];
        }
        
        // Add new education to the beginning
        updatedData.education = [
          educationWithId,
          ...updatedData.education
        ];
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Education entry added successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Remove from local state on error
        educations.value = educations.value?.filter(e => e.id !== newItem.id) || null;
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible d\'ajouter l\'expérience éducative',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error adding education entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Update an existing education entry
  const updateEducation = async (id: string, education: EducationInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Updating education entry:', id, education)
      
      if (!education.institution || !education.area || !education.studyType || !education.startDate) {
        throw new Error('Missing required fields')
      }
      
      // Update local state first
      if (educations.value) {
        educations.value = educations.value.map(edu => {
          if (edu.id === id) {
            return {
              id,
              institution: education.institution,
              area: education.area,
              studyType: education.studyType,
              startDate: education.startDate,
              endDate: education.endDate || '',
              score: education.score || '',
              url: education.url || '',
              courses: education.courses || [],
              toJSON: () => ({
                ...education,
                id
              })
            }
          }
          return edu
        })
      }
      
      // Save to storage
      const educationWithId: EducationWithId = {
        ...education,
        id
      }
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data and ensure education array exists
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON, creating new structure');
          resumeData = {
            basics: {
              name: '',
              email: '',
              label: '',
              phone: '',
              summary: '',
              location: { address: '', postalCode: '', city: '', region: '' },
              profiles: []
            },
            education: []
          };
        }
        
        // Ensure education array exists
        if (!resumeData.education) {
          resumeData.education = [];
        }
        
        // Replace education with matching ID
        const updatedEducation = resumeData.education.map((edu: any) => {
          const eduWithId = edu as EducationWithId
          return eduWithId.id === id ? educationWithId : edu
        })
        
        // Update the resume data
        resumeData.education = updatedEducation;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Education entry updated successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload education on error to reset state
        await loadEducation();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de mettre à jour l\'expérience éducative',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating education entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Delete an education entry
  const deleteEducation = async (id: string): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Deleting education entry:', id)
      
      // Update local state first
      if (educations.value) {
        educations.value = educations.value.filter(edu => edu.id !== id)
      }
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          return // No education data to delete
        }
        
        // Get current data and filter out education with matching ID
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          return; // No education data to delete
        }
        
        if (!resumeData.education) {
          return; // No education data to delete
        }
        
        // Filter out education with matching ID
        const updatedEducation = resumeData.education.filter((edu: any) => {
          const eduWithId = edu as EducationWithId
          return eduWithId.id !== id
        })
        
        // Update the resume data
        resumeData.education = updatedEducation;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Education entry deleted successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload education on error to reset state
        await loadEducation();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de supprimer l\'expérience éducative',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error deleting education entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Reorder education entries
  const reorderEducation = async (newOrder: string[]): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Reordering education entries:', newOrder)
      
      if (!educations.value || educations.value.length === 0) {
        console.warn('No education entries to reorder')
        return
      }
      
      // Create a map for quick lookup
      const educationsMap = new Map<string, ValidatedEducation>()
      educations.value.forEach(edu => educationsMap.set(edu.id, edu))
      
      // Reorder using the map and new order
      const reorderedEducation = newOrder
        .map(id => educationsMap.get(id))
        .filter((edu): edu is ValidatedEducation => edu !== undefined)
      
      // Update local state
      educations.value = reorderedEducation
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          return // No education data to reorder
        }
        
        // Get current data and reorder education
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          return; // No education data to reorder
        }
        
        if (!resumeData.education) {
          return; // No education data to reorder
        }
        
        // Convert to EducationInterface array
        const reorderedEducationData = reorderedEducation.map(edu => edu.toJSON())
        
        // Update the resume data
        resumeData.education = reorderedEducationData;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Education entries reordered successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload education on error to reset state
        await loadEducation();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de réorganiser les expériences éducatives',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error reordering education entries:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    educations,
    loading,
    
    // Actions
    loadEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    reorderEducation
  }
})

export type EducationStore = ReturnType<typeof useEducationStore> 