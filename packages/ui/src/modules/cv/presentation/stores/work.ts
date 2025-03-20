import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'

// Interface étendue pour inclure l'ID
export interface WorkWithId extends WorkInterface {
  id?: string
}

// Interface pour représenter une expérience professionnelle validée
export interface ValidatedWork {
  id: string
  name: string
  position: string
  startDate: string
  endDate?: string
  highlights?: string[]
  summary?: string
  url?: string
  toJSON: () => WorkWithId
}

// Définition du type d'état du store
export interface WorkStoreState {
  works: ValidatedWork[] | null
  loading: boolean
}

// Définition des actions du store
export interface WorkStoreActions {
  // Chargement des expériences
  loadWorks(): Promise<ValidatedWork[]>
  
  // Ajout d'une nouvelle expérience
  addWork(work: WorkInterface): Promise<void>
  
  // Mise à jour d'une expérience existante
  updateWork(index: number, work: WorkInterface): Promise<void>
  
  // Suppression d'une expérience
  deleteWork(index: number): Promise<void>
  
  // Réorganisation des expériences (changement d'ordre)
  reorderWorks(newOrder: number[]): Promise<void>
  
  // Vérification si une erreur existe pour un champ spécifique
  hasFieldError(field: string): boolean
  
  // Récupération du message d'erreur pour un champ spécifique
  getFieldError(field: string): string | null
}

// Fonction utilitaire pour créer un cas d'utilisation ManageResume
function createUseCase() {
  return new ManageResume(new LocalStorageResumeRepository())
}

/**
 * Store Pinia pour la gestion des expériences professionnelles
 * Ce store suit les principes de Clean Architecture en déléguant la logique métier
 * aux cas d'utilisation et entités du domaine.
 */
export const useWorkStore = defineStore('work', () => {
  // Déclaration de l'état avec des références réactives
  const works = ref<ValidatedWork[] | null>(null)
  const loading = ref<boolean>(false)
  
  // Récupération du store d'erreurs
  const errorStore = useErrorStore()
  
  /**
   * Charge les expériences professionnelles depuis le repository
   * @returns Une promesse contenant les expériences chargées
   */
  async function loadWorks(): Promise<ValidatedWork[]> {
    // Gestion centralisée des erreurs
    return await errorStore.executeWithErrorHandling(async () => {
      try {
        loading.value = true
        
        // Utilisation du cas d'utilisation pour charger le CV
        const useCase = createUseCase()
        const resume = await useCase.loadResume()
        
        // Conversion des expériences brutes en objets validés
        // Nous n'utilisons pas l'entité Work directement car cela crée des problèmes d'importation
        // à la place, nous créons des objets qui respectent l'interface ValidatedWork
        const workEntities: ValidatedWork[] = []
        
        if (resume.work && resume.work.length > 0) {
          for (const workData of resume.work) {
            // Création d'un objet qui respecte l'interface ValidatedWork
            const validatedWork: ValidatedWork = {
              id: (workData as WorkWithId).id || `work-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: workData.name,
              position: workData.position,
              startDate: workData.startDate,
              endDate: workData.endDate,
              highlights: workData.highlights,
              summary: workData.summary,
              url: workData.url,
              toJSON: () => ({
                id: validatedWork.id,
                name: validatedWork.name,
                position: validatedWork.position,
                startDate: validatedWork.startDate,
                endDate: validatedWork.endDate,
                highlights: validatedWork.highlights,
                summary: validatedWork.summary,
                url: validatedWork.url
              })
            }
            
            workEntities.push(validatedWork)
          }
        }
        
        // Mise à jour de l'état
        works.value = workEntities

        return workEntities
      } finally {
        loading.value = false
      }
    }) || [] // Retourner un tableau vide si le résultat est undefined
  }
  
  /**
   * Ajoute une nouvelle expérience professionnelle
   * @param work Données de l'expérience à ajouter
   */
  async function addWork(work: WorkInterface): Promise<void> {
    return await errorStore.executeWithErrorHandling(async () => {
      try {
        loading.value = true
        
        // Chargement du CV actuel
        const useCase = createUseCase()
        const resume = await useCase.loadResume()
        
        // Validation basique de l'expérience
        if (!work.name || !work.position || !work.startDate) {
          throw new Error("Work experience requires name, position and startDate")
        }
        
        // Log all fields to ensure they're properly included

        // Ensure the work object has all fields properly set
        const completeWork: WorkInterface = {
          name: work.name,
          position: work.position,
          startDate: work.startDate,
          endDate: work.endDate || '',
          url: work.url || '',
          summary: work.summary || '',
          highlights: work.highlights || []
        }
        
        // Ajout de l'expérience au CV
        const updatedWorks = [...(resume.work || []), completeWork]
        
        // Sauvegarde du CV mis à jour
        const resumeData = resume.toJSON()
        resumeData.work = updatedWorks
        
        await useCase.createResume(resumeData)
        
        // Rechargement des expériences pour refléter les changements
        await loadWorks()

      } finally {
        loading.value = false
      }
    })
  }
  
  /**
   * Met à jour une expérience professionnelle existante
   * @param index Index de l'expérience à mettre à jour
   * @param work Nouvelles données de l'expérience
   */
  async function updateWork(index: number, work: WorkInterface): Promise<void> {
    return await errorStore.executeWithErrorHandling(async () => {
      try {
        loading.value = true
        
        // Vérification que les expériences sont chargées
        if (!works.value) {
          throw new Error('Work experiences not loaded')
        }
        
        // Vérification que l'index est valide
        if (index < 0 || index >= works.value.length) {
          throw new Error(`Invalid work index: ${index}`)
        }
        
        // Chargement du CV actuel
        const useCase = createUseCase()
        const resume = await useCase.loadResume()
        
        // Validation basique de l'expérience
        if (!work.name || !work.position || !work.startDate) {
          throw new Error("Work experience requires name, position and startDate")
        }
        
        // Log all fields to ensure they're properly included

        // Ensure the work object has all fields properly set
        const completeWork: WorkWithId = {
          id: works.value[index].id, // Préservation de l'ID original
          name: work.name,
          position: work.position,
          startDate: work.startDate,
          endDate: work.endDate || '',
          url: work.url || '',
          summary: work.summary || '',
          highlights: work.highlights || []
        }
        
        // Mise à jour de l'expérience dans le CV
        const updatedWorks = [...(resume.work || [])]
        updatedWorks[index] = completeWork
        
        // Sauvegarde du CV mis à jour
        const resumeData = resume.toJSON()
        resumeData.work = updatedWorks
        
        await useCase.createResume(resumeData)
        
        // Rechargement des expériences pour refléter les changements
        await loadWorks()

      } finally {
        loading.value = false
      }
    })
  }
  
  /**
   * Supprime une expérience professionnelle
   * @param index Index de l'expérience à supprimer
   */
  async function deleteWork(index: number): Promise<void> {
    return await errorStore.executeWithErrorHandling(async () => {
      try {
        loading.value = true
        
        // Vérification que les expériences sont chargées
        if (!works.value) {
          throw new Error('Work experiences not loaded')
        }
        
        // Vérification que l'index est valide
        if (index < 0 || index >= works.value.length) {
          throw new Error(`Invalid work index: ${index}`)
        }
        
        // Chargement du CV actuel
        const useCase = createUseCase()
        const resume = await useCase.loadResume()
        
        // Suppression de l'expérience
        const updatedWorks = [...(resume.work || [])]
        updatedWorks.splice(index, 1)
        
        // Sauvegarde du CV mis à jour
        const resumeData = resume.toJSON()
        resumeData.work = updatedWorks
        
        await useCase.createResume(resumeData)
        
        // Rechargement des expériences pour refléter les changements
        await loadWorks()

      } finally {
        loading.value = false
      }
    })
  }
  
  /**
   * Réorganise l'ordre des expériences professionnelles
   * @param newOrder Tableau contenant les nouveaux indices des expériences
   */
  async function reorderWorks(newOrder: number[]): Promise<void> {
    return await errorStore.executeWithErrorHandling(async () => {
      try {
        loading.value = true
        
        // Vérification que les expériences sont chargées
        if (!works.value) {
          throw new Error('Work experiences not loaded')
        }
        
        // Vérification que le nouvel ordre est valide
        if (newOrder.length !== works.value.length) {
          throw new Error(`Invalid order length: ${newOrder.length}, expected ${works.value.length}`)
        }
        
        // Chargement du CV actuel
        const useCase = createUseCase()
        const resume = await useCase.loadResume()
        
        if (!resume.work || resume.work.length === 0) {
          return
        }
        
        // Création d'un nouveau tableau d'expériences avec le nouvel ordre
        const reorderedWorks = newOrder.map(i => resume.work[i])
        
        // Sauvegarde du CV mis à jour
        const resumeData = resume.toJSON()
        resumeData.work = reorderedWorks
        
        await useCase.createResume(resumeData)
        
        // Rechargement des expériences pour refléter les changements
        await loadWorks()

      } finally {
        loading.value = false
      }
    })
  }
  
  // Exposition des méthodes du store d'erreurs pour faciliter l'accès par les composants
  function hasFieldError(field: string): boolean {
    return errorStore.hasFieldError(field)
  }
  
  function getFieldError(field: string): string | null {
    const error = errorStore.getFieldError(field)
    if (typeof error === 'string') {
      return error
    }
    return error?.message || null
  }
  
  // Exposition de l'API publique du store
  return {
    // État
    works,
    loading,
    
    // Actions
    loadWorks,
    addWork,
    updateWork,
    deleteWork,
    reorderWorks,
    
    // Gestion des erreurs
    hasFieldError,
    getFieldError
  }
})
