<script setup lang="ts">
import type { WorkWithId } from '@ui/modules/cv/presentation/stores/work'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'
import { computed, onMounted, ref, watch } from 'vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import WorkForm from './WorkForm.vue'

// State for managing the work list
const workStore = useWorkStore()
const works = computed(() => workStore.works || [])
const loading = computed(() => workStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingWorkIndex = ref<number | null>(null)
const editingWork = ref<WorkInterface>({
  name: '',
  position: '',
  startDate: '',
  highlights: []
})

// Load works on component mount
onMounted(async () => {
  await workStore.loadWorks()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Présent'
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('fr-FR', options)
}

// Open dialog for adding a new work experience
const openAddDialog = () => {
  editingWork.value = {
    name: '',
    position: '',
    startDate: '',
    highlights: []
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing work experience
const openEditDialog = (work: WorkWithId) => {
  editingWork.value = { ...work }
  editingWorkIndex.value = works.value.findIndex(w => w.id === work.id)
  dialogMode.value = 'edit'
  showDialog.value = true
}

// Close dialog
const closeDialog = () => {
  console.log('Closing dialog')
  showDialog.value = false
  editingWorkIndex.value = null
}

// Save work experience (add or update)
const saveWork = async () => {
  try {
    console.log('Saving work experience:', editingWork.value)
    
    if (dialogMode.value === 'add') {
      await workStore.addWork(editingWork.value)
    } else if (dialogMode.value === 'edit' && editingWorkIndex.value !== null) {
      await workStore.updateWork(editingWorkIndex.value, editingWork.value)
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error saving work experience:', error)
  }
}

// Delete work experience
const deleteWork = async (work: WorkWithId) => {
  try {
    const index = works.value.findIndex(w => w.id === work.id)
    if (index !== -1) {
      await workStore.deleteWork(index)
    }
  } catch (error) {
    console.error('Error deleting work experience:', error)
  }
}

// Reorder work experiences
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  const newOrder = [...Array(works.value.length).keys()]
  const temp = newOrder[index]
  newOrder[index] = newOrder[index - 1]
  newOrder[index - 1] = temp
  
  try {
    await workStore.reorderWorks(newOrder)
  } catch (error) {
    console.error('Error reordering work experiences:', error)
  }
}

const moveDown = async (index: number) => {
  if (index >= works.value.length - 1) return
  
  const newOrder = [...Array(works.value.length).keys()]
  const temp = newOrder[index]
  newOrder[index] = newOrder[index + 1]
  newOrder[index + 1] = temp
  
  try {
    await workStore.reorderWorks(newOrder)
  } catch (error) {
    console.error('Error reordering work experiences:', error)
  }
}
</script>

<template>
  <div class="work-list">
    <CollectionManager
      :items="works"
      title="Expériences Professionnelles"
      description="Ajoutez vos expériences professionnelles pour compléter votre CV."
      addButtonText="Ajouter une expérience"
      emptyStateTitle="Aucune expérience professionnelle"
      emptyStateDescription="Ajoutez vos expériences professionnelles pour compléter votre CV."
      emptyStateButtonText="Ajouter une expérience"
      :loading="loading"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="deleteWork"
    >
      <template #item="{ item: work }">
        <div class="flex flex-col">
          <h3 class="text-lg font-medium text-white">{{ work.position }}</h3>
          <div class="text-primary-400 font-medium mb-1">{{ work.name }}</div>
          <div class="text-sm text-neutral-400 mb-2">
            {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) }}
          </div>
          
          <div v-if="work.summary" class="text-sm text-neutral-300 mb-3">
            {{ work.summary }}
          </div>
          
          <ul v-if="work.highlights && work.highlights.length > 0" class="list-disc pl-5 space-y-1 mb-3">
            <li 
              v-for="(highlight, hIndex) in work.highlights" 
              :key="hIndex"
              class="text-xs text-neutral-300"
            >
              {{ highlight }}
            </li>
          </ul>
          
          <a 
            v-if="work.url" 
            :href="work.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {{ work.url }}
          </a>
        </div>
      </template>
      
      <template #itemActions="{ item: work, index }">
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
              :disabled="index === works.length - 1"
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
    
    <!-- Dialog for adding/editing work experience -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <WorkForm
            v-model="editingWork"
            :loading="loading"
            :is-new="dialogMode === 'add'"
            @validate="saveWork"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
  </div>
</template> 