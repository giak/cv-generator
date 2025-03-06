<template>
  <div>
    <CollectionManager
      :items="publications"
      title="Publications"
      description="Gérez vos publications pour enrichir votre CV"
      addButtonText="Ajouter une publication"
      emptyStateTitle="Aucune publication"
      emptyStateDescription="Vous n'avez pas encore ajouté de publications à votre CV."
      :loading="loading.loading"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="confirmDelete"
    >
      <template #emptyIcon>
        <svg class="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </template>
      
      <template #item="{ item: publication }">
        <div>
          <h3 class="font-medium text-white">{{ publication.name }}</h3>
          <p class="text-sm text-neutral-400 mt-1">
            <span>{{ publication.publisher }}</span>
            <span class="mx-2">•</span>
            <span>{{ formatDate(publication.releaseDate) }}</span>
          </p>
          <p v-if="publication.summary" class="mt-2 text-sm text-neutral-300">
            {{ publication.summary }}
          </p>
          <a 
            v-if="publication.url" 
            :href="publication.url" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex items-center mt-2 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Voir la publication
          </a>
        </div>
      </template>
      
      <template #itemActions="{ item: publication, index }">
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
              :disabled="index === publications.length - 1"
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
          <h3 class="text-lg font-medium text-white mb-2">Supprimer cette publication ?</h3>
          <p class="text-neutral-400 mb-6">
            Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
            >
              Annuler
            </button>
            <button 
              @click="deleteConfirmed"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              :disabled="loading.deleting"
            >
              {{ loading.deleting ? 'Suppression...' : 'Supprimer' }}
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

// Store instance
const publicationStore = usePublicationStore()

// Set up useCollectionField for managing publications
const { 
  items: publications,
  reorderItems
} = useCollectionField<ValidatedPublication>({
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
    console.error('Error formatting date:', e)
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
  } catch (error) {
    console.error('Error saving publication:', error)
  }
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
  } catch (error) {
    console.error('Error deleting publication:', error)
  }
}

// Reorder publications up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  try {
    // Get the IDs for reordering
    const newOrder = [...publications.value.map(item => item.id)]
    // Swap positions
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp
    
    await publicationStore.reorderPublications(newOrder)
  } catch (error) {
    console.error('Error reordering publications:', error)
  }
}

// Reorder publications down
const moveDown = async (index: number) => {
  if (index >= publications.value.length - 1) return
  
  try {
    // Get the IDs for reordering
    const newOrder = [...publications.value.map(item => item.id)]
    // Swap positions
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp
    
    await publicationStore.reorderPublications(newOrder)
  } catch (error) {
    console.error('Error reordering publications:', error)
  }
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