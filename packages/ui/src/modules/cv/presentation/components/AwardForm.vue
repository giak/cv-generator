<script setup lang="ts">
import type { AwardInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

interface Props {
  modelValue: AwardInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: AwardInterface): void
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

// Setup form model using useFormModel composable
const { 
  localModel, 
  updateField 
} = useFormModel<AwardInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues: {
    title: '',
    date: '',
    awarder: '',
    summary: ''
  }
})

// Setup form validation using useValidation composable
const { 
  errors, 
  validateField, 
  validateForm 
} = useValidation<AwardInterface>(undefined, {
  requiredFields: ['title', 'date', 'awarder']
})

// Handle field updates
const handleFieldUpdate = (field: keyof AwardInterface, value: string) => {
  updateField(field, value)
  validateField(field, value)
}

// Handle form submission
const handleSubmit = async () => {
  // Validate all fields
  const formIsValid = validateForm(localModel)
  
  if (formIsValid) {
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Icons for form fields
const icons = {
  title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  awarder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? t(TRANSLATION_KEYS.RESUME.AWARDS.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.AWARDS.FORM.EDIT_TITLE)"
    :subtitle="isNew ? t(TRANSLATION_KEYS.RESUME.AWARDS.FORM.ADD_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.AWARDS.FORM.EDIT_SUBTITLE)"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="title"
        :label="t(TRANSLATION_KEYS.RESUME.AWARDS.LABELS.TITLE)"
        :model-value="localModel.title"
        :error="errors.title"
        :icon="icons.title"
        :placeholder="t(TRANSLATION_KEYS.RESUME.AWARDS.PLACEHOLDERS.TITLE)"
        :help-text="t(TRANSLATION_KEYS.RESUME.AWARDS.HELP_TEXT.TITLE)"
        required
        @update:model-value="handleFieldUpdate('title', $event)"
        @blur="validateField('title', localModel.title)"
      />

      <FormField
        name="awarder"
        :label="t(TRANSLATION_KEYS.RESUME.AWARDS.LABELS.AWARDER)"
        :model-value="localModel.awarder"
        :error="errors.awarder"
        :icon="icons.awarder"
        :placeholder="t(TRANSLATION_KEYS.RESUME.AWARDS.PLACEHOLDERS.AWARDER)"
        :help-text="t(TRANSLATION_KEYS.RESUME.AWARDS.HELP_TEXT.AWARDER)"
        required
        @update:model-value="handleFieldUpdate('awarder', $event)"
        @blur="validateField('awarder', localModel.awarder)"
      />

      <FormField
        name="date"
        :label="t(TRANSLATION_KEYS.RESUME.AWARDS.LABELS.DATE)"
        :model-value="localModel.date"
        :error="errors.date"
        :icon="icons.date"
        :help-text="t(TRANSLATION_KEYS.RESUME.AWARDS.HELP_TEXT.DATE)"
        required
        @update:model-value="handleFieldUpdate('date', $event)"
        @blur="validateField('date', localModel.date)"
      />
    </div>

    <!-- Résumé / Summary section -->
    <div class="mt-6">
      <FormField
        name="summary"
        :label="t(TRANSLATION_KEYS.RESUME.AWARDS.LABELS.SUMMARY)"
        :model-value="localModel.summary || ''"
        :error="errors.summary"
        :icon="icons.summary"
        :placeholder="t(TRANSLATION_KEYS.RESUME.AWARDS.PLACEHOLDERS.SUMMARY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.AWARDS.HELP_TEXT.SUMMARY)"
        textarea
        rows="4"
        @update:model-value="handleFieldUpdate('summary', $event)"
        @blur="validateField('summary', localModel.summary || '')"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-8">
      <button 
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="handleCancel"
      >
        {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
      </button>
      <button 
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
      >
        {{ isNew ? t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) : t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) }}
      </button>
    </div>
  </Form>
</template>
