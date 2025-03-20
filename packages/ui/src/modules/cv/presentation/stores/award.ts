import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { AwardInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'
import { useResumeStore } from './resume'
import type { AwardWithId, ValidatedAward } from '@cv-generator/core/src/modules/cv/domain/entities/Award'

// Interface extended to include ID
export interface AwardWithId extends AwardInterface {
  id: string
}

// Interface for validated award
export type ValidatedAward = AwardWithId & {
  toJSON: () => AwardWithId
}

// Interface for the Award Store state
export interface AwardStoreState {
  awards: ValidatedAward[]
  loading: boolean
}

// Interface for the Award Store actions
export interface AwardStoreActions {
  // Load award entries
  loadAwards(): Promise<ValidatedAward[]>
  
  // Add a new award entry
  addAward(award: AwardInterface): Promise<ValidatedAward>
  
  // Update an existing award entry
  updateAward(id: string, award: Partial<AwardInterface>): Promise<void>
  
  // Delete an award entry
  deleteAward(id: string): Promise<void>
  
  // Reorder award entries
  reorderAwards(newOrder: string[]): Promise<void>
}

// Define the Award Store
export const useAwardStore = defineStore('award', () => {
  // State
  const awards = ref<ValidatedAward[]>([])
  const loading = ref(false)
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  
  // Resume manager with repository instance
  const manageResume = new ManageResume(repository)
  
  const resumeStore = useResumeStore()
  
  // Helper to generate a unique ID
  const generateId = () => uuidv4()
  
  // Load award entries
  const loadAwards = async (): Promise<ValidatedAward[]> => {
    loading.value = true
    
    try {

      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (result) {
        // Get current data and ensure awards array exists
        let resumeData
        try {
          resumeData = result.toJSON()

          if (!resumeData.awards) {

            awards.value = []
            return awards.value
          }

          // Map to ValidatedAward objects
          awards.value = resumeData.awards.map((award: AwardWithId) => ({
            id: award.id || generateId(),
            title: award.title,
            date: award.date,
            awarder: award.awarder,
            summary: award.summary,
            toJSON: () => ({
              id: award.id || generateId(),
              title: award.title,
              date: award.date,
              awarder: award.awarder,
              summary: award.summary,
            }),
          }))

          return awards.value
        } catch (error) {

          awards.value = []
          return awards.value
        }
      } else {

        awards.value = []
        return awards.value
      }
    } catch (error) {

      errorStore.setError('Failed to load award entries')
      awards.value = []
      return awards.value
    } finally {
      loading.value = false
    }
  }
  
  // Add a new award entry
  const addAward = async (award: AwardInterface): Promise<ValidatedAward> => {
    loading.value = true
    
    try {

      if (!award.title || !award.date || !award.awarder) {
        throw new Error('Missing required fields')
      }
      
      const newItem: ValidatedAward = {
        id: generateId(),
        title: award.title,
        date: award.date,
        awarder: award.awarder,
        summary: award.summary || '',
        toJSON: () => ({
          id: newItem.id,
          title: award.title,
          date: award.date,
          awarder: award.awarder,
          summary: award.summary || '',
        }),
      }
      
      // Load current award entries if needed
      if (awards.value.length === 0) {
        await loadAwards()
      }
      
      awards.value = [newItem, ...awards.value]
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data and ensure awards array exists
        const resumeData = result.toJSON()

        // Créer un objet JSON mis à jour avec les nouvelles données
        const updatedResumeJson = {
          ...resumeData,
          awards: awards.value.map(award => award.toJSON()),
        }
        
        // Utiliser la méthode createResume pour créer/mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)

        return newItem
      } catch (error) {

        // Remove from local state on error
        awards.value = awards.value.filter(award => award.id !== newItem.id)
        throw error
      }
    } finally {
      loading.value = false
    }
  }
  
  // Update an existing award entry
  const updateAward = async (id: string, updatedData: Partial<AwardInterface>): Promise<void> => {
    loading.value = true
    
    try {

      if (awards.value.length > 0) {
        awards.value = awards.value.map((award: ValidatedAward) => 
          award.id === id ? { ...award, ...updatedData } : award
        )
      }
      
      const existingAward = awards.value.find((award: ValidatedAward) => award.id === id)
      if (!existingAward) {
        throw new Error('Award not found')
      }
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()

        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          awards: awards.value.map(award => award.toJSON()),
        }
        
        // Utiliser la méthode createResume pour mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)

      } catch (error) {

        // Reload awards on error to reset state
        await loadAwards()
        throw error
      }
    } finally {
      loading.value = false
    }
  }
  
  // Delete an award entry
  const deleteAward = async (id: string): Promise<void> => {
    loading.value = true
    
    try {

      const awardToDelete = awards.value.find((award: ValidatedAward) => award.id === id)
      if (!awardToDelete) {
        throw new Error('Award not found')
      }
      
      // Remove from local state
      awards.value = awards.value.filter((award: ValidatedAward) => award.id !== id)
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()
        
        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          awards: awards.value.map(award => award.toJSON()),
        }
        
        // Utiliser la méthode createResume pour mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)

      } catch (error) {

        // Restore award on error
        if (awardToDelete) {
          awards.value = [...awards.value, awardToDelete]
        }
        throw error
      }
    } finally {
      loading.value = false
    }
  }
  
  // Reorder award entries
  const reorderAwards = async (newOrder: string[]): Promise<void> => {
    loading.value = true
    
    try {

      if (awards.value.length === 0) {

        return
      }
      
      const reorderedAwards = newOrder
        .map(id => awards.value.find((award: ValidatedAward) => award.id === id))
        .filter((award): award is ValidatedAward => award !== undefined)
      
      awards.value = reorderedAwards
      
      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          return // No award data to reorder
        }
        
        // Get current data and update awards
        let resumeData = result.toJSON()
        
        // Update the resume data
        resumeData = {
          ...resumeData,
          awards: awards.value.map(award => award.toJSON()),
        }
        
        // Save the updated resume
        await errorStore.executeWithErrorHandling(async () => {
          await repository.save(result)
          return true
        })

      } catch (error) {

        // Reload awards on error to reset state
        await loadAwards()
        throw error
      }
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    awards,
    loading,
    
    // Actions
    loadAwards,
    addAward,
    updateAward,
    deleteAward,
    reorderAwards
  }
})

export type AwardStore = ReturnType<typeof useAwardStore>
