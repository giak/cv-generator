import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import type { InterestInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Interface extended to include ID
export interface InterestWithId extends InterestInterface {
  id?: string
}

// Interface for validated interest
export interface ValidatedInterest {
  id: string
  name: string
  keywords: string[]
  toJSON: () => InterestWithId
}

// Interface for the Interest Store state
export interface InterestStoreState {
  interests: ValidatedInterest[] | null
  loading: {
    interests: boolean
    adding: boolean
    updating: boolean
    deleting: boolean
  }
}

// Interface for the Interest Store actions
export interface InterestStoreActions {
  // Load interest entries
  loadInterests(): Promise<ValidatedInterest[]>
  
  // Add a new interest entry
  addInterest(interest: InterestInterface): Promise<void>
  
  // Update an existing interest entry
  updateInterest(id: string, interest: InterestInterface): Promise<void>
  
  // Delete an interest entry
  deleteInterest(id: string): Promise<void>
  
  // Reorder interest entries
  reorderInterests(newOrder: string[]): Promise<void>
}

// Define the Interest Store
export const useInterestStore = defineStore('interest', () => {
  // State
  const interests = ref<ValidatedInterest[] | null>(null)
  const loading = ref({
    interests: false,
    adding: false,
    updating: false,
    deleting: false
  })
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  
  // Resume manager with repository instance
  
  // Helper to generate a unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
  
  // Load interest entries
  const loadInterests = async (): Promise<ValidatedInterest[]> => {
    loading.value.interests = true
    
    try {
      console.log('Loading interest entries...')
      
      // Create repository and load resume
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      // If resumeData is valid and resume property exists
      if (result) {
        // Check if have interest data
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error);
          resumeData = { interests: [] };
        }
        
        const interestData = resumeData.interests || []
        
        console.log('Loaded interest data:', interestData)
        
        // Map to ValidatedInterest objects
        interests.value = interestData.map(interest => {
          const interestWithId = interest as InterestWithId
          return {
            id: interestWithId.id || generateId(),
            name: interestWithId.name || '',
            keywords: interestWithId.keywords || [],
            toJSON: () => ({
              ...interestWithId,
              id: interestWithId.id || generateId()
            })
          }
        })
        
        return interests.value
      } else {
        console.warn('No valid resume found or no interest data')
        interests.value = []
        return []
      }
    } catch (error) {
      console.error('Error loading interest entries:', error)
      interests.value = []
      return []
    } finally {
      loading.value.interests = false
    }
  }
  
  // Add a new interest entry
  const addInterest = async (interest: InterestInterface): Promise<void> => {
    loading.value.adding = true
    
    try {
      console.log('Adding new interest entry:', interest)
      
      if (!interest.name) {
        throw new Error('Missing required field: name')
      }
      
      // Generate ID for the new interest entry
      const interestWithId: InterestWithId = {
        ...interest,
        id: generateId()
      }
      
      // Load current interest entries if needed
      if (!interests.value) {
        await loadInterests()
      }
      
      // Add to local state first (optimistic update)
      const newItem: ValidatedInterest = {
        id: interestWithId.id as string,
        name: interest.name,
        keywords: interest.keywords || [],
        toJSON: () => interestWithId
      }
      
      interests.value = [newItem, ...(interests.value || [])]
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty interests array if needed
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
            interests: []
          };
        }
        
        // Ensure interests array exists
        if (!updatedData.interests) {
          updatedData.interests = [];
        }
        
        // Add new interest to the beginning
        updatedData.interests = [
          interestWithId,
          ...updatedData.interests
        ];
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          // Créer un nouveau Resume avec les données mises à jour
          const { Resume } = await import('@cv-generator/core');
          const updatedResumeResult = Resume.create(updatedData);
          
          if (!updatedResumeResult.isValid || !updatedResumeResult.resume) {
            throw new Error('Failed to create updated resume: ' + (updatedResumeResult.errors?.join(', ') || 'Unknown error'));
          }
          
          await repository.save(updatedResumeResult.resume);
          return true
        })
        
        console.log('Interest entry added successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Remove from local state on error
        interests.value = interests.value?.filter(i => i.id !== newItem.id) || null;
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible d\'ajouter l\'intérêt',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error adding interest entry:', error)
      throw error
    } finally {
      loading.value.adding = false
    }
  }
  
  // Update an existing interest entry
  const updateInterest = async (id: string, interest: InterestInterface): Promise<void> => {
    loading.value.updating = true
    
    try {
      console.log('Updating interest entry:', id, interest)
      
      if (!interest.name) {
        throw new Error('Missing required field: name')
      }
      
      // Load current interest entries if needed
      if (!interests.value) {
        await loadInterests()
      }
      
      // Check if interest exists
      const existingIndex = interests.value?.findIndex(i => i.id === id) ?? -1
      
      if (existingIndex === -1) {
        throw new Error('Interest not found')
      }
      
      // Create updated interest with ID
      const updatedInterest: InterestWithId = {
        ...interest,
        id: id
      }
      
      // Update local state first (optimistic update)
      const updatedItem: ValidatedInterest = {
        id: id,
        name: interest.name,
        keywords: interest.keywords || [],
        toJSON: () => updatedInterest
      }
      
      if (interests.value && existingIndex !== -1) {
        interests.value[existingIndex] = updatedItem
      }
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          throw error;
        }
        
        // Ensure interests array exists
        if (!updatedData.interests) {
          updatedData.interests = [];
        }
        
        // Find and update the interest entry
        const interestIndex = updatedData.interests.findIndex((i: any) => i.id === id)
        
        if (interestIndex !== -1) {
          updatedData.interests[interestIndex] = updatedInterest
        } else {
          console.warn('Interest not found in resume data, cannot update')
          throw new Error('Interest not found in resume data')
        }
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          // Créer un nouveau Resume avec les données mises à jour
          const { Resume } = await import('@cv-generator/core');
          const updatedResumeResult = Resume.create(updatedData);
          
          if (!updatedResumeResult.isValid || !updatedResumeResult.resume) {
            throw new Error('Failed to create updated resume: ' + (updatedResumeResult.errors?.join(', ') || 'Unknown error'));
          }
          
          await repository.save(updatedResumeResult.resume);
          return true
        })
        
        console.log('Interest entry updated successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Reload original state on error
        await loadInterests()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de mettre à jour l\'intérêt',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating interest entry:', error)
      throw error
    } finally {
      loading.value.updating = false
    }
  }
  
  // Delete an interest entry
  const deleteInterest = async (id: string): Promise<void> => {
    loading.value.deleting = true
    
    try {
      console.log('Deleting interest entry:', id)
      
      // Load current interest entries if needed
      if (!interests.value) {
        await loadInterests()
      }
      
      // Check if interest exists
      const existingInterest = interests.value?.find(i => i.id === id)
      
      if (!existingInterest) {
        throw new Error('Interest not found')
      }
      
      // Remove from local state first (optimistic update)
      const newInterests = interests.value?.filter(i => i.id !== id) || []
      interests.value = newInterests
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          throw error;
        }
        
        // Remove the interest entry
        if (updatedData.interests) {
          updatedData.interests = updatedData.interests.filter((i: any) => i.id !== id)
        }
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          // Créer un nouveau Resume avec les données mises à jour
          const { Resume } = await import('@cv-generator/core');
          const updatedResumeResult = Resume.create(updatedData);
          
          if (!updatedResumeResult.isValid || !updatedResumeResult.resume) {
            throw new Error('Failed to create updated resume: ' + (updatedResumeResult.errors?.join(', ') || 'Unknown error'));
          }
          
          await repository.save(updatedResumeResult.resume);
          return true
        })
        
        console.log('Interest entry deleted successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Restore original state on error
        await loadInterests()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de supprimer l\'intérêt',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error deleting interest entry:', error)
      throw error
    } finally {
      loading.value.deleting = false
    }
  }
  
  // Reorder interest entries
  const reorderInterests = async (newOrder: string[]): Promise<void> => {
    loading.value.interests = true
    
    try {
      console.log('Reordering interest entries:', newOrder)
      
      // Load current interest entries if needed
      if (!interests.value) {
        await loadInterests()
      }
      
      if (!interests.value || interests.value.length === 0) {
        console.warn('No interests to reorder')
        return
      }
      
      // Create a map of current interests for easy access
      const interestMap = new Map<string, ValidatedInterest>()
      interests.value.forEach(interest => {
        interestMap.set(interest.id, interest)
      })
      
      // Create new ordered list based on new order
      const orderedInterests: ValidatedInterest[] = []
      
      for (const id of newOrder) {
        const interest = interestMap.get(id)
        if (interest) {
          orderedInterests.push(interest)
        }
      }
      
      // Ensure all interests are included (in case some were missed in newOrder)
      interests.value.forEach(interest => {
        if (!newOrder.includes(interest.id)) {
          orderedInterests.push(interest)
        }
      })
      
      // Update local state
      interests.value = orderedInterests
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          throw error;
        }
        
        // Ensure interests array exists
        if (!updatedData.interests) {
          updatedData.interests = [];
        }
        
        // Create a map of current interests in resume data
        const resumeInterestsMap = new Map<string, any>()
        updatedData.interests.forEach((interest: any) => {
          if (interest.id) {
            resumeInterestsMap.set(interest.id, interest)
          }
        })
        
        // Create new ordered list based on new order
        const orderedResumeInterests: any[] = []
        
        for (const id of newOrder) {
          const interest = resumeInterestsMap.get(id)
          if (interest) {
            orderedResumeInterests.push(interest)
          }
        }
        
        // Ensure all interests are included
        updatedData.interests.forEach((interest: any) => {
          if (interest.id && !newOrder.includes(interest.id)) {
            orderedResumeInterests.push(interest)
          }
        })
        
        // Update resume data with new order
        updatedData.interests = orderedResumeInterests
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          // Créer un nouveau Resume avec les données mises à jour
          const { Resume } = await import('@cv-generator/core');
          const updatedResumeResult = Resume.create(updatedData);
          
          if (!updatedResumeResult.isValid || !updatedResumeResult.resume) {
            throw new Error('Failed to create updated resume: ' + (updatedResumeResult.errors?.join(', ') || 'Unknown error'));
          }
          
          await repository.save(updatedResumeResult.resume);
          return true
        })
        
        console.log('Interest entries reordered successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Reload original state on error
        await loadInterests()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de réordonner les intérêts',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error reordering interest entries:', error)
      throw error
    } finally {
      loading.value.interests = false
    }
  }
  
  return {
    // State
    interests,
    loading,
    
    // Actions
    loadInterests,
    addInterest,
    updateInterest,
    deleteInterest,
    reorderInterests
  }
})

export type InterestStore = ReturnType<typeof useInterestStore> 