<template>
  <Form 
    :loading="loading"
    :title="isNew ? safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.FORM.ADD_TITLE, 'Ajouter une certification') : safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.FORM.EDIT_TITLE, 'Modifier la certification')"
    :subtitle="isNew ? safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.FORM.ADD_SUBTITLE, 'Détaillez les certifications professionnelles que vous avez obtenues.') : safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.FORM.EDIT_SUBTITLE, 'Mettez à jour les détails de cette certification.')"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        :label="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.LABELS.NAME, 'Nom du certificat')"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.name"
        :placeholder="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.PLACEHOLDERS.NAME, 'Ex: AWS Certified Solutions Architect')"
        :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.HELP_TEXT.NAME, 'Nom ou titre de la certification obtenue.')"
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', localModel.name)"
      />

      <FormField
        name="issuer"
        :label="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.LABELS.ISSUER, 'Organisme émetteur')"
        :model-value="localModel.issuer"
        :error="errors.issuer"
        :icon="icons.issuer"
        :placeholder="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.PLACEHOLDERS.ISSUER, 'Ex: Amazon Web Services')"
        :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.HELP_TEXT.ISSUER, 'Organisation ayant délivré la certification.')"
        required
        @update:model-value="handleFieldUpdate('issuer', $event)"
        @blur="validateField('issuer', localModel.issuer)"
      />

      <FormField
        name="date"
        :label="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.LABELS.DATE, 'Date d\'obtention')"
        :model-value="localModel.date"
        :error="errors.date"
        :icon="icons.date"
        :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.HELP_TEXT.DATE, 'Date à laquelle vous avez obtenu cette certification.')"
        required
        @update:model-value="handleFieldUpdate('date', $event)"
        @blur="validateField('date', localModel.date)"
      />

      <FormField
        name="url"
        type="url"
        :label="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.LABELS.URL, 'URL de vérification')"
        :model-value="localModel.url || ''"
        :error="errors.url"
        :icon="icons.url"
        :placeholder="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.PLACEHOLDERS.URL, 'Ex: https://www.credential.net/certification/123456')"
        :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.CERTIFICATES.HELP_TEXT.URL, 'Lien vers la vérification en ligne de la certification (optionnel).')"
        @update:model-value="handleFieldUpdate('url', $event)"
        @blur="validateField('url', localModel.url || '')"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-8">
      <button 
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="handleCancel"
      >
        {{ safeTranslate(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL, 'Annuler') }}
      </button>
      <button 
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
      >
        {{ isNew ? safeTranslate(TRANSLATION_KEYS.COMMON.ACTIONS.ADD, 'Ajouter') : safeTranslate(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE, 'Enregistrer') }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { CertificateInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

interface Props {
  modelValue: CertificateInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// i18n support
const { t } = useI18n()
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key)
    return translation !== key ? translation : fallback
  } catch (e) {
    return fallback
  }
}

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: CertificateInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Setup form model using useFormModel composable
const {
  localModel,
  updateField
} = useFormModel<CertificateInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues: {
    name: '',
    date: '',
    issuer: '',
    url: ''
  }
})

// Setup form validation using useValidation composable
const {
  errors,
  validateField,
  validateForm
} = useValidation<CertificateInterface>(undefined, {
  requiredFields: ['name', 'date', 'issuer']
})

// Handle field updates
const handleFieldUpdate = (field: keyof CertificateInterface, value: string) => {
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
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path><path d="M9 12l2 2 4-4"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  issuer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 