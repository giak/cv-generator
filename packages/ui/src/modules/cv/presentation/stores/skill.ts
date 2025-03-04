import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { SkillInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Interface extended to include ID
export interface SkillWithId extends SkillInterface {
  id?: string
}

// Interface for validated skill
export interface ValidatedSkill {
  id: string
  name: string
  level?: string
  keywords?: string[]
  toJSON: () => SkillWithId
}

// Interface for the Skill Store state
export interface SkillStoreState {
  skills: ValidatedSkill[] | null
  loading: boolean
}

// Interface for the Skill Store actions
export interface SkillStoreActions {
  // Load skill entries
  loadSkills(): Promise<ValidatedSkill[]>
  
  // Add a new skill entry
  addSkill(skill: SkillInterface): Promise<void>
  
  // Update an existing skill entry
  updateSkill(id: string, skill: SkillInterface): Promise<void>
  
  // Delete a skill entry
  deleteSkill(id: string): Promise<void>
  
  // Reorder skill entries
  reorderSkills(newOrder: string[]): Promise<void>
}

// Define the Skill Store
export const useSkillStore = defineStore('skill', () => {
  // State
  const skills = ref<ValidatedSkill[] | null>(null)
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
  
  // Load skill entries
  const loadSkills = async (): Promise<ValidatedSkill[]> => {
    loading.value = true
    
    try {
      console.log('Loading skill entries...')
      
      // Create repository and load resume
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      // If resumeData is valid and resume property exists
      if (result) {
        // Check if have skill data
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error);
          resumeData = { skills: [] };
        }
        
        const skillData = resumeData.skills || []
        
        console.log('Loaded skill data:', skillData)
        
        // Map to ValidatedSkill objects
        skills.value = skillData.map(sk => {
          const skill = sk as SkillWithId
          return {
            id: skill.id || generateId(),
            name: skill.name || '',
            level: skill.level || '',
            keywords: skill.keywords || [],
            toJSON: () => ({
              ...skill,
              id: skill.id || generateId()
            })
          }
        })
        
        return skills.value
      } else {
        console.warn('No valid resume found or no skill data')
        skills.value = []
        return []
      }
    } catch (error) {
      console.error('Error loading skill entries:', error)
      skills.value = []
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Add a new skill entry
  const addSkill = async (skill: SkillInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Adding new skill entry:', skill)
      
      if (!skill.name) {
        throw new Error('Missing required field: name')
      }
      
      // Generate ID for the new skill entry
      const skillWithId: SkillWithId = {
        ...skill,
        id: generateId()
      }
      
      // Load current skill entries if needed
      if (!skills.value) {
        await loadSkills()
      }
      
      // Add to local state first (optimistic update)
      const newItem: ValidatedSkill = {
        id: skillWithId.id as string,
        name: skill.name,
        level: skill.level || '',
        keywords: skill.keywords || [],
        toJSON: () => skillWithId
      }
      
      skills.value = [newItem, ...(skills.value || [])]
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty skills array if needed
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
            skills: []
          };
        }
        
        // Ensure skills array exists
        if (!updatedData.skills) {
          updatedData.skills = [];
        }
        
        // Add new skill to the beginning
        updatedData.skills = [
          skillWithId,
          ...updatedData.skills
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
        
        console.log('Skill entry added successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Remove from local state on error
        skills.value = skills.value?.filter(s => s.id !== newItem.id) || null;
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible d\'ajouter la compétence',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error adding skill entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Update an existing skill entry
  const updateSkill = async (id: string, skill: SkillInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Updating skill entry:', id, skill)
      
      if (!skill.name) {
        throw new Error('Missing required field: name')
      }
      
      // Load current skill entries if needed
      if (!skills.value) {
        await loadSkills()
      }
      
      // Find the skill to update
      const currentIndex = skills.value?.findIndex(s => s.id === id) ?? -1
      
      if (currentIndex === -1) {
        throw new Error(`Skill with ID ${id} not found`)
      }
      
      // Create updated skill with ID
      const skillWithId: SkillWithId = {
        ...skill,
        id: id
      }
      
      // Create updated item for local state
      const updatedItem: ValidatedSkill = {
        id: id,
        name: skill.name,
        level: skill.level || '',
        keywords: skill.keywords || [],
        toJSON: () => skillWithId
      }
      
      // Update local state (optimistic update)
      const updatedSkills = [...(skills.value || [])]
      updatedSkills[currentIndex] = updatedItem
      skills.value = updatedSkills
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty skills array if needed
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
            skills: []
          };
        }
        
        // Ensure skills array exists
        if (!updatedData.skills) {
          updatedData.skills = [];
        }
        
        // Update the skill in the array
        updatedData.skills = updatedData.skills.map((s: SkillWithId) => 
          s.id === id ? skillWithId : s
        );
        
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
        
        console.log('Skill entry updated successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Revert local state on error
        if (skills.value) {
          const oldSkills = [...skills.value];
          const originalItem = skills.value[currentIndex];
          oldSkills[currentIndex] = originalItem;
          skills.value = oldSkills;
        }
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de mettre à jour la compétence',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating skill entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Delete a skill entry
  const deleteSkill = async (id: string): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Deleting skill entry:', id)
      
      // Load current skill entries if needed
      if (!skills.value) {
        await loadSkills()
      }
      
      // Find the skill to delete
      const currentIndex = skills.value?.findIndex(s => s.id === id) ?? -1
      
      if (currentIndex === -1) {
        throw new Error(`Skill with ID ${id} not found`)
      }
      
      // Store original item for rollback
      const originalItem = skills.value?.[currentIndex]
      
      // Update local state (optimistic delete)
      skills.value = skills.value?.filter(s => s.id !== id) || null
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current resume data
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          throw error;
        }
        
        // Ensure skills array exists
        if (!updatedData.skills) {
          updatedData.skills = [];
        }
        
        // Remove the skill from the array
        updatedData.skills = updatedData.skills.filter((s: SkillWithId) => s.id !== id);
        
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
        
        console.log('Skill entry deleted successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Restore local state on error
        if (skills.value && originalItem) {
          const restoredSkills = [...skills.value];
          // Insert back at original position or at beginning if not possible
          if (currentIndex < restoredSkills.length) {
            restoredSkills.splice(currentIndex, 0, originalItem);
          } else {
            restoredSkills.unshift(originalItem);
          }
          skills.value = restoredSkills;
        }
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de supprimer la compétence',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error deleting skill entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Reorder skill entries
  const reorderSkills = async (newOrder: string[]): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Reordering skill entries:', newOrder)
      
      // Load current skill entries if needed
      if (!skills.value) {
        await loadSkills()
      }
      
      // Store original order for rollback
      const originalOrder = skills.value ? [...skills.value] : []
      
      // Create a map for quick lookup
      const skillMap = new Map<string, ValidatedSkill>()
      skills.value?.forEach(skill => {
        skillMap.set(skill.id, skill)
      })
      
      // Create reordered array from newOrder
      const reorderedSkills: ValidatedSkill[] = []
      for (const id of newOrder) {
        const skill = skillMap.get(id)
        if (skill) {
          reorderedSkills.push(skill)
        }
      }
      
      // Add any items that might not be in the newOrder array
      // (defensive programming to avoid data loss)
      skills.value?.forEach(skill => {
        if (!newOrder.includes(skill.id)) {
          reorderedSkills.push(skill)
        }
      })
      
      // Update local state (optimistic update)
      skills.value = reorderedSkills
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current resume data
        let updatedData;
        
        try {
          updatedData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON');
          throw error;
        }
        
        // Ensure skills array exists
        if (!updatedData.skills) {
          updatedData.skills = [];
        }
        
        // Create a map for quick lookup of resume skills
        const resumeSkillMap = new Map<string, SkillWithId>()
        updatedData.skills.forEach((skill: SkillWithId) => {
          if (skill.id) {
            resumeSkillMap.set(skill.id, skill)
          }
        })
        
        // Create reordered array from newOrder
        const reorderedResumeSkills: SkillWithId[] = []
        for (const id of newOrder) {
          const skill = resumeSkillMap.get(id)
          if (skill) {
            reorderedResumeSkills.push(skill)
          }
        }
        
        // Add any items that might not be in the newOrder array
        updatedData.skills.forEach((skill: SkillWithId) => {
          if (skill.id && !newOrder.includes(skill.id)) {
            reorderedResumeSkills.push(skill)
          }
        })
        
        // Update the resume skills with reordered array
        updatedData.skills = reorderedResumeSkills
        
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
        
        console.log('Skill entries reordered successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Restore original order on error
        skills.value = originalOrder
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de réorganiser les compétences',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error reordering skill entries:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Return store state and actions
  return {
    // State
    skills,
    loading,
    
    // Actions
    loadSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    reorderSkills
  }
})

// Export the type for better type safety
export type SkillStore = ReturnType<typeof useSkillStore> 