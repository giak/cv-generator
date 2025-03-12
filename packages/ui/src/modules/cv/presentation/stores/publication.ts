import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { PublicationInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'
import { useResumeStore } from './resume'

// Interface extended to include ID
export interface PublicationWithId extends PublicationInterface {
  id: string
}

// Interface for validated publication
export interface ValidatedPublication extends PublicationWithId {
  name: string
  publisher: string
  releaseDate: string
  url?: string
  summary?: string
  toJSON: () => PublicationWithId
}

// Define the Publication Store
export const usePublicationStore = defineStore('publication', () => {
  // State
  const publications = ref<ValidatedPublication[]>([])
  const loading = ref({
    loading: false,
    creating: false,
    updating: false,
    deleting: false
  })
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  const manageResume = new ManageResume(repository)
  const resumeStore = useResumeStore()
  
  // Helper to generate a unique ID
  const generateId = () => uuidv4()
  
  // Load publication entries
  const loadPublications = async (): Promise<ValidatedPublication[]> => {
    loading.value.loading = true
    
    try {
      console.log('Loading publication entries...')
      
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (!result) {
        console.error('Failed to load resume data')
        return []
      }
      
      // Get publications from resume data
      const resumeData = result.toJSON()
      const resumePublications = resumeData.publications || []
      
      console.log(`Found ${resumePublications.length} publications in resume:`, resumePublications)
      
      // Map publications to ValidatedPublication
      publications.value = resumePublications.map(publication => {
        const publicationWithId = {
          ...publication,
          id: generateId()
        }
        
        return {
          ...publicationWithId,
          toJSON: () => ({
            id: publicationWithId.id,
            name: publication.name,
            publisher: publication.publisher,
            releaseDate: publication.releaseDate,
            url: publication.url,
            summary: publication.summary
          })
        }
      })
      
      console.log(`Loaded ${publications.value.length} publication entries:`, publications.value)
      
      return publications.value
    } catch (error) {
      console.error('Error loading publications:', error)
      errorStore.addError({
        id: uuidv4(),
        message: 'Failed to load publications',
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      })
      return []
    } finally {
      loading.value.loading = false
    }
  }
  
  // Add a new publication entry
  const addPublication = async (publication: PublicationInterface): Promise<ValidatedPublication> => {
    loading.value.creating = true
    
    try {
      console.log('Adding new publication:', publication)
      
      // Verify required fields
      if (!publication.name || !publication.publisher || !publication.releaseDate) {
        throw new Error('Missing required fields for publication')
      }
      
      // Generate a unique ID for the new publication
      const id = generateId()
      
      // Create a validated publication object
      const validatedPublication: ValidatedPublication = {
        ...publication,
        id,
        toJSON: () => ({
          id,
          name: publication.name,
          publisher: publication.publisher,
          releaseDate: publication.releaseDate,
          url: publication.url || '',
          summary: publication.summary || ''
        })
      }
      
      // Add to local state first
      publications.value = [validatedPublication, ...publications.value]
      
      // Get current resume data
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (!result) {
        throw new Error('Failed to load resume for publication update')
      }
      
      // Get current resume JSON data
      const resumeData = result.toJSON()
      
      // Update the publications in the JSON data
      const updatedResumeData = {
        ...resumeData,
        publications: publications.value.map(pub => pub.toJSON())
      }
      
      // Create updated resume and save
      await manageResume.createResume(updatedResumeData)
      
      console.log('Publication added successfully:', validatedPublication)
      
      return validatedPublication
    } catch (error) {
      console.error('Error adding publication:', error)
      errorStore.addError({
        id: uuidv4(),
        message: 'Failed to add publication',
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      })
      throw error
    } finally {
      loading.value.creating = false
    }
  }
  
  // Update an existing publication entry
  const updatePublication = async (id: string, publicationUpdate: Partial<PublicationInterface>): Promise<void> => {
    loading.value.updating = true
    
    try {
      console.log(`Updating publication with ID ${id}:`, publicationUpdate)
      
      // Find the publication to update
      const publicationIndex = publications.value.findIndex(p => p.id === id)
      
      if (publicationIndex === -1) {
        throw new Error(`Publication with ID ${id} not found`)
      }
      
      // Create an updated publication object
      const currentPublication = publications.value[publicationIndex]
      const updatedPublication = {
        ...currentPublication,
        ...publicationUpdate,
        toJSON: () => ({
          id: currentPublication.id,
          name: publicationUpdate.name || currentPublication.name,
          publisher: publicationUpdate.publisher || currentPublication.publisher,
          releaseDate: publicationUpdate.releaseDate || currentPublication.releaseDate,
          url: publicationUpdate.url !== undefined ? publicationUpdate.url : currentPublication.url,
          summary: publicationUpdate.summary !== undefined ? publicationUpdate.summary : currentPublication.summary
        })
      }
      
      // Update in local state first
      publications.value[publicationIndex] = updatedPublication
      
      // Get current resume data
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (!result) {
        throw new Error('Failed to load resume for publication update')
      }
      
      // Get current resume JSON data
      const resumeData = result.toJSON()
      
      // Update the publications in the JSON data
      const updatedResumeData = {
        ...resumeData,
        publications: publications.value.map(pub => pub.toJSON())
      }
      
      // Create updated resume and save
      await manageResume.createResume(updatedResumeData)
      
      console.log('Publication updated successfully:', updatedPublication)
      
    } catch (error) {
      console.error('Error updating publication:', error)
      errorStore.addError({
        id: uuidv4(),
        message: 'Failed to update publication',
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      })
      
      // Reload publications to reset state on error
      await loadPublications()
      throw error
    } finally {
      loading.value.updating = false
    }
  }
  
  // Delete a publication entry
  const deletePublication = async (id: string): Promise<void> => {
    loading.value.deleting = true
    
    try {
      console.log(`Deleting publication with ID ${id}`)
      
      // Find the publication to delete
      const publicationIndex = publications.value.findIndex(p => p.id === id)
      
      if (publicationIndex === -1) {
        throw new Error(`Publication with ID ${id} not found`)
      }
      
      // Remove from local state first
      const updatedPublications = publications.value.filter(p => p.id !== id)
      publications.value = updatedPublications
      
      // Get current resume data
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (!result) {
        throw new Error('Failed to load resume for publication deletion')
      }
      
      // Get current resume JSON data
      const resumeData = result.toJSON()
      
      // Update the publications in the JSON data
      const updatedResumeData = {
        ...resumeData,
        publications: updatedPublications.map(pub => pub.toJSON())
      }
      
      // Create updated resume and save
      await manageResume.createResume(updatedResumeData)
      
      console.log('Publication deleted successfully')
      
    } catch (error) {
      console.error('Error deleting publication:', error)
      errorStore.addError({
        id: uuidv4(),
        message: 'Failed to delete publication',
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      })
      
      // Reload publications to reset state on error
      await loadPublications()
      throw error
    } finally {
      loading.value.deleting = false
    }
  }
  
  // Reorder publication entries
  const reorderPublications = async (newOrder: string[]): Promise<void> => {
    try {
      console.log('Reordering publications with new order:', newOrder)
      
      // Check if the new order contains all publications
      if (newOrder.length !== publications.value.length) {
        throw new Error('New order must contain all publication IDs')
      }
      
      // Create a map of publications by ID for quick lookup
      const publicationMap = publications.value.reduce((map, publication) => {
        map[publication.id] = publication
        return map
      }, {} as Record<string, ValidatedPublication>)
      
      // Reorder the publications based on the provided order
      const reorderedPublications = newOrder.map(id => {
        const publication = publicationMap[id]
        if (!publication) {
          throw new Error(`Publication with ID ${id} not found during reordering`)
        }
        return publication
      })
      
      // Update local state first
      publications.value = reorderedPublications
      
      // Get current resume data
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (!result) {
        throw new Error('Failed to load resume for publication reordering')
      }
      
      // Get current resume JSON data
      const resumeData = result.toJSON()
      
      // Update the publications in the JSON data
      const updatedResumeData = {
        ...resumeData,
        publications: reorderedPublications.map(pub => pub.toJSON())
      }
      
      // Create updated resume and save
      await manageResume.createResume(updatedResumeData)
      
      console.log('Publications reordered successfully')
      
    } catch (error) {
      console.error('Error reordering publications:', error)
      errorStore.addError({
        id: uuidv4(),
        message: 'Failed to reorder publications',
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      })
      
      // Reload publications to reset state on error
      await loadPublications()
      throw error
    }
  }
  
  return {
    publications,
    loading,
    loadPublications,
    addPublication,
    updatePublication,
    deletePublication,
    reorderPublications
  }
})

export type PublicationStore = ReturnType<typeof usePublicationStore> 