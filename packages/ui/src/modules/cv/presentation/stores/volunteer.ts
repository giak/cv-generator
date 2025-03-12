import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { VolunteerInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Interface extended to include ID
export interface VolunteerWithId extends VolunteerInterface {
  id?: string
}

// Interface for validated volunteer experience
export interface ValidatedVolunteer {
  id: string
  organization: string
  position: string
  startDate: string
  endDate?: string
  highlights?: string[]
  summary?: string
  url?: string
  toJSON: () => VolunteerWithId
}

// Interface for the Volunteer Store state
export interface VolunteerStoreState {
  volunteers: ValidatedVolunteer[] | null
  loading: boolean
}

// Interface for the Volunteer Store actions
export interface VolunteerStoreActions {
  // Load volunteer experiences
  loadVolunteers(): Promise<ValidatedVolunteer[]>
  
  // Add a new volunteer experience
  addVolunteer(volunteer: VolunteerInterface): Promise<void>
  
  // Update an existing volunteer experience
  updateVolunteer(id: string, volunteer: VolunteerInterface): Promise<void>
  
  // Delete a volunteer experience
  deleteVolunteer(id: string): Promise<void>
  
  // Reorder volunteer experiences
  reorderVolunteers(newOrder: string[]): Promise<void>
}

// Define the Volunteer Store
export const useVolunteerStore = defineStore('volunteer', () => {
  // State
  const volunteers = ref<ValidatedVolunteer[] | null>(null)
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
  
  // Load volunteer experiences
  const loadVolunteers = async (): Promise<ValidatedVolunteer[]> => {
    loading.value = true
    
    try {
      console.log('Loading volunteer experiences...')
      
      // Create repository and load resume
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      // If resumeData is valid and resume property exists
      if (result) {
        // Check if have volunteer data
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error);
          resumeData = { volunteer: [] };
        }
        
        const volunteerData = resumeData.volunteer || []
        
        console.log('Loaded volunteer data:', volunteerData)
        
        // Map to ValidatedVolunteer objects
        volunteers.value = volunteerData.map(vol => {
          const volunteer = vol as VolunteerWithId
          return {
            id: volunteer.id || generateId(),
            organization: volunteer.organization || '',
            position: volunteer.position || '',
            startDate: volunteer.startDate || '',
            endDate: volunteer.endDate || '',
            highlights: volunteer.highlights || [],
            summary: volunteer.summary || '',
            url: volunteer.url || '',
            toJSON: () => ({
              ...volunteer,
              id: volunteer.id || generateId()
            })
          }
        })
        
        return volunteers.value
      } else {
        console.warn('No valid resume found or no volunteer data')
        volunteers.value = []
        return []
      }
    } catch (error) {
      console.error('Error loading volunteer experiences:', error)
      // Only add error manually if executeWithErrorHandling wasn't used
      volunteers.value = []
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Add a new volunteer experience
  const addVolunteer = async (volunteer: VolunteerInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Adding new volunteer experience:', volunteer)
      
      if (!volunteer.organization || !volunteer.position || !volunteer.startDate) {
        throw new Error('Missing required fields')
      }
      
      // Generate ID for the new volunteer experience
      const volunteerWithId: VolunteerWithId = {
        ...volunteer,
        id: generateId()
      }
      
      // Load current volunteers if needed
      if (!volunteers.value) {
        await loadVolunteers()
      }
      
      // Add to local state first
      const newItem: ValidatedVolunteer = {
        id: volunteerWithId.id as string,
        organization: volunteer.organization,
        position: volunteer.position,
        startDate: volunteer.startDate,
        endDate: volunteer.endDate || '',
        summary: volunteer.summary || '',
        url: volunteer.url || '',
        highlights: volunteer.highlights || [],
        toJSON: () => volunteerWithId
      }
      
      volunteers.value = [newItem, ...(volunteers.value || [])]
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty volunteer array if needed
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
            volunteer: []
          };
        }
        
        // Ensure volunteer array exists
        if (!updatedData.volunteer) {
          updatedData.volunteer = [];
        }
        
        // Add new volunteer to the beginning
        updatedData.volunteer = [
          volunteerWithId,
          ...updatedData.volunteer
        ];
        
        // Update the resume with new data
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Volunteer experience added successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Remove from local state on error
        volunteers.value = volunteers.value?.filter(v => v.id !== newItem.id) || null;
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible d\'ajouter l\'expérience de bénévolat',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error adding volunteer experience:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Update an existing volunteer experience
  const updateVolunteer = async (id: string, volunteer: VolunteerInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Updating volunteer experience:', id, volunteer)
      
      if (!volunteer.organization || !volunteer.position || !volunteer.startDate) {
        throw new Error('Missing required fields')
      }
      
      // Update local state first
      if (volunteers.value) {
        volunteers.value = volunteers.value.map(vol => {
          if (vol.id === id) {
            return {
              id,
              organization: volunteer.organization,
              position: volunteer.position,
              startDate: volunteer.startDate,
              endDate: volunteer.endDate || '',
              highlights: volunteer.highlights || [],
              summary: volunteer.summary || '',
              url: volunteer.url || '',
              toJSON: () => ({
                ...volunteer,
                id
              })
            }
          }
          return vol
        })
      }
      
      // Save to storage
      const volunteerWithId: VolunteerWithId = {
        ...volunteer,
        id
      }
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data and ensure volunteer array exists
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
            volunteer: []
          };
        }
        
        // Ensure volunteer array exists
        if (!resumeData.volunteer) {
          resumeData.volunteer = [];
        }
        
        // Replace volunteer with matching ID
        const updatedVolunteers = resumeData.volunteer.map((vol: any) => {
          const volWithId = vol as VolunteerWithId
          return volWithId.id === id ? volunteerWithId : vol
        })
        
        // Update the resume data
        resumeData.volunteer = updatedVolunteers;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Volunteer experience updated successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload volunteers on error to reset state
        await loadVolunteers();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de mettre à jour l\'expérience de bénévolat',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating volunteer experience:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Delete a volunteer experience
  const deleteVolunteer = async (id: string): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Deleting volunteer experience:', id)
      
      // Update local state first
      if (volunteers.value) {
        volunteers.value = volunteers.value.filter(vol => vol.id !== id)
      }
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          return // No volunteer data to delete
        }
        
        // Get current data and filter out volunteer with matching ID
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          return; // No volunteer data to delete
        }
        
        if (!resumeData.volunteer) {
          return; // No volunteer data to delete
        }
        
        // Filter out volunteer with matching ID
        const updatedVolunteers = resumeData.volunteer.filter((vol: any) => {
          const volWithId = vol as VolunteerWithId
          return volWithId.id !== id
        })
        
        // Update the resume data
        resumeData.volunteer = updatedVolunteers;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Volunteer experience deleted successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload volunteers on error to reset state
        await loadVolunteers();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de supprimer l\'expérience de bénévolat',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error deleting volunteer experience:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Reorder volunteer experiences
  const reorderVolunteers = async (newOrder: string[]): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Reordering volunteer experiences:', newOrder)
      
      if (!volunteers.value || volunteers.value.length === 0) {
        console.warn('No volunteers to reorder')
        return
      }
      
      // Create a map for quick lookup
      const volunteersMap = new Map<string, ValidatedVolunteer>()
      volunteers.value.forEach(vol => volunteersMap.set(vol.id, vol))
      
      // Reorder using the map and new order
      const reorderedVolunteers = newOrder
        .map(id => volunteersMap.get(id))
        .filter((vol): vol is ValidatedVolunteer => vol !== undefined)
      
      // Update local state
      volunteers.value = reorderedVolunteers
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          return // No volunteer data to reorder
        }
        
        // Get current data and reorder volunteers
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          return; // No volunteer data to reorder
        }
        
        if (!resumeData.volunteer) {
          return; // No volunteer data to reorder
        }
        
        // Convert to VolunteerInterface array
        const reorderedVolunteersData = reorderedVolunteers.map(vol => vol.toJSON())
        
        // Update the resume data
        resumeData.volunteer = reorderedVolunteersData;
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })
        
        console.log('Volunteer experiences reordered successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Reload volunteers on error to reset state
        await loadVolunteers();
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de réorganiser les expériences de bénévolat',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error reordering volunteer experiences:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    volunteers,
    loading,
    
    // Actions
    loadVolunteers,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    reorderVolunteers
  }
})

export type VolunteerStore = ReturnType<typeof useVolunteerStore> 