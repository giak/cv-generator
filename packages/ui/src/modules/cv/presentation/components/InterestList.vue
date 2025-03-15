<template>
  <div class="space-y-6">
    <CollectionManager
      :items="interests"
      :title="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.EMPTY_STATE_DESCRIPTION)"
      :loading="isLoading"
      @add="openAddModal"
      @edit="editInterest"
      @delete="confirmDelete"
    >
      <template #emptyIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </template>
      
      <template #item="{ item: interest }">
        <div class="flex-grow">
          <div class="flex flex-col mb-2">
            <h3 class="font-semibold text-lg mb-1">{{ interest.name }}</h3>
            <div v-if="interest.keywords && interest.keywords.length > 0" class="flex flex-wrap gap-2">
              <span 
                v-for="(keyword, index) in interest.keywords" 
                :key="index"
                class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium"
              >
                {{ keyword }}
              </span>
            </div>
            <p v-else class="text-neutral-400 text-sm italic">
              {{ t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.NO_KEYWORDS) }}
            </p>
          </div>
        </div>
      </template>
      
      <template #itemActions="{ index }">
        <div class="flex flex-col gap-2">
          <!-- Reorder buttons -->
          <div class="flex gap-1">
            <button
              type="button"
              @click="moveUp(index)"
              :disabled="index === 0"
              class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              :title="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.MOVE_UP)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            
            <button
              type="button"
              @click="moveDown(index)"
              :disabled="index === interests.length - 1"
              class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              :title="t(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.MOVE_DOWN)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Modal pour ajouter/modifier un intérêt -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-neutral-700">
          <h3 class="text-lg font-medium">
            {{ isEditing ? t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.ADD_TITLE) }}
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
          <InterestForm
            :interest-id="currentInterestId"
            @saved="onInterestSaved"
            @cancelled="closeModal"
          />
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">{{ safeTranslate('resume.interests.list.confirmDelete', 'Supprimer cet intérêt') }}</h3>
          <p class="mb-6 text-neutral-300">
            {{ safeTranslate('resume.interests.list.deleteWarning', 'Êtes-vous sûr de vouloir supprimer cet intérêt ? Cette action est irréversible.') }}
          </p>
          
          <div class="flex justify-end space-x-4">
            <Button 
              variant="ghost"
              @click="closeDeleteModal"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
            </Button>
            <Button 
              variant="danger"
              :loading="isDeleting"
              @click="deleteInterest"
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
import { ref, computed, onMounted } from 'vue'
import { useInterestStore } from '../stores/interest'
import InterestForm from './InterestForm.vue'
import Button from '@ui/components/shared/Button.vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
import type { ValidatedInterest } from '../stores/interest'
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

// Store
const interestStore = useInterestStore()

// Setup de useCollectionField pour gérer les intérêts
const { 
  items: interests} = useCollectionField<ValidatedInterest>({
  fieldName: 'interests',
  collection: computed(() => interestStore.interests || []),
  updateField: () => {}, // On utilise directement le store
  defaultItemValues: {
    name: '',
    id: '',
    keywords: [],
    toJSON: () => ({ id: '', name: '', keywords: [] })
  },
  identifierField: 'id'
})

// State
const isLoading = computed(() => interestStore.loading.interests)
const isDeleting = ref(false)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const currentInterestId = ref<string | null>(null)

// Delete confirmation state
const showDeleteModal = ref(false)
const interestToDelete = ref<ValidatedInterest | null>(null)

// Toast notifications
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
})

// Load interests on component mount
onMounted(async () => {
  await interestStore.loadInterests()
})

// Open modal to add new interest
const openAddModal = () => {
  currentInterestId.value = null
  isEditing.value = false
  showModal.value = true
}

// Open modal to edit existing interest
const editInterest = (interest: ValidatedInterest) => {
  currentInterestId.value = interest.id
  isEditing.value = true
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    currentInterestId.value = null
  }, 300)
}

// Handle interest saved event
const onInterestSaved = () => {
  showToast(
    isEditing.value 
      ? safeTranslate('resume.interests.notifications.updateSuccess', 'Intérêt mis à jour avec succès') 
      : safeTranslate('resume.interests.notifications.addSuccess', 'Intérêt ajouté avec succès'), 
    'success'
  )
  closeModal()
}

// Open delete confirmation modal
const confirmDelete = (interest: ValidatedInterest) => {
  interestToDelete.value = interest
  showDeleteModal.value = true
}

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
  setTimeout(() => {
    interestToDelete.value = null
  }, 300)
}

// Delete interest
const deleteInterest = async () => {
  if (!interestToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await interestStore.deleteInterest(interestToDelete.value.id)
    showToast(safeTranslate('resume.interests.notifications.deleteSuccess', 'Intérêt supprimé avec succès'), 'success')
  } catch (error) {
    console.error('Error deleting interest:', error)
    showToast(safeTranslate('resume.interests.notifications.deleteError', 'Erreur lors de la suppression de l\'intérêt'), 'error')
  } finally {
    isDeleting.value = false
    closeDeleteModal()
  }
}

// Reorder interests up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(interests.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => interests.value[i].id)
  
  try {
    await interestStore.reorderInterests(newOrder)
  } catch (error) {
    console.error('Error reordering interests:', error)
    showToast(safeTranslate('resume.interests.notifications.reorderError', 'Erreur lors de la réorganisation des intérêts'), 'error')
  }
}

// Reorder interests down
const moveDown = async (index: number) => {
  if (index >= interests.value.length - 1) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(interests.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => interests.value[i].id)
  
  try {
    await interestStore.reorderInterests(newOrder)
  } catch (error) {
    console.error('Error reordering interests:', error)
    showToast(safeTranslate('resume.interests.notifications.reorderError', 'Erreur lors de la réorganisation des intérêts'), 'error')
  }
}

// Show toast notification
const showToast = (message: string, type: 'success' | 'error') => {
  // Clear any existing timeout
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
    toast.value.timeout = null
  }
  
  // Update toast
  toast.value.message = message
  toast.value.type = type
  toast.value.visible = true
  
  // Hide after 3 seconds
  toast.value.timeout = window.setTimeout(() => {
    toast.value.visible = false
  }, 3000)
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