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
      @reorder="handleReorder"
    >
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4">
            <path d="M48 16C29.2 16 14 31.2 14 50C14 68.8 29.2 84 48 84C66.8 84 82 68.8 82 50C82 31.2 66.8 16 48 16ZM48 20C64.6 20 78 33.4 78 50C78 66.6 64.6 80 48 80C31.4 80 18 66.6 18 50C18 33.4 31.4 20 48 20Z" fill="#4338CA"/>
            <path d="M48 36C43.6 36 40 39.6 40 44C40 48.4 43.6 52 48 52C52.4 52 56 48.4 56 44C56 39.6 52.4 36 48 36ZM48 40C50.2 40 52 41.8 52 44C52 46.2 50.2 48 48 48C45.8 48 44 46.2 44 44C44 41.8 45.8 40 48 40Z" fill="#4338CA"/>
            <path d="M48 56C40.2 56 34 62.2 34 70H38C38 64.4 42.4 60 48 60C53.6 60 58 64.4 58 70H62C62 62.2 55.8 56 48 56Z" fill="#4338CA"/>
            <path d="M35 28.5C35 29.4 34.4 30 33.5 30C32.6 30 32 29.4 32 28.5C32 27.6 32.6 27 33.5 27C34.4 27 35 27.6 35 28.5Z" fill="#4338CA"/>
            <path d="M40 28.5C40 29.4 39.4 30 38.5 30C37.6 30 37 29.4 37 28.5C37 27.6 37.6 27 38.5 27C39.4 27 40 27.6 40 28.5Z" fill="#4338CA"/>
            <path d="M30 28.5C30 29.4 29.4 30 28.5 30C27.6 30 27 29.4 27 28.5C27 27.6 27.6 27 28.5 27C29.4 27 30 27.6 30 28.5Z" fill="#4338CA"/>
            <path d="M65 28.5C65 29.4 64.4 30 63.5 30C62.6 30 62 29.4 62 28.5C62 27.6 62.6 27 63.5 27C64.4 27 65 27.6 65 28.5Z" fill="#4338CA"/>
            <path d="M70 28.5C70 29.4 69.4 30 68.5 30C67.6 30 67 29.4 67 28.5C67 27.6 67.6 27 68.5 27C69.4 27 70 27.6 70 28.5Z" fill="#4338CA"/>
            <path d="M60 28.5C60 29.4 59.4 30 58.5 30C57.6 30 57 29.4 57 28.5C57 27.6 57.6 27 58.5 27C59.4 27 60 27.6 60 28.5Z" fill="#4338CA"/>
          </svg>
          <h3 class="text-lg font-medium text-neutral-200 mb-1">{{ safeTranslate(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.EMPTY_STATE_TITLE, 'Aucun centre d\'intérêt ajouté') }}</h3>
          <p class="text-sm text-neutral-400 max-w-md">
            {{ safeTranslate(TRANSLATION_KEYS.RESUME.INTERESTS.LIST.EMPTY_STATE_DESCRIPTION, 'Ajoutez vos centres d\'intérêt pour personnaliser votre CV et montrer votre personnalité.') }}
          </p>
        </div>
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

    showToast(safeTranslate('resume.interests.notifications.deleteError', 'Erreur lors de la suppression de l\'intérêt'), 'error')
  } finally {
    isDeleting.value = false
    closeDeleteModal()
  }
}

// Function to handle reordering from CollectionManager
const handleReorder = async (newOrder: string[]) => {
  try {
    await interestStore.reorderInterests(newOrder)
  } catch (error) {
    console.error('Error reordering interests:', error)
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
