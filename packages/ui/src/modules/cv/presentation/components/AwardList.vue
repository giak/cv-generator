<script setup lang="ts">
import type { AwardWithId } from '@ui/modules/cv/presentation/stores/award'
import type { AwardInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import { useAwardStore } from '@ui/modules/cv/presentation/stores/award'
import { computed, onMounted, ref } from 'vue'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'
import AwardForm from './AwardForm.vue'
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

// State for managing the award list
const awardStore = useAwardStore()

// Set up useCollectionField for managing awards
const { 
  items: awards} = useCollectionField<AwardWithId>({
  fieldName: 'awards',
  collection: computed(() => awardStore.awards || []),
  updateField: () => {}, // Using the store directly
  defaultItemValues: {
    id: '',
    title: '',
    date: '',
    awarder: '',
    summary: ''
  },
  identifierField: 'id'
})

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
const openEditDialog = (award: AwardWithId) => {
  editingAward.value = { ...award }
  editingAwardIndex.value = awards.value.findIndex(a => a.id === award.id)
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
const deleteAward = async (award: AwardWithId) => {
  if (confirm(safeTranslate('resume.awards.list.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce prix ou cette distinction ?'))) {
    try {
      await awardStore.deleteAward(award.id)
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }
}

// Reorder awards up
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(awards.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => awards.value[i].id)
  
  try {
    await awardStore.reorderAwards(newOrder)
  } catch (error) {
    console.error('Error reordering awards:', error)
  }
}

// Reorder awards down
const moveDown = async (index: number) => {
  if (index >= awards.value.length - 1) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(awards.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorder method
  const newOrder = indices.map(i => awards.value[i].id)
  
  try {
    await awardStore.reorderAwards(newOrder)
  } catch (error) {
    console.error('Error reordering awards:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <CollectionManager
      :items="awards"
      :title="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.EMPTY_STATE_DESCRIPTION)"
      emptyStateIcon="award"
      :loading="loading"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="deleteAward"
    >
      <template #item="{ item: award }">
        <div class="flex-grow">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 class="font-semibold text-lg">{{ award.title }}</h3>
            <span class="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-xs font-medium">
              {{ formatDate(award.date) }}
            </span>
          </div>
          
          <p class="text-primary-100 font-medium mb-3">
            <span class="text-neutral-400">{{ safeTranslate('resume.awards.list.awardedBy', 'Décerné par') }}: </span>
            {{ award.awarder }}
          </p>
          
          <div v-if="award.summary" class="mt-2 text-sm text-neutral-300">
            {{ award.summary }}
          </div>
        </div>
      </template>
      
      <template #itemActions="{ index }">
        <div class="flex gap-1">
          <button
            type="button"
            @click="moveUp(index)"
            :disabled="index === 0"
            class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            :title="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.MOVE_UP)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          
          <button
            type="button"
            @click="moveDown(index)"
            :disabled="index === awards.length - 1"
            class="p-1 rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            :title="t(TRANSLATION_KEYS.RESUME.AWARDS.LIST.MOVE_DOWN)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </template>
    </CollectionManager>
    
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