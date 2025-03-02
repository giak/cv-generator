<script setup lang="ts">
import type { WorkWithId } from '@ui/modules/cv/presentation/stores/work'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'
import { computed, onMounted, ref, watch } from 'vue'
import Card from '@ui/components/shared/Card.vue'
import Button from '@ui/components/shared/Button.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
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
const openEditDialog = (work: WorkWithId, index: number) => {
  editingWork.value = { ...work }
  editingWorkIndex.value = index
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
const deleteWork = async (index: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience professionnelle ?')) {
    try {
      await workStore.deleteWork(index)
    } catch (error) {
      console.error('Error deleting work experience:', error)
    }
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
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold">Expériences Professionnelles</h2>
      <Button
        variant="primary"
        size="md"
        :disabled="loading"
        @click="openAddDialog"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </template>
        Ajouter une expérience
      </Button>
    </div>
    
    <!-- Empty state when no work experiences are available -->
    <EmptyState
      v-if="!loading && (!works || works.length === 0)"
      title="Aucune expérience professionnelle"
      description="Ajoutez vos expériences professionnelles pour compléter votre CV."
      actionLabel="Ajouter une expérience"
      @action="openAddDialog"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </template>
    </EmptyState>
    
    <!-- Loading state -->
    <div v-else-if="loading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- Work experiences list -->
    <div v-else class="space-y-4">
      <Card
        v-for="(work, index) in works"
        :key="work.id || index"
        class="work-item transition-all duration-200"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
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
          
          <div class="flex md:flex-col gap-2 mt-3 md:mt-0">
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
            
            <!-- Edit/Delete buttons -->
            <button
              type="button"
              @click="openEditDialog(work, index)"
              class="p-1 rounded text-neutral-400 hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            
            <button
              type="button"
              @click="deleteWork(index)"
              class="p-1 rounded text-neutral-400 hover:bg-error-500/20 hover:text-error-400 transition-colors"
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
    </div>
    
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