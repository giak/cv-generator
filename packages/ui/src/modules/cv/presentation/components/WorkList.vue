<script setup lang="ts">
import type { WorkWithId } from '@ui/modules/cv/presentation/stores/work'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'
import { computed, onMounted, ref } from 'vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import WorkForm from './WorkForm.vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Initialize i18n
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

// State for sorting
const useChronologicalSort = ref(true)
const isCustomOrder = ref(false)

// Performance optimization for large lists
const itemsPerPage = ref(8) // Default limit for better performance
const showAllItems = ref(false)

// Chronologically sorted work experiences (most recent first)
const sortedWorks = computed(() => {
  // If using custom order, return the original list
  if (!useChronologicalSort.value || isCustomOrder.value) {
    return works.value;
  }
  
  // Create a copy to avoid modifying the source
  return [...works.value].sort((a, b) => {
    // For work experiences, "current" positions (no endDate or empty endDate) should be at the top
    const isCurrentA = !a.endDate || a.endDate === '';
    const isCurrentB = !b.endDate || b.endDate === '';
    
    // If one is current but not the other, prioritize the current one
    if (isCurrentA && !isCurrentB) return -1;
    if (!isCurrentA && isCurrentB) return 1;
    
    // If both are current or both are not current, compare by endDate (or startDate if no endDate)
    const dateA = isCurrentA ? a.startDate : (a.endDate || a.startDate || '');
    const dateB = isCurrentB ? b.startDate : (b.endDate || b.startDate || '');
    
    // Handle cases with missing dates
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1; // a should come after b
    if (!dateB) return -1; // b should come after a
    
    // Compare dates (newest first)
    try {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    } catch (error) {

      return 0;
    }
  });
});

// Displayed works (either sorted or original based on setting) with pagination
const displayedWorks = computed(() => {
  const worksToDisplay = sortedWorks.value;
  
  // If showing all items or if the list is smaller than the limit, return all
  if (showAllItems.value || worksToDisplay.length <= itemsPerPage.value) {
    return worksToDisplay;
  }
  
  // Otherwise, return limited items for better performance
  return worksToDisplay.slice(0, itemsPerPage.value);
});

// Determine if we have more items to show
const hasMoreItems = computed(() => {
  return sortedWorks.value.length > itemsPerPage.value && !showAllItems.value;
});

// Toggle between showing limited items and all items
const toggleShowAllItems = () => {
  showAllItems.value = !showAllItems.value;
};

// Load works on component mount
onMounted(async () => {
  await workStore.loadWorks()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return t(TRANSLATION_KEYS.RESUME.WORK.LIST.PRESENT, 'Présent')
  
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

  showDialog.value = false
  editingWorkIndex.value = null
}

// Save work experience (add or update)
const saveWork = async () => {
  try {

    if (dialogMode.value === 'add') {
      await workStore.addWork(editingWork.value)
    } else if (dialogMode.value === 'edit' && editingWorkIndex.value !== null) {
      await workStore.updateWork(editingWorkIndex.value, editingWork.value)
    }
    
    closeDialog()
  } catch (error) {}
}

// Delete work experience
const deleteWork = async (work: WorkWithId) => {
  try {
    const index = works.value.findIndex(w => w.id === work.id)
    if (index !== -1) {
      await workStore.deleteWork(index)
    }
  } catch (error) {}
}

// Reorder work experiences
const handleReorder = async (newOrder: string[]) => {
  try {
    // Mark as custom order when user manually reorders
    isCustomOrder.value = true
    useChronologicalSort.value = false
    
    // Convert string IDs to numeric indices for the store
    const numericOrder = newOrder.map(id => {
      const index = works.value.findIndex(work => work.id === id)
      return index !== -1 ? index : 0 // Default to 0 if not found
    })
    
    await workStore.reorderWorks(numericOrder)
  } catch (error) {
    console.error('Error reordering work experiences:', error)
  }
}

// Toggle between chronological and custom order
const toggleSortOrder = () => {
  useChronologicalSort.value = !useChronologicalSort.value
  
  // If switching to chronological and we have a custom order,
  // reset the custom order flag
  if (useChronologicalSort.value && isCustomOrder.value) {
    isCustomOrder.value = false
  }
  
  // Reset pagination when toggling sort
  showAllItems.value = false;
}

// New function to handle delete
const confirmDeleteWork = async (work: WorkWithId) => {
  try {
    await deleteWork(work)
  } catch (error) {}
}
</script>

<template>
  <div class="bg-neutral-900 rounded-xl">
    <!-- Section title & description -->
    <div class="mb-6 px-6 pt-6">
      <h2 class="text-xl font-semibold text-white">{{ safeTranslate(TRANSLATION_KEYS.RESUME.WORK.LIST.TITLE, 'Expérience professionnelle') }}</h2>
      <p class="text-sm text-neutral-400 mt-1">
        {{ safeTranslate('ui.work.description', 'Ajoutez votre expérience professionnelle pour mettre en évidence votre progression de carrière.') }}
      </p>
    </div>

    <!-- Collection Manager for Work Experience -->
    <CollectionManager
      :items="displayedWorks"
      :loading="loading"
      :empty-text="safeTranslate(TRANSLATION_KEYS.RESUME.WORK.LIST.EMPTY_STATE_TITLE, 'Aucune expérience professionnelle')"
      :add-button-text="safeTranslate(TRANSLATION_KEYS.RESUME.WORK.LIST.ADD_BUTTON, 'Ajouter une expérience professionnelle')"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="confirmDeleteWork"
      @reorder="handleReorder"
    >
      <!-- Sorting options -->
      <template #header-actions>
        <div v-if="works.length > 1" class="flex items-center">
          <button 
            type="button"
            @click="toggleSortOrder"
            class="flex items-center text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
            :class="{'text-primary-300': useChronologicalSort && !isCustomOrder, 'text-neutral-400': !useChronologicalSort || isCustomOrder}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <polyline points="21 8 21 21"></polyline>
              <polyline points="10 21 3 21 3 8"></polyline>
              <line x1="14" y1="4" x2="14" y2="21"></line>
              <line x1="18" y1="4" x2="18" y2="21"></line>
              <line x1="3" y1="12" x2="10" y2="12"></line>
              <line x1="3" y1="16" x2="10" y2="16"></line>
            </svg>
            {{ useChronologicalSort && !isCustomOrder ? safeTranslate('resume.work.list.chronologicalOrder', 'Tri chronologique') : safeTranslate('resume.work.list.customOrder', 'Ordre personnalisé') }}
          </button>
        </div>
      </template>
      
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
    </CollectionManager>
    
    <!-- Performance optimization: show more/less button -->
    <div v-if="hasMoreItems" class="flex justify-center mt-4">
      <button 
        @click="toggleShowAllItems" 
        class="flex items-center px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
      >
        <span>{{ safeTranslate('resume.work.list.showAll', 'Voir toutes les expériences') }} ({{ sortedWorks.length }})</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
    
    <div v-if="showAllItems && sortedWorks.length > itemsPerPage" class="flex justify-center mt-4">
      <button 
        @click="toggleShowAllItems" 
        class="flex items-center px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300"
      >
        <span>{{ safeTranslate('resume.work.list.showLess', 'Réduire la liste') }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
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
