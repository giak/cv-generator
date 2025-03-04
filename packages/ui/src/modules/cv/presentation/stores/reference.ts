import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { ReferenceInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'

// Implémentation temporaire de validateReference jusqu'à ce que le module soit disponible
function validateReference(reference: ReferenceInterface): { valid: boolean; errors?: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  // Validation de base pour les champs obligatoires
  if (!reference.name || reference.name.trim() === '') {
    errors.name = ['Le nom est obligatoire'];
    isValid = false;
  }

  if (!reference.reference || reference.reference.trim() === '') {
    errors.reference = ['Le témoignage est obligatoire'];
    isValid = false;
  }

  return {
    valid: isValid,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Interface pour une référence avec un ID
 */
export interface ReferenceWithId extends ReferenceInterface {
  id: string
}

/**
 * Interface pour une référence validée
 */
export interface ValidatedReference {
  data: ReferenceWithId
  errors: Record<string, string[]> | null
  isValid: boolean
}

/**
 * Interface pour l'état du store
 */
export interface ReferenceStoreState {
  references: ReferenceWithId[]
  isLoading: boolean
  error: Error | null
  lastSaved: Date | null
}

/**
 * Interface for the Reference Store actions
 */
export interface ReferenceStoreActions {
  // Load reference entries
  loadReferences(): Promise<ValidatedReference[]>
  
  // Add a new reference entry
  addReference(reference: ReferenceInterface): Promise<ValidatedReference>
  
  // Update an existing reference entry
  updateReference(id: string, reference: ReferenceInterface): Promise<ValidatedReference>
  
  // Delete a reference entry
  deleteReference(id: string): Promise<boolean>
  
  // Reorder reference entries
  reorderReferences(orderedIds: string[]): Promise<boolean>
}

/**
 * Store Pinia pour gérer les références
 */
export const useReferenceStore = defineStore('reference', () => {
  // État
  const references = ref<ReferenceWithId[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const lastSaved = ref<Date | null>(null)

  // Getters
  const count = computed(() => references.value.length)
  const getById = (id: string) => computed(() => references.value.find(reference => reference.id === id))
  const isEmpty = computed(() => references.value.length === 0)
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  
  // Resume manager with repository instance
  const manageResume = new ManageResume(repository)
  
  /**
   * Charge les références depuis le localStorage
   */
  async function loadReferences() {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Récupération depuis le localStorage
      const savedReferences = localStorage.getItem('cv_references')
      
      if (savedReferences) {
        references.value = JSON.parse(savedReferences)
      }
      
      console.log(`[ReferenceStore] ${references.value.length} références chargées`)
    } catch (err) {
      console.error('[ReferenceStore] Erreur lors du chargement des références:', err)
      error.value = err instanceof Error ? err : new Error('Erreur inconnue lors du chargement des références')
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Sauvegarde les références dans le localStorage
   */
  async function saveReferences() {
    try {
      localStorage.setItem('cv_references', JSON.stringify(references.value))
      lastSaved.value = new Date()
      console.log(`[ReferenceStore] ${references.value.length} références sauvegardées`)
      return true
    } catch (err) {
      console.error('[ReferenceStore] Erreur lors de la sauvegarde des références:', err)
      error.value = err instanceof Error ? err : new Error('Erreur inconnue lors de la sauvegarde des références')
      return false
    }
  }
  
  /**
   * Valide une référence
   */
  function validateReferenceData(reference: ReferenceInterface): ValidatedReference {
    const validationResult = validateReference(reference)
    const refWithId = 'id' in reference 
      ? reference as ReferenceWithId 
      : { ...reference, id: uuidv4() }
    
    return {
      data: refWithId,
      errors: validationResult.errors || null,
      isValid: validationResult.valid
    }
  }
  
  /**
   * Ajoute une nouvelle référence
   */
  async function addReference(reference: ReferenceInterface): Promise<ValidatedReference> {
    const validatedReference = validateReferenceData(reference)
    
    if (validatedReference.isValid) {
      references.value.push(validatedReference.data)
      await saveReferences()
    }
    
    return validatedReference
  }
  
  /**
   * Met à jour une référence existante
   */
  async function updateReference(id: string, reference: ReferenceInterface): Promise<ValidatedReference> {
    const index = references.value.findIndex(ref => ref.id === id)
    
    if (index === -1) {
      const error = {
        data: { ...reference, id } as ReferenceWithId,
        errors: { global: ['Référence non trouvée'] },
        isValid: false
      }
      return error
    }
    
    const validatedReference = validateReferenceData({ ...reference } as ReferenceInterface)
    
    if (validatedReference.isValid) {
      references.value[index] = { ...validatedReference.data, id }
      await saveReferences()
    }
    
    return validatedReference
  }
  
  /**
   * Supprime une référence
   */
  async function deleteReference(id: string): Promise<boolean> {
    const index = references.value.findIndex(ref => ref.id === id)
    
    if (index === -1) {
      return false
    }
    
    references.value.splice(index, 1)
    await saveReferences()
    return true
  }
  
  /**
   * Réordonne les références
   */
  async function reorderReferences(orderedIds: string[]): Promise<boolean> {
    // Vérifier que tous les IDs existent
    const allIdsExist = orderedIds.every(id => 
      references.value.some(ref => ref.id === id)
    )
    
    if (!allIdsExist || orderedIds.length !== references.value.length) {
      return false
    }
    
    // Créer un nouvel ordre basé sur les IDs
    const newOrder = orderedIds.map(id => 
      references.value.find(ref => ref.id === id)!
    )
    
    references.value = newOrder
    await saveReferences()
    return true
  }
  
  return {
    // État
    references,
    isLoading,
    error,
    lastSaved,
    
    // Getters
    count,
    getById,
    isEmpty,
    
    // Actions
    loadReferences,
    addReference,
    updateReference,
    deleteReference,
    reorderReferences
  }
}) 