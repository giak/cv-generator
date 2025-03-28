<template>
  <Form 
    :loading="loading"
    :title="isNew ? t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.EDIT_TITLE)"
    :subtitle="isNew ? t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.ADD_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.EDIT_SUBTITLE)"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.SKILLS.LABELS.NAME)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="t(TRANSLATION_KEYS.RESUME.SKILLS.PLACEHOLDERS.NAME)"
        :help-text="t(TRANSLATION_KEYS.RESUME.SKILLS.HELP_TEXT.NAME)"
        required
        @update:model-value="(value) => updateField('name', value)"
        @blur="validateField('name', localModel.name)"
      />

      <FormField
        name="level"
        :label="t(TRANSLATION_KEYS.RESUME.SKILLS.LABELS.LEVEL)"
        :model-value="localModel.level || ''"
        :error="errors.level"
        :icon="icons.level"
        :placeholder="t(TRANSLATION_KEYS.RESUME.SKILLS.PLACEHOLDERS.LEVEL)"
        :help-text="t(TRANSLATION_KEYS.RESUME.SKILLS.HELP_TEXT.LEVEL)"
        @update:model-value="(value) => updateField('level', value)"
        @blur="validateField('level', localModel.level)"
      />
    </div>

    <!-- Keywords section -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4 flex items-center">
        <span class="mr-2" v-html="icons.keywords"></span>
        {{ t(TRANSLATION_KEYS.RESUME.SKILLS.LABELS.KEYWORDS) }}
      </h3>
      
      <div class="mb-4">
        <label class="text-sm mb-1 block">{{ t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.KEYWORDS_DESCRIPTION) }}</label>
        
        <div class="flex">
          <input 
            v-model="newKeyword"
            type="text"
            :placeholder="t(TRANSLATION_KEYS.RESUME.SKILLS.PLACEHOLDERS.KEYWORD)"
            class="flex-grow rounded-l bg-neutral-700 border-neutral-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter.prevent="addKeyword"
          />
          <button 
            type="button"
            class="rounded-r bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="addKeyword"
          >
            {{ t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.ADD_KEYWORD) }}
          </button>
        </div>
        <p v-if="keywordError" class="text-red-500 text-sm mt-1">{{ keywordError }}</p>
      </div>
      
      <!-- Keywords list -->
      <div v-if="localModel.keywords && localModel.keywords.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(keyword, index) in localModel.keywords" 
            :key="index"
            class="bg-neutral-700 text-white px-3 py-1 rounded-full flex items-center"
          >
            <span class="mr-2">{{ keyword }}</span>
            <button 
              type="button"
              class="text-neutral-400 hover:text-white focus:outline-none"
              @click="removeKeyword(index)"
              :aria-label="t(TRANSLATION_KEYS.COMMON.ACTIONS.REMOVE)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="mt-4 text-neutral-400 italic">
        {{ t(TRANSLATION_KEYS.RESUME.SKILLS.FORM.NO_KEYWORDS) }}
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { SkillInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

interface Props {
  modelValue: SkillInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: SkillInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const result = t(key);
    // Si la clé est retournée telle quelle, c'est qu'elle n'existe pas
    if (result === key) {

      return fallback;
    }
    return result;
  } catch (error) {

    return fallback;
  }
};

// Create a computed model value for useFormModel
const modelValue = computed<SkillInterface>(() => props.modelValue)

// Keywords management
const newKeyword = ref('')
const keywordError = ref('')

// Use the new composables
const { localModel, updateField } = useFormModel<SkillInterface>({
  modelValue,
  emit: (_event, value) => emit('update:modelValue', value),
  defaultValues: {
    name: '',
    level: '',
    keywords: []
  }
})

const { errors, validateField, validateForm } = useValidation<SkillInterface>(undefined, {
  requiredFields: ['name']
})

// Handle adding a keyword
const addKeyword = () => {
  if (!newKeyword.value.trim()) {
    keywordError.value = safeTranslate(TRANSLATION_KEYS.RESUME.SKILLS.VALIDATION.EMPTY_KEYWORD, 'Le mot-clé ne peut pas être vide')
    return
  }
  
  keywordError.value = ''
  const updatedKeywords = [...(localModel.keywords || []), newKeyword.value.trim()]
  
  updateField('keywords', updatedKeywords)
  newKeyword.value = ''
}

// Handle removing a keyword
const removeKeyword = (index: number) => {
  const updatedKeywords = [...(localModel.keywords || [])]
  updatedKeywords.splice(index, 1)
  
  updateField('keywords', updatedKeywords)
}

// Handle form submission
const handleSubmit = async () => {

  // Validate all fields
  const formIsValid = validateForm(localModel)

  if (formIsValid) {
    // Ensure required fields are present
    if (!localModel.name) {

      return
    }
    
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Icons for form fields
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  level: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17L12 22L22 17"></path><path d="M2 12L12 17L22 12"></path><path d="M12 2L2 7L12 12L22 7L12 2Z"></path></svg>`,
  keywords: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style>
