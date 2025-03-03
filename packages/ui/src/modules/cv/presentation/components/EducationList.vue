<script setup lang="ts">
import type { EducationWithId } from '@ui/modules/cv/presentation/stores/education'
import type { EducationInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import { useEducationStore } from '@ui/modules/cv/presentation/stores/education'
import { computed, onMounted, ref } from 'vue'
import Card from '@ui/components/shared/Card.vue'
import Button from '@ui/components/shared/Button.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
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
  courses: []
})

// Load education on component mount
onMounted(async () => {
  await educationStore.loadEducation()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Présent'
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('fr-FR', options)
}

// Open dialog for adding a new education entry
const openAddDialog = () => {
  editingEducation.value = {
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    courses: []
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing education entry
const openEditDialog = (education: EducationWithId, index: number) => {
  editingEducation.value = { ...education }
  editingEducationIndex.value = index
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
const deleteEducation = async (index: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
    try {
      const education = educations.value[index]
      await educationStore.deleteEducation(education.id)
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">Formation</h2>
        <p class="text-neutral-400 text-sm">
          Ajoutez vos diplômes et formations académiques.
        </p>
      </div>
      
      <Button
        @click="openAddDialog"
        variant="primary"
        icon="plus"
        >Ajouter une formation</Button>
    </div>

    <!-- Empty state when no education entries -->
    <EmptyState
      v-if="!loading && (!educations || educations.length === 0)"
      title="Aucune formation ajoutée"
      description="Commencez par ajouter votre parcours académique"
      icon="school"
    >
      <Button
        @click="openAddDialog"
        variant="primary"
        icon="plus"
        >Ajouter une formation</Button>
    </EmptyState>
    
    <!-- Education list -->
    <div v-else class="space-y-4">
      <Card
        v-for="(education, index) in educations"
        :key="`education-${education.id}`"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
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
                <li v-for="(course, courseIndex) in education.courses" :key="`course-${index}-${courseIndex}`">
                  {{ course }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex mt-4 md:mt-0 md:ml-4 md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <button
              type="button"
              @click="openEditDialog(education, index)"
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
              @click="deleteEducation(index)"
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