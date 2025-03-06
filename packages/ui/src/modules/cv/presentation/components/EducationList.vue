<script setup lang="ts">
import type { EducationWithId } from '@ui/modules/cv/presentation/stores/education'
import type { EducationInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useEducationStore } from '@ui/modules/cv/presentation/stores/education'
import { computed, onMounted, ref } from 'vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import EducationForm from './EducationForm.vue'

// State for managing the education list
const educationStore = useEducationStore()
const educations = computed(() => educationStore.educations || [])
const loading = computed(() => educationStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingEducationIndex = ref<number | null>(null)
const editingEducation = ref<EducationInterface>({
  institution: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  score: '',
  url: '',
  courses: []
})

// New state for sorting
const useChronologicalSort = ref(true)
const isCustomOrder = ref(false)

// Chronologically sorted educations (most recent first)
const sortedEducations = computed(() => {
  // If using custom order, return the original list
  if (!useChronologicalSort.value || isCustomOrder.value) {
    return educations.value;
  }
  
  // Create a copy to avoid modifying the source
  return [...educations.value].sort((a, b) => {
    // Determine the dates to use for comparison
    // Use endDate if available, otherwise use startDate
    const dateA = a.endDate && a.endDate !== '' ? a.endDate : (a.startDate || '');
    const dateB = b.endDate && b.endDate !== '' ? b.endDate : (b.startDate || '');
    
    // Handle special cases
    if (!dateA && !dateB) return 0; // Both missing dates
    if (!dateA) return 1; // a should come after b
    if (!dateB) return -1; // b should come after a
    
    // Parse dates - if invalid, put at the end
    try {
      // For "Present" or current roles, put them at the top
      if (a.endDate === '') return -1;
      if (b.endDate === '') return 1;
      
      // Compare dates (newest first)
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    } catch (error) {
      console.error('Error comparing dates:', error);
      return 0;
    }
  });
});

// Exposed educations (either sorted or original based on setting)
const displayedEducations = computed(() => {
  return sortedEducations.value;
});

// Load education on component mount
onMounted(async () => {
  await educationStore.loadEducation()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Présent'
  
  try {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
    return date.toLocaleDateString('fr-FR', options)
  } catch (e) {
    return dateString // Fallback to raw string if date parsing fails
  }
}

// Open dialog for adding a new education entry
const openAddDialog = () => {
  editingEducation.value = {
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    score: '',
    url: '',
    courses: []
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing education entry
const openEditDialog = (education: EducationWithId) => {
  editingEducation.value = { ...education }
  editingEducationIndex.value = educations.value.findIndex(e => e.id === education.id)
  dialogMode.value = 'edit'
  showDialog.value = true
}

// Close dialog
const closeDialog = () => {
  showDialog.value = false
  editingEducationIndex.value = null
}

// Save education entry
const saveEducation = async () => {
  try {
    if (dialogMode.value === 'add') {
      await educationStore.addEducation(editingEducation.value)
    } else if (dialogMode.value === 'edit' && editingEducationIndex.value !== null) {
      const education = educations.value[editingEducationIndex.value]
      await educationStore.updateEducation(education.id, editingEducation.value)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving education:', error)
  }
}

// Delete education entry
const deleteEducation = async (education: EducationWithId) => {
  try {
    if (!education.id) {
      console.error('Cannot delete education without ID')
      return
    }
    await educationStore.deleteEducation(education.id)
  } catch (error) {
    console.error('Error deleting education:', error)
  }
}

// Reorder education (move up)
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Mark as custom order
  isCustomOrder.value = true;
  useChronologicalSort.value = false;
  
  // Create array of indices, then swap
  const indices = [...Array(educations.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorderEducation method
  const newOrder = indices.map(i => {
    // Ensure each ID is a string
    const id = educations.value[i].id;
    return id ? id.toString() : '';
  }).filter(id => id !== '');
  
  try {
    await educationStore.reorderEducation(newOrder)
  } catch (error) {
    console.error('Error reordering educations:', error)
  }
}

const moveDown = async (index: number) => {
  if (index >= educations.value.length - 1) return
  
  // Mark as custom order
  isCustomOrder.value = true;
  useChronologicalSort.value = false;
  
  // Create array of indices, then map to strings
  const indices = [...Array(educations.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorderEducation method
  const newOrder = indices.map(i => {
    // Ensure each ID is a string
    const id = educations.value[i].id;
    return id ? id.toString() : '';
  }).filter(id => id !== '');
  
  try {
    await educationStore.reorderEducation(newOrder)
  } catch (error) {
    console.error('Error reordering educations:', error)
  }
}

// Toggle between chronological and custom order
const toggleSortOrder = async () => {
  useChronologicalSort.value = !useChronologicalSort.value;
  
  // If switching to chronological and we have a custom order,
  // ask if user wants to reset the custom order
  if (useChronologicalSort.value && isCustomOrder.value) {
    isCustomOrder.value = false;
    // We could show a confirmation dialog here
  }
}
</script>

<template>
  <div class="education-list">
    <CollectionManager
      :items="displayedEducations"
      title="Formation"
      description="Ajoutez vos diplômes et formations académiques."
      addButtonText="Ajouter une formation"
      emptyStateTitle="Aucune formation ajoutée"
      emptyStateDescription="Commencez par ajouter votre parcours académique"
      :loading="loading"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="deleteEducation"
    >
      <!-- Sorting options -->
      <template #header-actions>
        <div v-if="educations.length > 1" class="flex items-center">
          <button 
            type="button"
            @click="toggleSortOrder"
            class="flex items-center text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
            :class="{'text-indigo-300': useChronologicalSort && !isCustomOrder, 'text-neutral-400': !useChronologicalSort || isCustomOrder}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <polyline points="21 8 21 21"></polyline>
              <polyline points="10 21 3 21 3 8"></polyline>
              <line x1="14" y1="4" x2="14" y2="21"></line>
              <line x1="18" y1="4" x2="18" y2="21"></line>
              <line x1="3" y1="12" x2="10" y2="12"></line>
              <line x1="3" y1="16" x2="10" y2="16"></line>
            </svg>
            {{ useChronologicalSort && !isCustomOrder ? 'Tri chronologique' : 'Ordre personnalisé' }}
          </button>
        </div>
      </template>
      
      <template #item="{ item: education }">
        <div class="flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 class="font-semibold text-lg">{{ education.institution }}</h3>
            <span class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-medium">
              {{ education.studyType }}
            </span>
          </div>
          
          <p class="text-primary-100 font-medium mb-1">{{ education.area }}</p>
          
          <div class="flex items-center text-neutral-400 text-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{{ formatDate(education.startDate) }} - {{ formatDate(education.endDate) }}</span>
          </div>
          
          <div v-if="education.url" class="mb-3">
            <a :href="education.url" target="_blank" rel="noopener noreferrer" class="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Site web de l'établissement
            </a>
          </div>
          
          <div v-if="education.score" class="mb-3 flex items-center text-sm text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Résultat: {{ education.score }}
          </div>
          
          <!-- Courses -->
          <div v-if="education.courses && education.courses.length > 0" class="mt-3">
            <h4 class="text-sm font-medium mb-2">Cours suivis:</h4>
            <ul class="list-disc list-inside text-sm text-neutral-300 space-y-1">
              <li v-for="(course, courseIndex) in education.courses" :key="`course-${courseIndex}`">
                {{ course }}
              </li>
            </ul>
          </div>
        </div>
      </template>
      
      <template #itemActions="{ item: education, index }">
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
              :disabled="index === educations.length - 1"
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
    
    <!-- Dialog for adding/editing education -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <EducationForm
            v-model="editingEducation"
            :loading="loading"
            :is-new="dialogMode === 'add'"
            @validate="saveEducation"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
  </div>
</template> 