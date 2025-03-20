<template>
  <div class="bg-neutral-900 rounded-xl">
    <CollectionManager
      :items="skills"
      :title="t(TRANSLATION_KEYS.RESUME.SKILLS.LIST.TITLE)"
      :description="t(TRANSLATION_KEYS.RESUME.SKILLS.LIST.DESCRIPTION)"
      :addButtonText="t(TRANSLATION_KEYS.RESUME.SKILLS.LIST.ADD_BUTTON)"
      :emptyStateTitle="t(TRANSLATION_KEYS.RESUME.SKILLS.LIST.EMPTY_STATE_TITLE)"
      :emptyStateDescription="t(TRANSLATION_KEYS.RESUME.SKILLS.LIST.EMPTY_STATE_DESCRIPTION)"
      :loading="loading"
      @add="openAddForm"
      @edit="openEditForm"
      @delete="deleteSkill"
      @reorder="handleReorder"
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
      <!-- Empty state -->
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4">
            <path d="M48 16C29.2 16 14 31.2 14 50C14 68.8 29.2 84 48 84C66.8 84 82 68.8 82 50C82 31.2 66.8 16 48 16Z" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M48 36V64" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M34 50H62" stroke="#4338CA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 class="text-lg font-medium text-neutral-200 mb-1">{{ safeTranslate(TRANSLATION_KEYS.RESUME.SKILLS.LIST.EMPTY_STATE_TITLE, 'Aucune compétence ajoutée') }}</h3>
          <p class="text-sm text-neutral-400 max-w-md">
            {{ safeTranslate(TRANSLATION_KEYS.RESUME.SKILLS.LIST.EMPTY_STATE_DESCRIPTION, 'Ajoutez vos compétences pour mettre en avant votre expertise et votre savoir-faire.') }}
          </p>
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
  isNewSkill.value ? t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.EDIT_TITLE)
)

// Load skills on component mount
onMounted(async () => {
  await loadSkills()
})

const loadSkills = async () => {
  try {
    await skillStore.loadSkills()
  } catch (error) {}
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
  } catch (error) {}
}

// Handle reordering
const handleReorder = async (newOrder: string[]) => {
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
