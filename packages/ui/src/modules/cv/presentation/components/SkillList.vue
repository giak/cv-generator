<template>
  <div class="bg-neutral-800 rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-neutral-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold mb-1">Compétences</h2>
          <p class="text-neutral-400">
            Mettez en avant vos compétences techniques et soft skills pour vous démarquer.
          </p>
        </div>
        <div>
          <button
            @click="openAddForm"
            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Ajouter une compétence
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="p-6 flex justify-center items-center min-h-[200px]">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-8 w-8 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <p class="mt-4 text-neutral-400">Chargement des compétences...</p>
      </div>
    </div>

    <div v-else-if="!skills || skills.length === 0" class="p-6 min-h-[200px]">
      <div class="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
        <div class="bg-neutral-700 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium mb-2">Aucune compétence ajoutée</h3>
        <p class="text-neutral-400 mb-6 max-w-md">
          Ajoutez vos compétences techniques et soft skills pour valoriser votre profil et vous démarquer auprès des recruteurs.
        </p>
        <button
          @click="openAddForm"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Ajouter votre première compétence
        </button>
      </div>
    </div>

    <div v-else class="divide-y divide-neutral-700">
      <!-- Liste standard plutôt que draggable -->
      <div v-for="element in draggableSkills" :key="element.id" class="p-4 sm:p-6 hover:bg-neutral-750 transition-colors">
        <div class="flex items-start gap-4">
          <!-- Icône de glisser-déposer (désactivée) -->
          <div class="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-grow">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 class="text-lg font-medium">{{ element.name }}</h3>
              <div v-if="element.level" class="px-3 py-1 bg-indigo-900 text-indigo-100 rounded-full text-sm">
                {{ element.level }}
              </div>
            </div>
            
            <!-- Keywords -->
            <div v-if="element.keywords && element.keywords.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span 
                v-for="(keyword, index) in element.keywords" 
                :key="index"
                class="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-sm"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-1">
            <button
              @click="openEditForm(element)"
              class="p-2 text-neutral-400 hover:text-white focus:outline-none"
              title="Modifier cette compétence"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(element)"
              class="p-2 text-neutral-400 hover:text-red-500 focus:outline-none"
              title="Supprimer cette compétence"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Dialog -->
    <div v-if="showFormDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <h3 class="text-xl font-semibold mb-4">{{ formDialogTitle }}</h3>
          <SkillForm
            v-model="currentSkill"
            :loading="formSubmitting"
            :is-new="isNewSkill"
            @validate="saveSkill"
            @cancel="closeForm"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-lg font-medium text-white mb-2">Confirmer la suppression</h3>
          <p class="mb-6">
            Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible.
          </p>
          <div class="flex justify-end gap-4">
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deleteSkill"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              :disabled="deleteSubmitting"
            >
              <span v-if="deleteSubmitting" class="flex items-center gap-2">
                <span class="h-4 w-4 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></span>
                Suppression...
              </span>
              <span v-else>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import SkillForm from './SkillForm.vue'
import { useSkillStore, type ValidatedSkill } from '@ui/modules/cv/presentation/stores/skill'
import { SkillInterface } from '@cv-generator/shared/src/types/resume.interface'

// Initialize skill store
const skillStore = useSkillStore()

// Reactive state
const loading = ref(true)
const skills = ref<ValidatedSkill[] | null>(null)
const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const formSubmitting = ref(false)
const deleteSubmitting = ref(false)
const isNewSkill = ref(false)
const currentSkill = ref<SkillInterface>({
  name: '',
})
const skillToDelete = ref<string | null>(null)

// Computed properties
const formDialogTitle = computed(() => 
  isNewSkill.value ? 'Ajouter une compétence' : 'Modifier la compétence'
)

// Load skills on component mount
onMounted(async () => {
  await loadSkills()
})

const loadSkills = async () => {
  loading.value = true
  try {
    const data = await skillStore.loadSkills()
    skills.value = data
  } catch (error) {
    console.error('Failed to load skills:', error)
  } finally {
    loading.value = false
  }
}

// Create a draggable version of the skills array for the draggable component
const draggableSkills = computed({
  get: () => skills.value || [],
  set: (value) => {
    skills.value = value
  }
})

// Open add form dialog
const openAddForm = () => {
  currentSkill.value = {
    name: '',
  }
  isNewSkill.value = true
  showFormDialog.value = true
}

// Open edit form dialog
const openEditForm = (skill: ValidatedSkill) => {
  currentSkill.value = {
    name: skill.name,
    level: skill.level,
    keywords: skill.keywords ? [...skill.keywords] : undefined
  }
  isNewSkill.value = false
  showFormDialog.value = true
}

// Close form dialog
const closeForm = () => {
  showFormDialog.value = false
}

// Save skill (create or update)
const saveSkill = async () => {
  formSubmitting.value = true
  
  try {
    if (isNewSkill.value) {
      await skillStore.addSkill(currentSkill.value)
    } else {
      // Find the ID of the skill being edited
      const skillId = skills.value?.find(
        s => s.name === currentSkill.value.name
      )?.id
      
      if (!skillId) {
        throw new Error('Skill ID not found for update')
      }
      
      await skillStore.updateSkill(skillId, currentSkill.value)
    }
    
    showFormDialog.value = false
    
    // Reload skills to get updated data
    await loadSkills()
  } catch (error) {
    console.error('Error saving skill:', error)
    // Error handling would be done here
  } finally {
    formSubmitting.value = false
  }
}

// Confirm delete dialog
const confirmDelete = (skill: ValidatedSkill) => {
  skillToDelete.value = skill.id
  showDeleteDialog.value = true
}

// Delete skill
const deleteSkill = async () => {
  if (!skillToDelete.value) return
  
  deleteSubmitting.value = true
  
  try {
    await skillStore.deleteSkill(skillToDelete.value)
    showDeleteDialog.value = false
    
    // Reload skills to get updated data
    await loadSkills()
  } catch (error) {
    console.error('Error deleting skill:', error)
    // Error handling would be done here
  } finally {
    deleteSubmitting.value = false
  }
}
</script>

<style scoped>
.divide-y.divide-neutral-700 > .sortable-ghost {
  @apply bg-neutral-700 opacity-80;
}
.drag-handle:active {
  @apply cursor-grabbing;
}
</style> 