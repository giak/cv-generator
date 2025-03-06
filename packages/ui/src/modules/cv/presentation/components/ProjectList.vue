<template>
  <div class="space-y-6">
    <CollectionManager
      :items="displayedProjects"
      title="Projets"
      description="Gérez vos projets personnels et professionnels pour votre CV"
      addButtonText="Ajouter un projet"
      emptyStateTitle="Aucun projet"
      emptyStateDescription="Commencez par ajouter un projet pour enrichir votre CV."
      :loading="isLoading"
      @add="openAddForm"
      @edit="openEditForm"
      @delete="openDeleteConfirm"
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
            {{ useChronologicalSort && !isCustomOrder ? 'Tri chronologique' : 'Ordre personnalisé' }}
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
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 class="font-semibold text-lg">{{ project.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <span v-if="project.type" class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
                {{ project.type }}
              </span>
              <span v-if="project.entity" class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-medium">
                {{ project.entity }}
              </span>
            </div>
          </div>
          
          <div v-if="project.startDate || project.endDate" class="text-sm text-neutral-400 mb-2">
            <span v-if="project.startDate">{{ formatDate(project.startDate) }}</span>
            <span v-if="project.startDate && project.endDate"> - </span>
            <span v-if="project.endDate">{{ formatDate(project.endDate) }}</span>
          </div>
          
          <p v-if="project.description" class="text-neutral-300 mb-2">{{ project.description }}</p>
          
          <div v-if="project.highlights && project.highlights.length > 0" class="mt-2">
            <ul class="list-disc list-inside text-sm text-neutral-300 space-y-1">
              <li v-for="(highlight, index) in project.highlights" :key="index">
                {{ highlight }}
              </li>
            </ul>
          </div>
          
          <div v-if="project.url" class="mt-2">
            <a :href="project.url" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Voir le projet
            </a>
          </div>
        </div>
      </template>
      
      <template #itemActions="{ item: project, index }">
        <div class="flex flex-col gap-2">
          <!-- Reorder buttons -->
          <div class="flex gap-1">
            <button
              type="button"
              @click="moveUp(index)"
              :disabled="index === 0"
              class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              title="Déplacer vers le haut"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            
            <button
              type="button"
              @click="moveDown(index)"
              :disabled="index === projects.length - 1"
              class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              title="Déplacer vers le bas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
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
        <span>Voir tous les projets ({{ sortedProjects.length }})</span>
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
        <span>Réduire la liste</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Modal pour ajouter/modifier un projet -->
    <div v-if="showForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-neutral-700">
          <h3 class="text-lg font-medium">
            {{ isEditing ? 'Modifier un projet' : 'Ajouter un projet' }}
          </h3>
          <button 
            @click="closeForm" 
            class="text-neutral-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <ProjectForm
            :project="currentProject"
            :project-id="currentProjectId"
            :is-loading="isFormSubmitting"
            @submit="saveProject"
            @cancel="closeForm"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">Supprimer ce projet</h3>
          <p class="mb-6 text-neutral-300">
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="closeDeleteConfirm"
            >
              Annuler
            </Button>
            <Button 
              variant="danger"
              :loading="isDeletingProject"
              @click="confirmDelete"
            >
              Supprimer
            </Button>
          </div>
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
  editingItemId: currentProjectId,
  newItem: currentProject,
  addItem,
  updateItem,
  removeItem,
  startEditing,
  cancelEditing,
  resetNewItem,
  reorderItems
} = useCollectionField<ProjectWithId>({
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
  isEditing.value = true
  currentProjectId.value = project.id
  Object.assign(currentProject.value, project)
  showForm.value = true
}

// Fermer le formulaire
const closeForm = () => {
  showForm.value = false
  setTimeout(() => {
    resetNewItem()
    currentProjectId.value = null
    isEditing.value = false
  }, 300)
}

// Sauvegarder un projet
const saveProject = async (project: ProjectInterface) => {
  isFormSubmitting.value = true
  
  try {
    if (isEditing.value && currentProjectId.value) {
      // Mettre à jour le projet existant
      const result = await projectStore.updateProject(currentProjectId.value, project)
      
      if (result.isValid) {
        showToast('Projet mis à jour avec succès', 'success')
        closeForm()
      } else {
        const errors = result.errors ? Object.values(result.errors).flat().join(', ') : 'Erreur de validation'
        showToast(`Erreur lors de la mise à jour : ${errors}`, 'error')
      }
    } else {
      // Ajouter un nouveau projet
      const result = await projectStore.addProject(project)
      
      if (result.isValid) {
        showToast('Projet ajouté avec succès', 'success')
        closeForm()
      } else {
        const errors = result.errors ? Object.values(result.errors).flat().join(', ') : 'Erreur de validation'
        showToast(`Erreur lors de l'ajout : ${errors}`, 'error')
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error)
    showToast('Une erreur est survenue lors de la sauvegarde', 'error')
  } finally {
    isFormSubmitting.value = false
  }
}

// Ouvrir la confirmation de suppression
const openDeleteConfirm = (project: ProjectWithId) => {
  projectToDelete.value = project
  showDeleteConfirm.value = true
}

// Fermer la confirmation de suppression
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  setTimeout(() => {
    projectToDelete.value = null
  }, 300)
}

// Confirmer la suppression
const confirmDelete = async () => {
  if (!projectToDelete.value) return
  
  isDeletingProject.value = true
  
  try {
    const success = await projectStore.deleteProject(projectToDelete.value.id)
    
    if (success) {
      showToast('Projet supprimé avec succès', 'success')
    } else {
      showToast('Erreur lors de la suppression du projet', 'error')
    }
    
    closeDeleteConfirm()
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error)
    showToast('Une erreur est survenue lors de la suppression', 'error')
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

// Reorder projects up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Mark as custom order
  isCustomOrder.value = true
  useChronologicalSort.value = false
  
  // Create array of indices, then map to strings
  const indices = [...Array(projects.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorderProjects method
  const newOrder = indices.map(i => projects.value[i].id)
  
  try {
    await projectStore.reorderProjects(newOrder)
  } catch (error) {
    console.error('Error reordering projects:', error)
    showToast('Erreur lors de la réorganisation des projets', 'error')
  }
}

// Reorder projects down
const moveDown = async (index: number) => {
  if (index >= projects.value.length - 1) return
  
  // Mark as custom order
  isCustomOrder.value = true
  useChronologicalSort.value = false
  
  // Create array of indices, then map to strings
  const indices = [...Array(projects.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorderProjects method
  const newOrder = indices.map(i => projects.value[i].id)
  
  try {
    await projectStore.reorderProjects(newOrder)
  } catch (error) {
    console.error('Error reordering projects:', error)
    showToast('Erreur lors de la réorganisation des projets', 'error')
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