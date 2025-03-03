<script setup lang="ts">
import type { VolunteerWithId } from '@ui/modules/cv/presentation/stores/volunteer'
import type { VolunteerInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import { useVolunteerStore } from '@ui/modules/cv/presentation/stores/volunteer'
import { computed, onMounted, ref } from 'vue'
import Card from '@ui/components/shared/Card.vue'
import Button from '@ui/components/shared/Button.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
import VolunteerForm from './VolunteerForm.vue'

// State for managing the volunteer list
const volunteerStore = useVolunteerStore()
const volunteers = computed(() => volunteerStore.volunteers || [])
const loading = computed(() => volunteerStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingVolunteerIndex = ref<number | null>(null)
const editingVolunteer = ref<VolunteerInterface>({
  organization: '',
  position: '',
  startDate: '',
  highlights: []
})

// Load volunteers on component mount
onMounted(async () => {
  await volunteerStore.loadVolunteers()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Présent'
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('fr-FR', options)
}

// Open dialog for adding a new volunteer experience
const openAddDialog = () => {
  editingVolunteer.value = {
    organization: '',
    position: '',
    startDate: '',
    highlights: []
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing volunteer experience
const openEditDialog = (volunteer: VolunteerWithId, index: number) => {
  editingVolunteer.value = { ...volunteer }
  editingVolunteerIndex.value = index
  dialogMode.value = 'edit'
  showDialog.value = true
}

// Close dialog
const closeDialog = () => {
  console.log('Closing dialog')
  showDialog.value = false
  editingVolunteerIndex.value = null
}

// Save volunteer experience (add or update)
const saveVolunteer = async () => {
  try {
    console.log('Saving volunteer experience:', editingVolunteer.value)
    
    if (dialogMode.value === 'add') {
      await volunteerStore.addVolunteer(editingVolunteer.value)
    } else if (dialogMode.value === 'edit' && editingVolunteerIndex.value !== null && volunteers.value[editingVolunteerIndex.value]) {
      const volunteerId = volunteers.value[editingVolunteerIndex.value].id
      await volunteerStore.updateVolunteer(volunteerId, editingVolunteer.value)
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error saving volunteer experience:', error)
  }
}

// Delete volunteer experience
const deleteVolunteer = async (index: number) => {
  if (!volunteers.value[index]) return
  
  if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience de bénévolat ?')) {
    try {
      const volunteerId = volunteers.value[index].id
      await volunteerStore.deleteVolunteer(volunteerId)
    } catch (error) {
      console.error('Error deleting volunteer experience:', error)
    }
  }
}

// Reorder volunteer experiences
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  try {
    // Create a new order array with the current volunteer IDs
    const currentIds = volunteers.value.map(vol => vol.id)
    
    // Swap positions
    const temp = currentIds[index]
    currentIds[index] = currentIds[index - 1]
    currentIds[index - 1] = temp
    
    await volunteerStore.reorderVolunteers(currentIds)
  } catch (error) {
    console.error('Error reordering volunteer experiences:', error)
  }
}

const moveDown = async (index: number) => {
  if (index >= volunteers.value.length - 1) return
  
  try {
    // Create a new order array with the current volunteer IDs
    const currentIds = volunteers.value.map(vol => vol.id)
    
    // Swap positions
    const temp = currentIds[index]
    currentIds[index] = currentIds[index + 1]
    currentIds[index + 1] = temp
    
    await volunteerStore.reorderVolunteers(currentIds)
  } catch (error) {
    console.error('Error reordering volunteer experiences:', error)
  }
}
</script>

<template>
  <div class="volunteer-list">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold">Expériences de Bénévolat</h2>
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
    
    <!-- Empty state when no volunteer experiences are available -->
    <EmptyState
      v-if="!loading && (!volunteers || volunteers.length === 0)"
      title="Aucune expérience de bénévolat"
      description="Ajoutez vos expériences de bénévolat pour enrichir votre CV."
      actionLabel="Ajouter une expérience"
      @action="openAddDialog"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
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
    
    <!-- Volunteer experiences list -->
    <div v-else class="space-y-4">
      <Card
        v-for="(volunteer, index) in volunteers"
        :key="volunteer.id || index"
        class="volunteer-item transition-all duration-200"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
            <h3 class="text-lg font-medium text-white">{{ volunteer.position }}</h3>
            <div class="text-primary-400 font-medium mb-1">{{ volunteer.organization }}</div>
            <div class="text-sm text-neutral-400 mb-2">
              {{ formatDate(volunteer.startDate) }} - {{ formatDate(volunteer.endDate) }}
            </div>
            
            <div v-if="volunteer.summary" class="text-sm text-neutral-300 mb-3">
              {{ volunteer.summary }}
            </div>
            
            <ul v-if="volunteer.highlights && volunteer.highlights.length > 0" class="list-disc pl-5 space-y-1 mb-3">
              <li 
                v-for="(highlight, hIndex) in volunteer.highlights" 
                :key="hIndex"
                class="text-xs text-neutral-300"
              >
                {{ highlight }}
              </li>
            </ul>
            
            <a 
              v-if="volunteer.url" 
              :href="volunteer.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              {{ volunteer.url }}
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
                :disabled="index === volunteers.length - 1"
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
              @click="openEditDialog(volunteer, index)"
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
              @click="deleteVolunteer(index)"
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
    
    <!-- Dialog for adding/editing volunteer experience -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <VolunteerForm
            v-model="editingVolunteer"
            :loading="loading"
            :is-new="dialogMode === 'add'"
            @validate="saveVolunteer"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
  </div>
</template> 