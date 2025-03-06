<template>
  <div class="skill-list">
    <CollectionManager
      :items="skills"
      title="Compétences"
      description="Mettez en avant vos compétences techniques et soft skills pour vous démarquer."
      addButtonText="Ajouter une compétence"
      emptyStateTitle="Aucune compétence ajoutée"
      emptyStateDescription="Ajoutez vos compétences techniques et soft skills pour valoriser votre profil et vous démarquer auprès des recruteurs."
      :loading="loading"
      @add="openAddForm"
      @edit="openEditForm"
      @delete="deleteSkill"
    >
      <template #item="{ item: skill }">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h3 class="text-lg font-medium">{{ skill.name }}</h3>
          <div v-if="skill.level" class="px-3 py-1 bg-indigo-900 text-indigo-100 rounded-full text-sm">
            {{ skill.level }}
          </div>
        </div>
        
        <!-- Keywords -->
        <div v-if="skill.keywords && skill.keywords.length > 0" class="mt-2 flex flex-wrap gap-2">
          <span 
            v-for="(keyword, index) in skill.keywords" 
            :key="index"
            class="px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-sm"
          >
            {{ keyword }}
          </span>
        </div>
      </template>
      
      <template #itemActions="{ item: skill, index }">
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
              :disabled="index === skills.length - 1"
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
    
    <!-- Dialog for adding/editing skill -->
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import SkillForm from './SkillForm.vue'
import { useSkillStore, type ValidatedSkill } from '@ui/modules/cv/presentation/stores/skill'
import { SkillInterface } from '@cv-generator/shared/src/types/resume.interface'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'

// Initialize skill store
const skillStore = useSkillStore()

// Reactive state
const loading = computed(() => skillStore.loading)
const skills = computed(() => skillStore.skills || [])
const showFormDialog = ref(false)
const formSubmitting = ref(false)
const isNewSkill = ref(false)
const currentSkill = ref<SkillInterface>({
  name: '',
})

// Computed properties
const formDialogTitle = computed(() => 
  isNewSkill.value ? 'Ajouter une compétence' : 'Modifier la compétence'
)

// Load skills on component mount
onMounted(async () => {
  await loadSkills()
})

const loadSkills = async () => {
  try {
    await skillStore.loadSkills()
  } catch (error) {
    console.error('Failed to load skills:', error)
  }
}

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

// Delete skill
const deleteSkill = async (skill: ValidatedSkill) => {
  try {
    await skillStore.deleteSkill(skill.id)
    
    // Reload skills to get updated data
    await loadSkills()
  } catch (error) {
    console.error('Error deleting skill:', error)
  }
}

// Reorder skills
const moveUp = async (index: number) => {
  if (index <= 0) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(skills.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index - 1]
  indices[index - 1] = temp
  
  // Convert to string IDs for the reorderSkills method
  const newOrder = indices.map(i => skills.value[i].id)
  
  try {
    await skillStore.reorderSkills(newOrder)
  } catch (error) {
    console.error('Error reordering skills:', error)
  }
}

const moveDown = async (index: number) => {
  if (index >= skills.value.length - 1) return
  
  // Create array of indices, then map to strings
  const indices = [...Array(skills.value.length).keys()]
  const temp = indices[index]
  indices[index] = indices[index + 1]
  indices[index + 1] = temp
  
  // Convert to string IDs for the reorderSkills method
  const newOrder = indices.map(i => skills.value[i].id)
  
  try {
    await skillStore.reorderSkills(newOrder)
  } catch (error) {
    console.error('Error reordering skills:', error)
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