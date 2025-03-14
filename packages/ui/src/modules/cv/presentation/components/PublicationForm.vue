<template>
  <Form 
    :loading="loading"
    :title="isNew ? t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.FORM.EDIT_TITLE)"
    :subtitle="isNew ? t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.FORM.ADD_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.FORM.EDIT_SUBTITLE)"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LABELS.NAME)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.PLACEHOLDERS.NAME)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.HELP_TEXT.NAME)"
        required
        @update:model-value="(value) => handleFieldUpdate('name', value)"
        @blur="validateField('name', localModel.name)"
      />

      <FormField
        name="publisher"
        :label="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LABELS.PUBLISHER)"
        :model-value="localModel.publisher"
        :error="errors.publisher"
        :icon="icons.publisher"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.PLACEHOLDERS.PUBLISHER)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.HELP_TEXT.PUBLISHER)"
        required
        @update:model-value="(value) => handleFieldUpdate('publisher', value)"
        @blur="validateField('publisher', localModel.publisher)"
      />

      <FormField
        name="releaseDate"
        :label="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LABELS.RELEASE_DATE)"
        :model-value="localModel.releaseDate"
        :error="errors.releaseDate"
        :icon="icons.date"
        :help-text="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.HELP_TEXT.RELEASE_DATE)"
        required
        @update:model-value="(value) => handleFieldUpdate('releaseDate', value)"
        @blur="validateField('releaseDate', localModel.releaseDate)"
      />

      <FormField
        name="url"
        type="url"
        :label="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LABELS.URL)"
        :model-value="localModel.url"
        :error="errors.url"
        :icon="icons.url"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.PLACEHOLDERS.URL)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.HELP_TEXT.URL)"
        @update:model-value="(value) => handleFieldUpdate('url', value)"
        @blur="validateField('url', localModel.url)"
      />
    </div>

    <!-- Summary field - full width -->
    <div class="mt-6">
      <FormField
        name="summary"
        :label="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.LABELS.SUMMARY)"
        :model-value="localModel.summary"
        :error="errors.summary"
        :icon="icons.description"
        :placeholder="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.PLACEHOLDERS.SUMMARY)"
        :help-text="t(TRANSLATION_KEYS.RESUME.PUBLICATIONS.HELP_TEXT.SUMMARY)"
        @update:model-value="(value) => handleFieldUpdate('summary', value)"
        @blur="validateField('summary', localModel.summary)"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PublicationInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Define a form-specific interface to handle empty string defaults for optional fields
interface PublicationFormModel extends Omit<PublicationInterface, 'url' | 'summary'> {
  url: string;
  summary: string;
}

// Define props
const props = defineProps<{
  modelValue: PublicationInterface
  publicationId?: string
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: PublicationInterface): void
  (e: 'cancel'): void
  (e: 'validate'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction

// Loading state
const loading = ref(false)

// Check if we're creating a new publication or editing an existing one
const isNew = computed(() => !props.publicationId)

// Setup form model using useFormModel composable
const { 
  localModel, 
  updateField 
} = useFormModel<PublicationFormModel>({
  modelValue: computed(() => {
    // Convert from PublicationInterface to PublicationFormModel
    const model = { ...props.modelValue };
    return {
      ...model,
      url: model.url || '',      
      summary: model.summary || ''
    } as PublicationFormModel;
  }),
  emit: (event: 'update:modelValue', value: PublicationFormModel) => {
    // Convert back from PublicationFormModel to PublicationInterface
    const publication: PublicationInterface = {
      name: value.name,
      publisher: value.publisher,
      releaseDate: value.releaseDate,
      // Only include non-empty values for optional fields
      ...(value.url ? { url: value.url } : {}),
      ...(value.summary ? { summary: value.summary } : {})
    };
    emit(event, publication);
  },
  defaultValues: {
    name: '',
    publisher: '',
    releaseDate: '',
    url: '',      
    summary: ''    
  } 
})

// Setup validation
const { 
  errors, 
  validateField, 
  validateForm 
} = useValidation<PublicationFormModel>(undefined, {
  requiredFields: ['name', 'publisher', 'releaseDate']
})

// Handle field updates
const handleFieldUpdate = (field: keyof PublicationFormModel, value: string) => {
  updateField(field, value)
  validateField(field, value)
}

// Handle form submission
const handleSubmit = async () => {
  // Validate all required fields
  const formIsValid = validateForm(localModel)
  
  if (formIsValid) {
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Form field icons
const icons = {
  name: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  publisher: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M7 7h10"></path><path d="M7 12h10"></path><path d="M7 17h10"></path></svg>',
  date: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  url: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  description: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>'
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 