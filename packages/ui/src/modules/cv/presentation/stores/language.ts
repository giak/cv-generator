import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { LanguageInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Interface extended to include ID
export interface LanguageWithId extends LanguageInterface {
  id?: string
}

// Interface for validated language
export interface ValidatedLanguage {
  id: string
  language: string
  fluency: string
  toJSON: () => LanguageWithId
}

// Interface for the Language Store state
export interface LanguageStoreState {
  languages: ValidatedLanguage[] | null
  loading: boolean
}

// Interface for the Language Store actions
export interface LanguageStoreActions {
  // Load language entries
  loadLanguages(): Promise<ValidatedLanguage[]>
  
  // Add a new language entry
  addLanguage(language: LanguageInterface): Promise<void>
  
  // Update an existing language entry
  updateLanguage(id: string, language: LanguageInterface): Promise<void>
  
  // Delete a language entry
  deleteLanguage(id: string): Promise<void>
  
  // Reorder language entries
  reorderLanguages(newOrder: string[]): Promise<void>
}

// Define the Language Store
export const useLanguageStore = defineStore('language', () => {
  // State
  const languages = ref<ValidatedLanguage[] | null>(null)
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
  
  // Load language entries
  const loadLanguages = async (): Promise<ValidatedLanguage[]> => {
    loading.value = true
    
    try {
      console.log('Loading language entries...')
      
      // Create repository and load resume
      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      // If resumeData is valid and resume property exists
      if (result) {
        // Check if have language data
        let resumeData;
        try {
          resumeData = result.toJSON();
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error);
          resumeData = { languages: [] };
        }
        
        const languageData = resumeData.languages || []
        
        console.log('Loaded language data:', languageData)
        
        // Map to ValidatedLanguage objects
        languages.value = languageData.map(lang => {
          const language = lang as LanguageWithId
          return {
            id: language.id || generateId(),
            language: language.language || '',
            fluency: language.fluency || '',
            toJSON: () => ({
              ...language,
              id: language.id || generateId()
            })
          }
        })
        
        return languages.value
      } else {
        console.warn('No valid resume found or no language data')
        languages.value = []
        return []
      }
    } catch (error) {
      console.error('Error loading language entries:', error)
      languages.value = []
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Add a new language entry
  const addLanguage = async (language: LanguageInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Adding new language entry:', language)
      
      if (!language.language) {
        throw new Error('Missing required field: language')
      }
      
      // Generate ID for the new language entry
      const languageWithId: LanguageWithId = {
        ...language,
        id: generateId()
      }
      
      // Load current language entries if needed
      if (!languages.value) {
        await loadLanguages()
      }
      
      // Add to local state first (optimistic update)
      const newItem: ValidatedLanguage = {
        id: languageWithId.id as string,
        language: language.language,
        fluency: language.fluency || '',
        toJSON: () => languageWithId
      }
      
      languages.value = [newItem, ...(languages.value || [])]
      
      try {
        // Save to storage
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Create empty languages array if needed
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
            languages: []
          };
        }
        
        // Ensure languages array exists
        if (!updatedData.languages) {
          updatedData.languages = [];
        }
        
        // Add new language to the beginning
        updatedData.languages = [
          languageWithId,
          ...updatedData.languages
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
        
        console.log('Language entry added successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        // Remove from local state on error
        languages.value = languages.value?.filter(l => l.id !== newItem.id) || null;
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible d\'ajouter la langue',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error adding language entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Update an existing language entry
  const updateLanguage = async (id: string, language: LanguageInterface): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Updating language entry:', id, language)
      
      if (!language.language) {
        throw new Error('Missing required field: language')
      }
      
      // Load current language entries if needed
      if (!languages.value) {
        await loadLanguages()
      }
      
      // Check if language exists
      const existingIndex = languages.value?.findIndex(l => l.id === id) ?? -1
      
      if (existingIndex === -1) {
        throw new Error('Language not found')
      }
      
      // Create updated language with ID
      const updatedLanguage: LanguageWithId = {
        ...language,
        id: id
      }
      
      // Update local state first (optimistic update)
      const updatedItem: ValidatedLanguage = {
        id: id,
        language: language.language,
        fluency: language.fluency || '',
        toJSON: () => updatedLanguage
      }
      
      if (languages.value && existingIndex !== -1) {
        languages.value[existingIndex] = updatedItem
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
        
        // Ensure languages array exists
        if (!updatedData.languages) {
          updatedData.languages = [];
        }
        
        // Find and update the language entry
        const languageIndex = updatedData.languages.findIndex((l: any) => l.id === id)
        
        if (languageIndex !== -1) {
          updatedData.languages[languageIndex] = updatedLanguage
        } else {
          console.warn('Language not found in resume data, cannot update')
          throw new Error('Language not found in resume data')
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
        
        console.log('Language entry updated successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Reload original state on error
        await loadLanguages()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de mettre à jour la langue',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating language entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Delete a language entry
  const deleteLanguage = async (id: string): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Deleting language entry:', id)
      
      // Load current language entries if needed
      if (!languages.value) {
        await loadLanguages()
      }
      
      // Check if language exists
      const existingLanguage = languages.value?.find(l => l.id === id)
      
      if (!existingLanguage) {
        throw new Error('Language not found')
      }
      
      // Remove from local state first (optimistic update)
      const newLanguages = languages.value?.filter(l => l.id !== id) || []
      languages.value = newLanguages
      
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
        
        // Remove the language entry
        if (updatedData.languages) {
          updatedData.languages = updatedData.languages.filter((l: any) => l.id !== id)
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
        
        console.log('Language entry deleted successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Restore original state on error
        await loadLanguages()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de supprimer la langue',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error deleting language entry:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // Reorder language entries
  const reorderLanguages = async (newOrder: string[]): Promise<void> => {
    loading.value = true
    
    try {
      console.log('Reordering language entries:', newOrder)
      
      // Load current language entries if needed
      if (!languages.value) {
        await loadLanguages()
      }
      
      if (!languages.value || languages.value.length === 0) {
        console.warn('No languages to reorder')
        return
      }
      
      // Create a map of current languages for easy access
      const languageMap = new Map<string, ValidatedLanguage>()
      languages.value.forEach(language => {
        languageMap.set(language.id, language)
      })
      
      // Create new ordered list based on new order
      const orderedLanguages: ValidatedLanguage[] = []
      
      for (const id of newOrder) {
        const language = languageMap.get(id)
        if (language) {
          orderedLanguages.push(language)
        }
      }
      
      // Ensure all languages are included (in case some were missed in newOrder)
      languages.value.forEach(language => {
        if (!newOrder.includes(language.id)) {
          orderedLanguages.push(language)
        }
      })
      
      // Update local state
      languages.value = orderedLanguages
      
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
        
        // Ensure languages array exists
        if (!updatedData.languages) {
          updatedData.languages = [];
        }
        
        // Create a map of current languages in resume data
        const resumeLanguagesMap = new Map<string, any>()
        updatedData.languages.forEach((language: any) => {
          if (language.id) {
            resumeLanguagesMap.set(language.id, language)
          }
        })
        
        // Create new ordered list based on new order
        const orderedResumeLanguages: any[] = []
        
        for (const id of newOrder) {
          const language = resumeLanguagesMap.get(id)
          if (language) {
            orderedResumeLanguages.push(language)
          }
        }
        
        // Ensure all languages are included
        updatedData.languages.forEach((language: any) => {
          if (language.id && !newOrder.includes(language.id)) {
            orderedResumeLanguages.push(language)
          }
        })
        
        // Update resume data with new order
        updatedData.languages = orderedResumeLanguages
        
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
        
        console.log('Language entries reordered successfully');
      } catch (error) {
        console.error('Error saving to repository:', error);
        
        // Reload original state on error
        await loadLanguages()
        
        // Create a proper error object with all required fields
        errorStore.addError({
          id: uuidv4(),
          message: 'Impossible de réordonner les langues',
          timestamp: Date.now(),
          severity: 'error',
          source: 'ui',
          dismissed: false
        })
        
        throw error;
      }
    } catch (error) {
      console.error('Error reordering language entries:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    languages,
    loading,
    
    // Actions
    loadLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    reorderLanguages
  }
})

export type LanguageStore = ReturnType<typeof useLanguageStore> 