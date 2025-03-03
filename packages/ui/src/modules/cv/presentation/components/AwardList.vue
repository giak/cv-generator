<script setup lang="ts">
import type { AwardWithId } from '@ui/modules/cv/presentation/stores/award'
import type { AwardInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import { useAwardStore } from '@ui/modules/cv/presentation/stores/award'
import { computed, onMounted, ref } from 'vue'
import Card from '@ui/components/shared/Card.vue'
import Button from '@ui/components/shared/Button.vue'
import EmptyState from '@ui/components/shared/EmptyState.vue'
import AwardForm from './AwardForm.vue'

// State for managing the award list
const awardStore = useAwardStore()
const awards = computed(() => awardStore.awards || [])
const loading = computed(() => awardStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingAwardIndex = ref<number | null>(null)
const editingAward = ref<AwardInterface>({
  title: '',
  date: '',
  awarder: '',
  summary: ''
})

// Load awards on component mount
onMounted(async () => {
  await awardStore.loadAwards()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
  return date.toLocaleDateString('fr-FR', options)
}

// Open dialog for adding a new award entry
const openAddDialog = () => {
  editingAward.value = {
    title: '',
    date: '',
    awarder: '',
    summary: ''
  }
  dialogMode.value = 'add'
  showDialog.value = true
}

// Open dialog for editing an existing award entry
const openEditDialog = (award: AwardWithId, index: number) => {
  editingAward.value = { ...award }
  editingAwardIndex.value = index
  dialogMode.value = 'edit'
  showDialog.value = true
}

// Close dialog
const closeDialog = () => {
  showDialog.value = false
  editingAwardIndex.value = null
}

// Save award entry
const saveAward = async () => {
  try {
    if (dialogMode.value === 'add') {
      await awardStore.addAward(editingAward.value)
    } else if (dialogMode.value === 'edit' && editingAwardIndex.value !== null) {
      const award = awards.value[editingAwardIndex.value]
      await awardStore.updateAward(award.id, editingAward.value)
    }
    closeDialog()
  } catch (error) {
    console.error('Error saving award:', error)
  }
}

// Delete award entry
const deleteAward = async (index: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce prix ou cette distinction ?')) {
    try {
      const award = awards.value[index]
      await awardStore.deleteAward(award.id)
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold">Prix et Distinctions</h2>
        <p class="text-neutral-400 text-sm">
          Ajoutez les prix et distinctions que vous avez reçus.
        </p>
      </div>
      
      <Button
        @click="openAddDialog"
        variant="primary"
        icon="plus"
        >Ajouter un prix</Button>
    </div>

    <!-- Empty state when no award entries -->
    <EmptyState
      v-if="!loading && (!awards || awards.length === 0)"
      title="Aucun prix ou distinction ajouté"
      description="Commencez par ajouter vos récompenses et reconnaissances"
      icon="award"
    >
      <Button
        @click="openAddDialog"
        variant="primary"
        icon="plus"
        >Ajouter un prix</Button>
    </EmptyState>
    
    <!-- Award list -->
    <div v-else class="space-y-4">
      <Card
        v-for="(award, index) in awards"
        :key="`award-${award.id}`"
        class="hover:border-indigo-500/50 transition-colors"
      >
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex-grow">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 class="font-semibold text-lg">{{ award.title }}</h3>
              <span class="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-xs font-medium">
                {{ formatDate(award.date) }}
              </span>
            </div>
            
            <p class="text-primary-100 font-medium mb-3">
              <span class="text-neutral-400">Décerné par: </span>
              {{ award.awarder }}
            </p>
            
            <div v-if="award.summary" class="mt-2 text-sm text-neutral-300">
              {{ award.summary }}
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex mt-4 md:mt-0 md:ml-4 md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <button
              type="button"
              @click="openEditDialog(award, index)"
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
              @click="deleteAward(index)"
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
    
    <!-- Dialog for adding/editing award -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <AwardForm
            v-model="editingAward"
            :loading="loading"
            :is-new="dialogMode === 'add'"
            @validate="saveAward"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
  </div>
</template> 