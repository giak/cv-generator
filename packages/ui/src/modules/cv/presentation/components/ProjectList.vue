<template>
  <div class="space-y-6">
    <CollectionManager
      :items="displayedProjects"
      :title="t(TRANSLATION_KEYS.RESUME.PROJECTS.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.PROJECTS.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.PROJECTS.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.PROJECTS.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.PROJECTS.LIST.EMPTY_STATE_DESCRIPTION)"
      :loading="isLoading"
      @add="openAddForm"
      @edit="openEditForm"
      @delete="openDeleteConfirm"
      @reorder="handleReorder"
    >
      <!-- Sorting options -->
      <template #header-actions>
        <div v-if="projects.length > 1" class="flex items-center">
          <button 
            type="button"
            @click="toggleSortOrder"
            class="flex items-center text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
            :class="{'text-primary-300': useChronologicalSort && !isCustomOrder, 'text-neutral-400': !useChronologicalSort || isCustomOrder}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <polyline points="21 8 21 21"></polyline>
              <polyline points="10 21 3 21 3 8"></polyline>
              <line x1="14" y1="4" x2="14" y2="21"></line>
              <line x1="18" y1="4" x2="18" y2="21"></line>
              <line x1="3" y1="12" x2="10" y2="12"></line>
              <line x1="3" y1="16" x2="10" y2="16"></line>
            </svg>
            {{ useChronologicalSort && !isCustomOrder ? safeTranslate('resume.projects.list.chronologicalOrder', 'Tri chronologique') : safeTranslate('resume.projects.list.customOrder', 'Ordre personnalisé') }}
          </button>
        </div>
      </template>
      
      <template #emptyIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      </template>
      
      <template #item="{ item: project }">
        <div class="flex-grow">
          <div class="flex flex-col mb-2">
            <h3 class="font-semibold text-lg mb-1">{{ project.name }}</h3>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
              <span class="text-primary-400 font-medium">{{ formatDuration(project) }}</span>
              <span 
                v-if="project.entity" 
                class="flex items-center text-neutral-400 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {{ project.entity }}
              </span>
              <span v-if="project.type" class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
                {{ project.type }}
              </span>
            </div>
          </div>
          
          <div v-if="project.description" class="text-sm text-neutral-300 mb-3">
            {{ project.description }}
          </div>
          
          <div v-if="project.highlights && project.highlights.length > 0" class="mb-3">
            <ul class="list-disc list-inside space-y-1">
              <li 
                v-for="(highlight, index) in project.highlights" 
                :key="index"
                class="text-sm text-neutral-300"
              >
                {{ highlight }}
              </li>
            </ul>
          </div>
          
          <div v-if="project.keywords && project.keywords.length > 0" class="mb-3 flex flex-wrap gap-2">
            <span 
              v-for="(keyword, index) in project.keywords" 
              :key="index"
              class="px-2 py-0.5 rounded-md bg-neutral-700 text-neutral-300 text-xs"
            >
              {{ keyword }}
            </span>
          </div>
          
          <div v-if="project.url" class="mt-2">
            <a :href="project.url" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              {{ safeTranslate('resume.projects.list.viewProject', 'Voir le projet') }}
            </a>
          </div>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Performance optimization: show more/less button -->
    <div v-if="hasMoreItems" class="flex justify-center mt-4">
      <button 
        @click="toggleShowAllItems" 
        class="flex items-center px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
      >
        <span>{{ safeTranslate('resume.projects.list.showAll', 'Voir tous les projets') }} ({{ sortedProjects.length }})</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
    
    <div v-if="showAllItems && sortedProjects.length > itemsPerPage" class="flex justify-center mt-4">
      <button 
        @click="toggleShowAllItems" 
        class="flex items-center px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
      >
        <span>{{ safeTranslate('resume.projects.list.showLess', 'Réduire la liste') }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Modal pour ajouter/modifier un projet -->
    <div v-if="showForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <ProjectForm
            v-model="currentProject"
            :loading="isFormSubmitting"
            :is-editing="isEditing"
            :errors="formErrors"
            :keys="formKeys"
            @validate="submitForm"
            @cancel="() => { showForm = false }"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal pour confirmer la suppression -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-semibold mb-4">{{ safeTranslate('resume.projects.form.confirmDelete', 'Confirmer la suppression') }}</h3>
        
        <p class="text-neutral-300 mb-6">
          {{ safeTranslate('resume.projects.form.deleteWarning', 'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.') }}
        </p>
        
        <div v-if="projectToDelete" class="bg-neutral-800 p-4 rounded-lg mb-6">
          <p class="font-medium">{{ projectToDelete.name }}</p>
          <p class="text-sm text-neutral-400 mt-1">{{ projectToDelete.description }}</p>
        </div>
        
        <div class="flex justify-end gap-4">
          <Button 
            variant="neutral" 
            @click="closeDeleteConfirm"
          >
            {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
          </Button>
          
          <Button 
            variant="error" 
            :loading="isDeletingProject"
            @click="confirmDelete"
          >
            {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE) }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Toast notifications -->
    <Transition name="toast">
      <div v-if="toast.visible" 
           :class="['fixed bottom-5 right-5 p-4 rounded-lg shadow-lg max-w-md z-50 flex items-center', 
                   toast.type === 'success' ? 'bg-success-600 text-white' : 'bg-error-600 text-white']">
        <span class="mr-2">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </span>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/project'
import ProjectForm from './ProjectForm.vue'
import Button from '@ui/components/shared/Button.vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
import type { ProjectInterface } from '@cv-generator/shared/src/types/resume.interface'
import type { ProjectWithId } from '../stores/project'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Fonction de traduction
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key)
    return translation !== key ? translation : fallback
  } catch (e) {
    return fallback
  }
}

// Store des projets
const projectStore = useProjectStore()

// État des projets
const isLoading = computed(() => projectStore.isLoading)

// State for sorting
const useChronologicalSort = ref(true)
const isCustomOrder = ref(false)

// Performance optimization for large lists
const itemsPerPage = ref(10) // Default limit for better performance
const showAllItems = ref(false)

// Setup de useCollectionField pour gérer les projets
const { 
  items: projects,
  isAddingItem: showForm,
  newItem: currentProject,
  resetNewItem} = useCollectionField<ProjectWithId>({
  fieldName: 'projects',
  collection: computed(() => projectStore.projects),
  updateField: () => {}, // On utilise directement le store
  defaultItemValues: {
    name: '',
    id: ''
  },
  identifierField: 'id'
})

// Chronologically sorted projects (most recent first)
const sortedProjects = computed(() => {
  // If using custom order, return the original list
  if (!useChronologicalSort.value || isCustomOrder.value) {
    return projects.value;
  }
  
  // Create a copy to avoid modifying the source
  return [...projects.value].sort((a, b) => {
    // For projects, we'll prioritize ongoing projects (those with no endDate)
    // and then sort by the most recent startDate or endDate
    const isCurrentA = !a.endDate || a.endDate === '';
    const isCurrentB = !b.endDate || b.endDate === '';
    
    // If one is current but not the other, prioritize the current one
    if (isCurrentA && !isCurrentB) return -1;
    if (!isCurrentA && isCurrentB) return 1;
    
    // If both have end dates, compare them (most recent first)
    if (a.endDate && b.endDate) {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    
    // If both are current or neither has an end date, compare start dates
    if (a.startDate && b.startDate) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    
    // Handle cases with missing dates
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1; // a should come after b
    if (!b.startDate) return -1; // b should come after a
    
    return 0;
  });
});

// Displayed projects (either sorted or original based on setting) with pagination
const displayedProjects = computed(() => {
  const projectsToDisplay = sortedProjects.value;
  
  // If showing all items or if the list is smaller than the limit, return all
  if (showAllItems.value || projectsToDisplay.length <= itemsPerPage.value) {
    return projectsToDisplay;
  }
  
  // Otherwise, return limited items for better performance
  return projectsToDisplay.slice(0, itemsPerPage.value);
});

// Determine if we have more items to show
const hasMoreItems = computed(() => {
  return sortedProjects.value.length > itemsPerPage.value && !showAllItems.value;
});

// Toggle between showing limited items and all items
const toggleShowAllItems = () => {
  showAllItems.value = !showAllItems.value;
};

// État du formulaire
const isEditing = ref(false)
const isFormSubmitting = ref(false)
const formErrors = ref({})
const formKeys = ref({})

// État de la confirmation de suppression
const showDeleteConfirm = ref(false)
const isDeletingProject = ref(false)
const projectToDelete = ref<ProjectWithId | null>(null)

// Toast notifications
const toast = reactive({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
})

// Formater une date YYYY-MM-DD en format lisible
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  const [year, month, day] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Formater la durée d'un projet
const formatDuration = (project: ProjectWithId): string => {
  const hasStart = project.startDate && project.startDate.trim() !== '';
  const hasEnd = project.endDate && project.endDate.trim() !== '';
  
  if (!hasStart && !hasEnd) {
    return '';
  }
  
  if (hasStart && !hasEnd) {
    return `${formatDate(project.startDate || '')} - ${safeTranslate('resume.projects.list.present', 'Présent')}`;
  }
  
  if (!hasStart && hasEnd) {
    return `${safeTranslate('resume.projects.list.until', 'Jusqu\'au')} ${formatDate(project.endDate || '')}`;
  }
  
  return `${formatDate(project.startDate || '')} - ${formatDate(project.endDate || '')}`;
}

// Chargement des projets
onMounted(async () => {
  if (!projects.value || projects.value.length === 0) {
    await projectStore.loadProjects()
  }
})

// Ouvrir le formulaire d'ajout
const openAddForm = () => {
  isEditing.value = false
  resetNewItem()
  showForm.value = true
}

// Ouvrir le formulaire d'édition
const openEditForm = (project: ProjectWithId) => {
  currentProject.value = {
    ...project,
    // Convert undefined to empty array for client-side validation
    highlights: project.highlights || []
  }
  isEditing.value = true
  showForm.value = true
}

// Ouvrir la confirmation de suppression
const openDeleteConfirm = (project: ProjectWithId) => {
  projectToDelete.value = project
  showDeleteConfirm.value = true
}

// Fermer la confirmation de suppression
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  projectToDelete.value = null
}

// Soumettre le formulaire (ajout ou modification)
const submitForm = async () => {
  if (!currentProject.value) return
  
  isFormSubmitting.value = true
  
  try {
    let success = false
    
    if (isEditing.value) {
      success = await projectStore.updateProject(currentProject.value.id, currentProject.value)
      
      if (success) {
        showToast(safeTranslate('resume.projects.notifications.updateSuccess', 'Projet mis à jour avec succès'), 'success')
      } else {
        showToast(safeTranslate('resume.projects.notifications.updateError', 'Erreur lors de la mise à jour du projet'), 'error')
      }
    } else {
      const newProject = await projectStore.addProject(currentProject.value as ProjectInterface)
      
      if (newProject) {
        showToast(safeTranslate('resume.projects.notifications.addSuccess', 'Projet ajouté avec succès'), 'success')
        success = true
      } else {
        showToast(safeTranslate('resume.projects.notifications.addError', 'Erreur lors de l\'ajout du projet'), 'error')
      }
    }
    
    if (success) {
      showForm.value = false
    }
  } catch (error) {

    showToast(safeTranslate('resume.projects.notifications.formError', 'Une erreur est survenue lors de la soumission du formulaire'), 'error')
  } finally {
    isFormSubmitting.value = false
  }
}

// Confirmer la suppression
const confirmDelete = async () => {
  if (!projectToDelete.value) return
  
  isDeletingProject.value = true
  
  try {
    const success = await projectStore.deleteProject(projectToDelete.value.id)
    
    if (success) {
      showToast(safeTranslate('resume.projects.notifications.deleteSuccess', 'Projet supprimé avec succès'), 'success')
    } else {
      showToast(safeTranslate('resume.projects.notifications.deleteError', 'Erreur lors de la suppression du projet'), 'error')
    }
    
    closeDeleteConfirm()
  } catch (error) {

    showToast(safeTranslate('resume.projects.notifications.deleteError', 'Une erreur est survenue lors de la suppression'), 'error')
  } finally {
    isDeletingProject.value = false
  }
}

// Toggle between chronological and custom order
const toggleSortOrder = async () => {
  useChronologicalSort.value = !useChronologicalSort.value
  
  // If switching to chronological and we have a custom order,
  // reset the custom order flag
  if (useChronologicalSort.value && isCustomOrder.value) {
    isCustomOrder.value = false
    // Note: We're not actually changing the stored order here,
    // just displaying in chronological order
  }
  
  // Reset pagination when toggling sort
  showAllItems.value = false;
}

// Fonction pour gérer la réorganisation via le CollectionManager
const handleReorder = async (newOrder: string[]) => {
  try {
    await projectStore.reorderProjects(newOrder)
  } catch (error) {
    console.error('Error reordering projects:', error)
  }
}

// Afficher une notification toast
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Si un toast est déjà visible, on le ferme
  if (toast.timeout) {
    clearTimeout(toast.timeout)
    toast.visible = false
  }
  
  // Afficher le nouveau toast
  toast.message = message
  toast.type = type
  toast.visible = true
  
  // Masquer le toast après 5 secondes
  toast.timeout = window.setTimeout(() => {
    toast.visible = false
    toast.timeout = null
  }, 5000)
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
