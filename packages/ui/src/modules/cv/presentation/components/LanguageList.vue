<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">Langues</h2>
        <p class="text-neutral-400 text-sm">
          Gérez les langues maîtrisées pour votre CV
        </p>
      </div>
      
      <Button
        @click="openAddModal"
        variant="primary"
        size="md"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter une langue
      </Button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-neutral-400">Chargement des langues...</span>
    </div>

    <!-- État vide -->
    <EmptyState 
      v-else-if="!languages || languages.length === 0"
      title="Aucune langue"
      description="Commencez par ajouter une langue pour enrichir votre CV."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M2 12h20M12 2v20M4.5 9.5h3M16.5 9.5h3M5.5 14.5h4M14.5 14.5h4"></path>
        </svg>
      </template>
      
      <Button 
        variant="primary"
        size="md"
        @click="openAddModal"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter une langue
      </Button>
    </EmptyState>

    <!-- Liste des langues -->
    <TransitionGroup v-else name="list" tag="div" class="space-y-4">
      <Card
        v-for="language in languages"
        :key="language.id"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 class="font-semibold text-lg">{{ language.language }}</h3>
              <span class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
                {{ language.fluency }}
              </span>
            </div>
          </div>
          
          <div class="flex space-x-3 mt-4 md:mt-0">
            <button
              class="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-full transition-colors"
              @click="editLanguage(language)"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button
              class="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors"
              @click="confirmDelete(language)"
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
    
    <!-- Modal pour ajouter/modifier une langue -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-neutral-700">
          <h3 class="text-lg font-medium">
            {{ isEditing ? 'Modifier la langue' : 'Ajouter une langue' }}
          </h3>
          <button 
            @click="closeModal" 
            class="text-neutral-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <LanguageForm
            :language-id="currentLanguageId"
            @saved="onLanguageSaved"
            @cancelled="closeModal"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">Supprimer cette langue</h3>
          <p class="mb-6 text-neutral-300">
            Êtes-vous sûr de vouloir supprimer cette langue ? Cette action est irréversible.
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="closeDeleteModal"
            >
              Annuler
            </Button>
            <Button 
              variant="danger"
              :loading="isDeleting"
              @click="deleteLanguage"
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
import { ref, computed, onMounted } from 'vue';
import { useLanguageStore } from '../stores/language';
import LanguageForm from './LanguageForm.vue';
import Button from '@ui/components/shared/Button.vue';
import Card from '@ui/components/shared/Card.vue';
import EmptyState from '@ui/components/shared/EmptyState.vue';

// Store
const languageStore = useLanguageStore();

// State
const languages = computed(() => languageStore.languages);
const isLoading = computed(() => languageStore.loading);
const isDeleting = ref(false);

// Modal state
const showModal = ref(false);
const isEditing = ref(false);
const currentLanguageId = ref<string | null>(null);

// Delete confirmation state
const showDeleteModal = ref(false);
const languageToDelete = ref<any | null>(null);

// Toast notifications
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
});

// Load languages on component mount
onMounted(async () => {
  await languageStore.loadLanguages();
});

// Open modal to add new language
const openAddModal = () => {
  currentLanguageId.value = null;
  isEditing.value = false;
  showModal.value = true;
};

// Open modal to edit existing language
const editLanguage = (language: any) => {
  currentLanguageId.value = language.id;
  isEditing.value = true;
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    currentLanguageId.value = null;
  }, 300);
};

// Handle language saved event
const onLanguageSaved = () => {
  showToast(isEditing.value ? 'Langue mise à jour avec succès' : 'Langue ajoutée avec succès', 'success');
  closeModal();
};

// Open delete confirmation modal
const confirmDelete = (language: any) => {
  languageToDelete.value = language;
  showDeleteModal.value = true;
};

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  setTimeout(() => {
    languageToDelete.value = null;
  }, 300);
};

// Delete language
const deleteLanguage = async () => {
  if (!languageToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    await languageStore.deleteLanguage(languageToDelete.value.id);
    showToast('Langue supprimée avec succès', 'success');
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting language:', error);
    showToast('Erreur lors de la suppression de la langue', 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Show toast notification
const showToast = (message: string, type: 'success' | 'error') => {
  // Clear any existing timeout
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout);
  }
  
  // Show new toast
  toast.value = {
    visible: true,
    message,
    type,
    timeout: setTimeout(() => {
      toast.value.visible = false;
    }, 3000) as unknown as number
  };
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
  transform: translateY(30px);
}
</style> 