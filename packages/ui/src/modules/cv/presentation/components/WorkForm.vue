<script setup lang="ts">
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import DateRangeFields from '@ui/components/shared/form/DateRangeFields.vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

interface Props {
  modelValue: WorkInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: WorkInterface): void
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
      console.warn(`Missing translation key: ${key}, using fallback`);
      return fallback;
    }
    return result;
  } catch (error) {
    console.error(`Error translating key: ${key}`, error);
    return fallback;
  }
};

// Create a computed model value for useFormModel
const modelValue = computed<WorkInterface>(() => props.modelValue)

// Highlights management
const newHighlight = ref('')
const highlightError = ref('')

// Use the new composables
const { localModel, updateField } = useFormModel<WorkInterface>({
  modelValue,
  emit: (_event, value) => emit('update:modelValue', value),
  defaultValues: {
    name: '',
    position: '',
    url: '',
    startDate: '',
    endDate: '',
    summary: '',
    highlights: []
  }
})

const { errors, validateField, validateForm } = useValidation<WorkInterface>(undefined, {
  requiredFields: ['name', 'position', 'startDate']
})

// Handle adding a highlight
const addHighlight = () => {
  if (!newHighlight.value.trim()) {
    highlightError.value = safeTranslate(TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD, 'Le point fort ne peut pas être vide')
    return
  }
  
  highlightError.value = ''
  const updatedHighlights = [...(localModel.highlights || []), newHighlight.value.trim()]
  
  updateField('highlights', updatedHighlights)
  newHighlight.value = ''
}

// Handle removing a highlight
const removeHighlight = (index: number) => {
  const updatedHighlights = [...(localModel.highlights || [])]
  updatedHighlights.splice(index, 1)
  
  updateField('highlights', updatedHighlights)
}

// Handle the "currently working" state
const handleCurrentPositionChange = (isCurrentPosition: boolean) => {
  if (isCurrentPosition) {
    // If it's the current position, clear the end date
    updateField('endDate', '')
  }
}

// Validate form before emitting validate event
const handleSubmit = async () => {
  console.log('Work form submission - Current model:', JSON.parse(JSON.stringify(localModel)))
  
  // Validate all fields
  const formIsValid = validateForm(localModel)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Log all the fields to verify they are present
    console.log('Submitting with complete model:', {
      name: localModel.name,
      position: localModel.position,
      startDate: localModel.startDate,
      endDate: localModel.endDate,
      url: localModel.url,
      summary: localModel.summary,
      highlights: localModel.highlights
    })
    
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  console.log('Cancelling form - emitting cancel event')
  emit('cancel')
}

// Validate date fields
const validateDateRange = ({ startDate, endDate }: { startDate: string, endDate?: string }) => {
  validateField('startDate', startDate)
  
  if (endDate) {
    validateField('endDate', endDate)
    
    if (startDate && endDate && startDate > endDate) {
      errors.value.endDate = safeTranslate(TRANSLATION_KEYS.RESUME.WORK.VALIDATION.END_BEFORE_START, 'La date de fin doit être postérieure à la date de début')
      return false
    }
  }
  
  return true
}

// Icônes SVG pour les champs
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  position: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0-2-.9-2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z"></path><path d="M12 10h4v2h-4v-2z"></path></svg>`,
  startDate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  endDate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  highlight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? t(TRANSLATION_KEYS.RESUME.WORK.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.WORK.FORM.EDIT_TITLE)"
    :subtitle="isNew ? t(TRANSLATION_KEYS.RESUME.WORK.FORM.ADD_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.WORK.FORM.EDIT_SUBTITLE)"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.COMPANY)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.COMPANY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.COMPANY)"
        required
        @update:model-value="(value) => updateField('name', value)"
        @blur="validateField('name', localModel.name)"
      />

      <FormField
        name="position"
        :label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.POSITION)"
        :model-value="localModel.position"
        :error="errors.position"
        :icon="icons.position"
        :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.POSITION)"
        :help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.POSITION)"
        required
        @update:model-value="(value) => updateField('position', value)"
        @blur="validateField('position', localModel.position)"
      />

      <div class="col-span-1 md:col-span-2">
        <DateRangeFields
          :start-date="localModel.startDate"
          :end-date="localModel.endDate || ''"
          :is-currently-active="!localModel.endDate"
          :start-date-error="errors.startDate"
          :end-date-error="errors.endDate"
          :start-date-icon="icons.startDate"
          :end-date-icon="icons.endDate"
          :required="true"
          :start-date-help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.START_DATE)"
          :end-date-help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.END_DATE)"
          :currently-active-label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.CURRENT_POSITION)"
          @update:start-date="(value) => updateField('startDate', value)"
          @update:end-date="(value) => updateField('endDate', value)"
          @update:is-currently-active="handleCurrentPositionChange"
          @start-date-blur="() => validateField('startDate', localModel.startDate)"
          @end-date-blur="() => validateField('endDate', localModel.endDate)"
          @date-range-change="validateDateRange"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          :label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.WEBSITE)"
          :model-value="localModel.url || ''"
          :error="errors.url"
          :icon="icons.url"
          :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.WEBSITE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.WEBSITE)"
          @update:model-value="(value) => updateField('url', value)"
          @blur="validateField('url', localModel.url)"
        />
      </div>
    </div>
    
    <div class="mt-6">
      <FormField
        name="summary"
        :label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.SUMMARY)"
        :model-value="localModel.summary || ''"
        :error="errors.summary"
        :icon="icons.summary"
        :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.SUMMARY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.WORK.HELP_TEXT.SUMMARY)"
        @update:model-value="(value) => updateField('summary', value)"
        @blur="validateField('summary', localModel.summary)"
      />
    </div>
    
    <!-- Section pour les points forts (highlights) -->
    <div class="mt-6">
      <h3 class="block mb-1.5 text-xs font-medium text-neutral-300 tracking-wide">{{ t(TRANSLATION_KEYS.RESUME.WORK.LABELS.HIGHLIGHTS) }}</h3>
      <p class="text-xs text-neutral-400 mb-4">
        {{ t(TRANSLATION_KEYS.RESUME.WORK.FORM.HIGHLIGHTS_DESCRIPTION) }}
      </p>
      
      <!-- Liste des points forts existants -->
      <ul v-if="localModel.highlights && localModel.highlights.length > 0" class="mb-4 space-y-2">
        <li v-for="(highlight, index) in localModel.highlights" :key="index" class="flex items-center bg-neutral-800 p-2 rounded">
          <span class="flex-grow text-sm">{{ highlight }}</span>
          <button 
            type="button" 
            @click="removeHighlight(index)"
            class="ml-2 text-neutral-400 hover:text-error-400 focus:outline-none"
            :aria-label="t(TRANSLATION_KEYS.COMMON.ACTIONS.REMOVE)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </li>
      </ul>
      
      <!-- Message si pas de points forts -->
      <p v-else class="text-sm text-neutral-500 mb-4">
        {{ t(TRANSLATION_KEYS.RESUME.WORK.FORM.NO_HIGHLIGHTS) }}
      </p>
      
      <!-- Ajout d'un nouveau point fort -->
      <div class="flex items-start">
        <div class="flex-grow">
          <div class="relative">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <span v-html="icons.highlight"></span>
            </div>
            
            <input
              v-model="newHighlight"
              type="text"
              name="new-highlight"
              :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.HIGHLIGHT)"
              class="block w-full py-2.5 px-3 pl-10 text-sm leading-6 text-white bg-neutral-800 border rounded transition-all duration-200 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-750 focus:border-primary-500 focus:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary-500/40"
              @keyup.enter="addHighlight"
            />
          </div>
          
          <div v-if="highlightError" class="mt-1 text-xs text-error-500">
            {{ highlightError }}
          </div>
        </div>
        
        <button
          type="button"
          @click="addHighlight"
          class="ml-2 px-3 py-2.5 rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors"
        >
          {{ t(TRANSLATION_KEYS.RESUME.WORK.FORM.ADD_HIGHLIGHT) }}
        </button>
      </div>
    </div>
    
    <!-- Actions personnalisées -->
    <template #actions>
      <div class="flex justify-end mt-8">
        <button
          type="button"
          class="px-4 py-2 mr-3 border border-neutral-600 rounded-md text-neutral-200 bg-transparent hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
        </button>
        
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isNew ? t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) : t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) }}
        </button>
      </div>
    </template>
  </Form>
</template> 