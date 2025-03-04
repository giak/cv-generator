<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">Projets</h2>
        <p class="text-neutral-400 text-sm">
          Gérez vos projets personnels et professionnels pour votre CV
        </p>
      </div>
      
      <Button
        @click="openAddForm"
        variant="primary"
        size="md"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter un projet
      </Button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-neutral-400">Chargement des projets...</span>
    </div>

    <!-- État vide -->
    <EmptyState 
      v-else-if="isEmpty"
      title="Aucun projet"
      description="Commencez par ajouter un projet pour enrichir votre CV."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      </template>
      
      <Button 
        variant="primary"
        size="md"
        @click="openAddForm"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter un projet
      </Button>
    </EmptyState>

    <!-- Liste des projets -->
    <TransitionGroup v-else name="list" tag="div" class="space-y-4">
      <Card
        v-for="project in projects"
        :key="project.id"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
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
          
          <div class="flex space-x-3 mt-4 md:mt-0">
            <button
              class="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-full transition-colors"
              @click="openEditForm(project)"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button
              class="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors"
              @click="openDeleteConfirm(project)"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </TransitionGroup>
    
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useProjectStore } from '../stores/project';
import ProjectForm from './ProjectForm.vue';
import Button from '@ui/components/shared/Button.vue';
import Card from '@ui/components/shared/Card.vue';
import EmptyState from '@ui/components/shared/EmptyState.vue';
import type { ProjectInterface } from '@cv-generator/shared/src/types/resume.interface';
import type { ProjectWithId } from '../stores/project';

// Store des projets
const projectStore = useProjectStore();

// État des projets
const projects = computed(() => projectStore.projects);
const isLoading = computed(() => projectStore.isLoading);
const isEmpty = computed(() => projects.value.length === 0);

// État du formulaire
const showForm = ref(false);
const isEditing = ref(false);
const isFormSubmitting = ref(false);
const currentProject = ref<ProjectInterface>({
  name: ''
});
const currentProjectId = ref<string | null>(null);

// État de la confirmation de suppression
const showDeleteConfirm = ref(false);
const isDeletingProject = ref(false);
const projectToDelete = ref<ProjectWithId | null>(null);

// Toast notifications
const toast = reactive({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
});

// Formater une date YYYY-MM-DD en format lisible
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Chargement des projets
onMounted(async () => {
  if (!projects.value || projects.value.length === 0) {
    await projectStore.loadProjects();
  }
});

// Ouvrir le formulaire d'ajout
const openAddForm = () => {
  isEditing.value = false;
  currentProject.value = {
    name: ''
  };
  currentProjectId.value = null;
  showForm.value = true;
};

// Ouvrir le formulaire d'édition
const openEditForm = (project: ProjectWithId) => {
  isEditing.value = true;
  currentProject.value = { ...project };
  currentProjectId.value = project.id;
  showForm.value = true;
};

// Fermer le formulaire
const closeForm = () => {
  showForm.value = false;
  setTimeout(() => {
    currentProject.value = { name: '' };
    currentProjectId.value = null;
    isEditing.value = false;
  }, 300);
};

// Sauvegarder un projet
const saveProject = async (project: ProjectInterface) => {
  isFormSubmitting.value = true;
  
  try {
    if (isEditing.value && currentProjectId.value) {
      // Mettre à jour le projet existant
      const result = await projectStore.updateProject(currentProjectId.value, project);
      
      if (result.isValid) {
        showToast('Projet mis à jour avec succès', 'success');
        closeForm();
      } else {
        const errors = result.errors ? Object.values(result.errors).flat().join(', ') : 'Erreur de validation';
        showToast(`Erreur lors de la mise à jour : ${errors}`, 'error');
      }
    } else {
      // Ajouter un nouveau projet
      const result = await projectStore.addProject(project);
      
      if (result.isValid) {
        showToast('Projet ajouté avec succès', 'success');
        closeForm();
      } else {
        const errors = result.errors ? Object.values(result.errors).flat().join(', ') : 'Erreur de validation';
        showToast(`Erreur lors de l'ajout : ${errors}`, 'error');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
    showToast('Une erreur est survenue lors de la sauvegarde', 'error');
  } finally {
    isFormSubmitting.value = false;
  }
};

// Ouvrir la confirmation de suppression
const openDeleteConfirm = (project: ProjectWithId) => {
  projectToDelete.value = project;
  showDeleteConfirm.value = true;
};

// Fermer la confirmation de suppression
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  setTimeout(() => {
    projectToDelete.value = null;
  }, 300);
};

// Confirmer la suppression
const confirmDelete = async () => {
  if (!projectToDelete.value) return;
  
  isDeletingProject.value = true;
  
  try {
    const success = await projectStore.deleteProject(projectToDelete.value.id);
    
    if (success) {
      showToast('Projet supprimé avec succès', 'success');
    } else {
      showToast('Erreur lors de la suppression du projet', 'error');
    }
    
    closeDeleteConfirm();
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    showToast('Une erreur est survenue lors de la suppression', 'error');
  } finally {
    isDeletingProject.value = false;
  }
};

// Afficher une notification toast
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Si un toast est déjà visible, on le ferme
  if (toast.timeout) {
    clearTimeout(toast.timeout);
    toast.visible = false;
  }
  
  // Afficher le nouveau toast
  toast.message = message;
  toast.type = type;
  toast.visible = true;
  
  // Masquer le toast après 5 secondes
  toast.timeout = window.setTimeout(() => {
    toast.visible = false;
    toast.timeout = null;
  }, 5000);
};
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