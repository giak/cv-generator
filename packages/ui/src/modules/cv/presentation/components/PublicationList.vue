<template>
  <div>
    <CollectionManager
      :items="publications"
      :title="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LIST.EMPTY_STATE_DESCRIPTION)"
      :loading="loading.loading"
      @add="openAddDialog"
      @edit="(item) => openEditDialog(item)"
      @delete="confirmDelete"
      @reorder="handleReorder"
    >
      <template #emptyIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      </template>
      
      <template #item="{ item: publication }">
        <div class="flex-grow">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h3 class="font-semibold text-lg">{{ publication.name }}</h3>
              <div class="text-primary-400 mb-1">{{ publication.publisher }}</div>
              <div class="text-sm text-neutral-400 mb-2">{{ formatDate(publication.releaseDate) }}</div>
            </div>
          </div>
          
          <p v-if="publication.summary" class="text-neutral-300 mb-2">{{ publication.summary }}</p>
          
          <a 
            v-if="publication.url" 
            :href="publication.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-indigo-400 hover:text-indigo-300 text-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {{ safeTranslate('resume.publications.list.viewPublication', 'Voir la publication') }}
          </a>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Dialog for adding/editing publications -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <PublicationForm
            v-model="editingPublication"
            :loading="loading.updating || loading.creating"
            :is-new="dialogMode === 'add'"
            @validate="savePublication"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
    
    <!-- Confirmation dialog for deleting publications -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-white mb-2">{{ safeTranslate('resume.publications.form.confirmDelete', 'Supprimer cette publication ?') }}</h3>
          <p class="text-neutral-400 mb-6">
            {{ safeTranslate('resume.publications.form.deleteWarning', 'Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.') }}
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
            </button>
            <button 
              @click="deleteConfirmed"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              :disabled="loading.deleting"
            >
              {{ loading.deleting ? safeTranslate('resume.publications.form.deleting', 'Suppression...') : t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePublicationStore } from '@ui/modules/cv/presentation/stores/publication'
import type { ValidatedPublication } from '@ui/modules/cv/presentation/stores/publication'
import type { PublicationInterface } from '@cv-generator/shared/src/types/resume.interface'
import PublicationForm from './PublicationForm.vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
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

// Store instance
const publicationStore = usePublicationStore()

// Set up useCollectionField for managing publications
const { 
  items: publications} = useCollectionField<ValidatedPublication>({
  fieldName: 'publications',
  collection: computed(() => publicationStore.publications || []),
  updateField: () => {}, // Using the store directly
  defaultItemValues: {
    id: '',
    name: '',
    publisher: '',
    releaseDate: '',
    url: '',
    summary: '',
    toJSON: function() { return this; }
  },
  identifierField: 'id'
})

const { loading } = publicationStore

// Dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingPublication = ref<PublicationInterface>({
  name: '',
  publisher: '',
  releaseDate: '',
  url: '',
  summary: ''
})

// Delete confirmation state
const showDeleteConfirm = ref(false)
const publicationToDelete = ref<ValidatedPublication | null>(null)

// Load publications on component mount
onMounted(async () => {
  await publicationStore.loadPublications()
})

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch (e) {

    return dateString
  }
}

// Dialog management
const openAddDialog = () => {
  editingPublication.value = {
    name: '',
    publisher: '',
    releaseDate: '',
    url: '',
    summary: ''
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

const openEditDialog = (publication: ValidatedPublication) => {
  editingPublication.value = {
    name: publication.name,
    publisher: publication.publisher,
    releaseDate: publication.releaseDate,
    url: publication.url || '',
    summary: publication.summary || ''
  }
  dialogMode.value = 'edit'
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

// Save publication (add or update)
const savePublication = async () => {
  try {
    if (dialogMode.value === 'add') {
      await publicationStore.addPublication(editingPublication.value)
    } else {
      const publicationIndex = publications.value.findIndex(
        p => p.name === editingPublication.value.name &&
        p.publisher === editingPublication.value.publisher
      )
      
      if (publicationIndex !== -1) {
        const publicationId = publications.value[publicationIndex].id
        await publicationStore.updatePublication(
          publicationId,
          editingPublication.value
        )
      }
    }
    
    closeDialog()
  } catch (error) {}
}

// Delete publication
const confirmDelete = (publication: ValidatedPublication) => {
  publicationToDelete.value = publication
  showDeleteConfirm.value = true
}

const deleteConfirmed = async () => {
  if (!publicationToDelete.value) return
  
  try {
    await publicationStore.deletePublication(publicationToDelete.value.id)
    showDeleteConfirm.value = false
    publicationToDelete.value = null
  } catch (error) {}
}

// Function to handle reordering
const handleReorder = async (newOrder: string[]) => {
  try {
    await publicationStore.reorderPublications(newOrder)
  } catch (error) {}
}
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
