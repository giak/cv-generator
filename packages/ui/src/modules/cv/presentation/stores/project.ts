import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { ProjectInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository'
import { v4 as uuidv4 } from 'uuid'
import { useResumeStore } from './resume'

// Implémentation temporaire de validateProject jusqu'à ce que le module soit disponible
function validateProject(project: ProjectInterface): { valid: boolean; errors?: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  // Validation de base pour les champs obligatoires
  if (!project.name || project.name.trim() === '') {
    errors.name = ['Le nom du projet est obligatoire'];
    isValid = false;
  }

  // Validation de l'URL si fournie
  if (project.url && project.url.trim() !== '') {
    try {
      new URL(project.url);
    } catch (e) {
      errors.url = ['L\'URL n\'est pas valide'];
      isValid = false;
    }
  }

  // Validation des dates si fournies
  if (project.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(project.startDate)) {
    errors.startDate = ['La date de début doit être au format YYYY-MM-DD'];
    isValid = false;
  }

  if (project.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(project.endDate)) {
    errors.endDate = ['La date de fin doit être au format YYYY-MM-DD'];
    isValid = false;
  }

  // Vérification de la cohérence des dates
  if (project.startDate && project.endDate && project.startDate > project.endDate) {
    if (!errors.endDate) {
      errors.endDate = [];
    }
    errors.endDate.push('La date de fin doit être postérieure à la date de début');
    isValid = false;
  }

  return {
    valid: isValid,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Interface pour un projet avec un ID
 */
export interface ProjectWithId extends ProjectInterface {
  id: string
}

/**
 * Interface pour un projet validé
 */
export interface ValidatedProject {
  data: ProjectWithId
  errors: Record<string, string[]> | null
  isValid: boolean
}

/**
 * Interface pour l'état du store
 */
export interface ProjectStoreState {
  projects: ProjectWithId[]
  isLoading: boolean
  error: Error | null
  lastSaved: Date | null
}

/**
 * Interface pour les actions du store
 */
export interface ProjectStoreActions {
  // Charger les projets
  loadProjects(): Promise<ValidatedProject[]>
  
  // Ajouter un nouveau projet
  addProject(project: ProjectInterface): Promise<ValidatedProject>
  
  // Mettre à jour un projet existant
  updateProject(id: string, project: ProjectInterface): Promise<ValidatedProject>
  
  // Supprimer un projet
  deleteProject(id: string): Promise<boolean>
  
  // Réordonner les projets
  reorderProjects(orderedIds: string[]): Promise<boolean>
}

/**
 * Store Pinia pour gérer les projets
 */
export const useProjectStore = defineStore('project', () => {
  // État
  const projects = ref<ProjectWithId[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const lastSaved = ref<Date | null>(null)

  // Getters
  const count = computed(() => projects.value.length)
  const getById = (id: string) => computed(() => projects.value.find(project => project.id === id))
  const isEmpty = computed(() => projects.value.length === 0)
  
  // Error store for handling errors
  const errorStore = useErrorStore()
  
  // Repository and resume manager
  const repository = new LocalStorageResumeRepository()
  
  // Resume manager with repository instance
  const manageResume = new ManageResume(repository)
  
  /**
   * Charge les projets depuis le localStorage
   */
  async function loadProjects() {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('[ProjectStore] Chargement des projets...')
      
      // Utiliser le manager pour récupérer le CV complet
      const resume = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (resume && resume.projects) {
        // Assurer que tous les projets ont un ID
        projects.value = resume.projects.map(project => ({
          ...project,
          id: uuidv4() // Ajouter un ID si non présent
        }))
        console.log(`[ProjectStore] ${projects.value.length} projets chargés`)
      } else {
        projects.value = []
        console.log('[ProjectStore] Aucun projet trouvé')
      }
      
      // Retourner les projets validés
      return projects.value.map(project => validateProjectData(project))
    } catch (err) {
      console.error('[ProjectStore] Erreur lors du chargement des projets:', err)
      error.value = err instanceof Error ? err : new Error('Erreur inconnue lors du chargement des projets')
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Sauvegarde les projets dans le localStorage via le resume
   */
  async function saveProjects(): Promise<void> {
    const resumeStore = useResumeStore()
    const errorStore = useErrorStore()

    return errorStore.executeWithErrorHandling(
      async () => {
        // Récupérer le CV actuel
        const currentResume = resumeStore.resume;
        
        // Vérifier si le CV existe
        if (!currentResume) {
          throw new Error('Aucun CV trouvé pour enregistrer les projets');
        }
        
        // Créer un nouvel objet de CV avec les projets mis à jour
        const updatedResume = {
          ...currentResume,
          projects: projects.value
        };
        
        // Enregistrer le CV complet avec les projets mis à jour
        await resumeStore.saveResume(updatedResume);
        
        // Afficher un message de succès
        console.log('Projets enregistrés avec succès');
      },
      {
        showToast: true,
        rethrow: false
      }
    );
  }
  
  /**
   * Valide un projet
   */
  function validateProjectData(project: ProjectInterface): ValidatedProject {
    const validationResult = validateProject(project)
    const projectWithId = 'id' in project 
      ? project as ProjectWithId 
      : { ...project, id: uuidv4() }
    
    return {
      data: projectWithId,
      errors: validationResult.errors || null,
      isValid: validationResult.valid
    }
  }
  
  /**
   * Ajoute un nouveau projet
   */
  async function addProject(project: ProjectInterface): Promise<ValidatedProject> {
    const validatedProject = validateProjectData(project)
    
    if (validatedProject.isValid) {
      projects.value.push(validatedProject.data)
      await saveProjects()
    }
    
    return validatedProject
  }
  
  /**
   * Met à jour un projet existant
   */
  async function updateProject(id: string, project: ProjectInterface): Promise<ValidatedProject> {
    const index = projects.value.findIndex(proj => proj.id === id)
    
    if (index === -1) {
      const error = {
        data: { ...project, id } as ProjectWithId,
        errors: { global: ['Projet non trouvé'] },
        isValid: false
      }
      return error
    }
    
    const validatedProject = validateProjectData({ ...project } as ProjectInterface)
    
    if (validatedProject.isValid) {
      projects.value[index] = { ...validatedProject.data, id }
      await saveProjects()
    }
    
    return validatedProject
  }
  
  /**
   * Supprime un projet
   */
  async function deleteProject(id: string): Promise<boolean> {
    const index = projects.value.findIndex(proj => proj.id === id)
    
    if (index === -1) {
      return false
    }
    
    projects.value.splice(index, 1)
    await saveProjects()
    return true
  }
  
  /**
   * Réordonne les projets
   */
  async function reorderProjects(orderedIds: string[]): Promise<boolean> {
    // Vérifier que tous les IDs existent
    const allIdsExist = orderedIds.every(id => 
      projects.value.some(proj => proj.id === id)
    )
    
    if (!allIdsExist || orderedIds.length !== projects.value.length) {
      return false
    }
    
    // Créer un nouvel ordre basé sur les IDs
    const newOrder = orderedIds.map(id => 
      projects.value.find(proj => proj.id === id)!
    )
    
    projects.value = newOrder
    await saveProjects()
    return true
  }
  
  return {
    // État
    projects,
    isLoading,
    error,
    lastSaved,
    
    // Getters
    count,
    getById,
    isEmpty,
    
    // Actions
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects
  }
}) 