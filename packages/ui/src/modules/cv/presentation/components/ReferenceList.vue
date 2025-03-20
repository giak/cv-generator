<template>
  <div class="bg-neutral-900 rounded-xl">
    <!-- Section title & description -->
    <div class="mb-6 px-6 pt-6">
      <h2 class="text-xl font-semibold text-white">{{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.TITLE) }}</h2>
      <p class="text-sm text-neutral-400 mt-1">
        {{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.DESCRIPTION) }}
      </p>
    </div>

    <CollectionManager
      :items="references"
      empty-text="t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.EMPTY_STATE_TITLE)"
      add-button-text="t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.ADD_BUTTON)"
      :loading="isLoading"
      @add="openAddReference"
      @edit="(item) => openEditReference(item)"
      @delete="confirmDelete"
      @reorder="handleReorder"
    >
      <!-- Empty state -->
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4">
            <path d="M48 20C30.3269 20 16 34.3269 16 52C16 69.6731 30.3269 84 48 84C65.6731 84 80 69.6731 80 52C80 34.3269 65.6731 20 48 20Z" stroke="#4338CA" stroke-width="4"/>
            <path d="M48 64C55.732 64 62 57.732 62 50C62 42.268 55.732 36 48 36C40.268 36 34 42.268 34 50C34 57.732 40.268 64 48 64Z" stroke="#4338CA" stroke-width="4"/>
            <path d="M32 78.6937C34.5392 74.3137 38.2744 70.737 42.7504 68.4236C47.2264 66.1103 52.2441 65.1692 57.2208 65.7137C62.1976 66.2582 66.9065 68.2601 70.7379 71.4765C74.5694 74.6929 77.3485 78.9665 78.7064 83.7328" stroke="#4338CA" stroke-width="4"/>
            <path d="M16 49.3125C16.5455 42.0739 19.9758 35.3566 25.5533 30.6523C31.1308 25.948 38.4105 23.6553 45.6592 24.2008C52.9078 24.7464 59.6252 28.1766 64.3294 33.7541C69.0337 39.3316 71.3264 46.6114 70.7808 53.86" stroke="#4338CA" stroke-width="4"/>
          </svg>
          <h3 class="text-lg font-medium text-neutral-200 mb-1">{{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.EMPTY_STATE_TITLE) }}</h3>
          <p class="text-sm text-neutral-400 max-w-md">
            {{ t(TRANSLATION_KEYS.RESUME.REFERENCES.LIST.EMPTY_STATE_DESCRIPTION) }}
          </p>
        </div>
      </template>
      
      <template #item="{ item: ref }">
        <div class="flex-grow">
          <h3 class="font-semibold text-lg mb-2">{{ ref.name }}</h3>
          <p class="text-neutral-300">{{ ref.reference }}</p>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Modal pour ajouter/modifier une référence -->
    <div v-if="showForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
import type { ReferenceInterface } from '@cv-generator/shared/src/types/resume.interface';
import type { ReferenceWithId } from '../stores/reference';
import { useI18n } from 'vue-i18n';
import { TRANSLATION_KEYS } from '@cv-generator/shared';
import CollectionManager from '@ui/components/shared/CollectionManager.vue';

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

// Function to handle reordering from CollectionManager
const handleReorder = async (newOrder: string[]) => {
  try {
    await referenceStore.reorderReferences(newOrder)
  } catch (error) {
    console.error('Error reordering references:', error)
  }
}

// Ouvrir le formulaire d'ajout
const openAddReference = () => {
  isEditing.value = false;
  currentReference.value = {
    name: '',
    reference: ''
  };
  currentReferenceId.value = null;
  showForm.value = true;
};

// Ouvrir le formulaire d'édition
const openEditReference = (reference: ReferenceWithId) => {
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
const confirmDelete = (reference: ReferenceWithId) => {
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
