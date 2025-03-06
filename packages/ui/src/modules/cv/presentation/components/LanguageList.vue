<template>
  <div class="space-y-6">
    <CollectionManager
      :items="languages"
      title="Langues"
      description="Gérez les langues maîtrisées pour votre CV"
      addButtonText="Ajouter une langue"
      emptyStateTitle="Aucune langue"
      emptyStateDescription="Commencez par ajouter une langue pour enrichir votre CV."
      :loading="isLoading"
      @add="openAddModal"
      @edit="editLanguage"
      @delete="confirmDelete"
    >
      <template #emptyIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M2 12h20M12 2v20M4.5 9.5h3M16.5 9.5h3M5.5 14.5h4M14.5 14.5h4"></path>
        </svg>
      </template>
      
      <template #item="{ item: language }">
        <div class="flex-grow">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 class="font-semibold text-lg">{{ language.language }}</h3>
            <span class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
              {{ language.fluency }}
            </span>
          </div>
        </div>
      </template>
      
      <template #itemActions="{ item: language, index }">
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
              :disabled="index === languages.length - 1"
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
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../stores/language'
import LanguageForm from './LanguageForm.vue'
import Button from '@ui/components/shared/Button.vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'

// Définition du type pour les langues
interface LanguageWithId {
  id: string
  language: string
  fluency: string
}

// Store
const languageStore = useLanguageStore()

// Setup de useCollectionField pour gérer les langues
const { 
  items: languages,
  reorderItems
} = useCollectionField<LanguageWithId>({
  fieldName: 'languages',
  collection: computed(() => languageStore.languages || []),
  updateField: () => {}, // On utilise directement le store
  defaultItemValues: {
    id: '',
    language: '',
    fluency: ''
  },
  identifierField: 'id'
})

// State
const isLoading = computed(() => languageStore.loading)
const isDeleting = ref(false)

// Modal state
const showModal = ref(false)
const isEditing = ref(false)
const currentLanguageId = ref<string | null>(null)

// Delete confirmation state
const showDeleteModal = ref(false)
const languageToDelete = ref<LanguageWithId | null>(null)

// Toast notifications
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
  timeout: null as number | null
})

// Load languages on component mount
onMounted(async () => {
  await languageStore.loadLanguages()
})

// Open modal to add new language
const openAddModal = () => {
  currentLanguageId.value = null
  isEditing.value = false
  showModal.value = true
}

// Open modal to edit existing language
const editLanguage = (language: LanguageWithId) => {
  currentLanguageId.value = language.id
  isEditing.value = true
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    currentLanguageId.value = null
  }, 300)
}

// Handle language saved event
const onLanguageSaved = () => {
  showToast(isEditing.value ? 'Langue mise à jour avec succès' : 'Langue ajoutée avec succès', 'success')
  closeModal()
}

// Open delete confirmation modal
const confirmDelete = (language: LanguageWithId) => {
  languageToDelete.value = language
  showDeleteModal.value = true
}

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
  setTimeout(() => {
    languageToDelete.value = null
  }, 300)
}

// Delete language
const deleteLanguage = async () => {
  if (!languageToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await languageStore.deleteLanguage(languageToDelete.value.id)
    showToast('Langue supprimée avec succès', 'success')
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting language:', error)
    showToast('Erreur lors de la suppression de la langue', 'error')
  } finally {
    isDeleting.value = false
  }
}

// Reorder languages up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(languages.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => languages.value[i].id)
  
  try {
    await languageStore.reorderLanguages(newOrder)
  } catch (error) {
    console.error('Error reordering languages:', error)
    showToast('Erreur lors de la réorganisation des langues', 'error')
  }
}

// Reorder languages down
const moveDown = async (index: number) => {
  if (index >= languages.value.length - 1) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(languages.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => languages.value[i].id)
  
  try {
    await languageStore.reorderLanguages(newOrder)
  } catch (error) {
    console.error('Error reordering languages:', error)
    showToast('Erreur lors de la réorganisation des langues', 'error')
  }
}

// Show toast notification
const showToast = (message: string, type: 'success' | 'error') => {
  // Clear any existing timeout
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
  }
  
  // Show new toast
  toast.value = {
    visible: true,
    message,
    type,
    timeout: setTimeout(() => {
      toast.value.visible = false
    }, 3000) as unknown as number
  }
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
  transform: translateY(30px);
}
</style>