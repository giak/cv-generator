<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">{{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.TITLE) }}</h2>
        <p class="text-neutral-400 text-sm">
          {{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.DESCRIPTION) }}
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
        {{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.ADD_BUTTON) }}
      </Button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-neutral-400">{{ safeTranslate('resume.references.list.loading', 'Chargement des références...') }}</span>
    </div>

    <!-- État vide -->
    <EmptyState 
      v-else-if="isEmpty"
      :title="t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.EMPTY_STATE_TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.EMPTY_STATE_DESCRIPTION)"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
        {{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.ADD_BUTTON) }}
      </Button>
    </EmptyState>

    <!-- Liste des références -->
    <TransitionGroup v-else name="list" tag="div" class="space-y-4">
      <Card
        v-for="ref in references"
        :key="ref.id"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
            <h3 class="font-semibold text-lg mb-2">{{ ref.name }}</h3>
            <p class="text-neutral-300">{{ ref.reference }}</p>
          </div>
          
          <div class="flex space-x-3 mt-4 md:mt-0">
            <button
              class="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-full transition-colors"
              @click="openEditForm(ref)"
              :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button
              class="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full transition-colors"
              @click="openDeleteConfirm(ref)"
              :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE)"
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
    
    <!-- Modal pour ajouter/modifier une référence -->
    <div v-if="showForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-neutral-700">
          <h3 class="text-lg font-medium">
            {{ isEditing ? t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.REFERENCES.FORM.ADD_TITLE) }}
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
          <ReferenceForm
            :reference="currentReference"
            :reference-id="currentReferenceId"
            :is-loading="isFormSubmitting"
            @submit="saveReference"
            @cancel="closeForm"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">{{ safeTranslate('resume.references.list.confirmDelete', 'Supprimer cette référence') }}</h3>
          <p class="mb-6 text-neutral-300">
            {{ safeTranslate('resume.references.list.deleteWarning', 'Êtes-vous sûr de vouloir supprimer cette référence ? Cette action est irréversible.') }}
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="closeDeleteConfirm"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
            </Button>
            <Button 
              variant="danger"
              :loading="isDeletingReference"
              @click="confirmDelete"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE) }}
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
import { useReferenceStore } from '../stores/reference';
import ReferenceForm from './ReferenceForm.vue';
import Button from '@ui/components/shared/Button.vue';
import Card from '@ui/components/shared/Card.vue';
import EmptyState from '@ui/components/shared/EmptyState.vue';
import type { ReferenceInterface } from '@cv-generator/shared/src/types/resume.interface';
import type { ReferenceWithId } from '../stores/reference';
import { useI18n } from 'vue-i18n';
import { TRANSLATION_KEYS } from '@cv-generator/shared';

// Initialisation de i18n
const { t } = useI18n();

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key);
    return translation !== key ? translation : fallback;
  } catch (e) {
    return fallback;
  }
};

// Store des références
const referenceStore = useReferenceStore();

// État des références
const references = computed(() => referenceStore.references);
const isLoading = computed(() => referenceStore.isLoading);
const isEmpty = computed(() => referenceStore.isEmpty);

// État du formulaire
const showForm = ref(false);
const isEditing = ref(false);
const isFormSubmitting = ref(false);
const currentReference = ref<ReferenceInterface>({
  name: '',
  reference: ''
});
const currentReferenceId = ref<string | null>(null);

// État de la confirmation de suppression
const showDeleteConfirm = ref(false);
const isDeletingReference = ref(false);
const referenceToDelete = ref<ReferenceWithId | null>(null);

// Toast notifications
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
});

// Chargement des références
onMounted(async () => {
  if (references.value.length === 0) {
    await referenceStore.loadReferences();
  }
});

// Ouvrir le formulaire d'ajout
const openAddForm = () => {
  isEditing.value = false;
  currentReference.value = {
    name: '',
    reference: ''
  };
  currentReferenceId.value = null;
  showForm.value = true;
};

// Ouvrir le formulaire d'édition
const openEditForm = (reference: ReferenceWithId) => {
  isEditing.value = true;
  currentReference.value = { ...reference };
  currentReferenceId.value = reference.id;
  showForm.value = true;
};

// Fermer le formulaire
const closeForm = () => {
  showForm.value = false;
  setTimeout(() => {
    currentReferenceId.value = null;
  }, 300);
};

// Enregistrer une référence (ajout ou modification)
const saveReference = async (reference: ReferenceInterface) => {
  isFormSubmitting.value = true;
  
  try {
    if (isEditing.value && currentReferenceId.value) {
      await referenceStore.updateReference(currentReferenceId.value, reference);
      showToast(safeTranslate('resume.references.notifications.updateSuccess', 'Référence mise à jour avec succès'), 'success');
    } else {
      await referenceStore.addReference(reference);
      showToast(safeTranslate('resume.references.notifications.addSuccess', 'Référence ajoutée avec succès'), 'success');
    }
    
    closeForm();
  } catch (error) {

    showToast(safeTranslate('resume.references.notifications.saveError', 'Erreur lors de la sauvegarde de la référence'), 'error');
  } finally {
    isFormSubmitting.value = false;
  }
};

// Ouvrir la confirmation de suppression
const openDeleteConfirm = (reference: ReferenceWithId) => {
  referenceToDelete.value = reference;
  showDeleteConfirm.value = true;
};

// Fermer la confirmation de suppression
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  setTimeout(() => {
    referenceToDelete.value = null;
  }, 300);
};

// Confirmer la suppression
const confirmDelete = async () => {
  if (!referenceToDelete.value) return;
  
  isDeletingReference.value = true;
  
  try {
    await referenceStore.deleteReference(referenceToDelete.value.id);
    showToast(safeTranslate('resume.references.notifications.deleteSuccess', 'Référence supprimée avec succès'), 'success');
    closeDeleteConfirm();
  } catch (error) {

    showToast(safeTranslate('resume.references.notifications.deleteError', 'Erreur lors de la suppression de la référence'), 'error');
  } finally {
    isDeletingReference.value = false;
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
