<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une certification' : 'Modifier la certification'"
    :subtitle="isNew ? 'Détaillez les certifications professionnelles que vous avez obtenues.' : 'Mettez à jour les détails de cette certification.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom du certificat"
        :model-value="formModel.name"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: AWS Certified Solutions Architect"
        help-text="Nom ou titre de la certification obtenue."
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', formModel.name)"
      />

      <FormField
        name="issuer"
        label="Organisme émetteur"
        :model-value="formModel.issuer"
        :error="errors.issuer"
        :icon="icons.issuer"
        placeholder="Ex: Amazon Web Services"
        help-text="Organisation ayant délivré la certification."
        required
        @update:model-value="handleFieldUpdate('issuer', $event)"
        @blur="validateField('issuer', formModel.issuer)"
      />

      <FormField
        name="date"
        label="Date d'obtention"
        :model-value="formModel.date"
        :error="errors.date"
        :icon="icons.date"
        help-text="Date à laquelle vous avez obtenu cette certification."
        required
        @update:model-value="handleFieldUpdate('date', $event)"
        @blur="validateField('date', formModel.date)"
      />

      <FormField
        name="url"
        type="url"
        label="URL de vérification"
        :model-value="formModel.url"
        :error="errors.url"
        :icon="icons.url"
        placeholder="Ex: https://www.credential.net/certification/123456"
        help-text="Lien vers la vérification en ligne de la certification (optionnel)."
        @update:model-value="handleFieldUpdate('url', $event)"
        @blur="validateField('url', formModel.url)"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-8">
      <button 
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="handleCancel"
      >
        Annuler
      </button>
      <button 
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
      >
        {{ isNew ? 'Ajouter' : 'Enregistrer' }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { CertificateInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, ref } from 'vue'

interface Props {
  modelValue: CertificateInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: CertificateInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a local form model
const formModel = computed(() => ({
  name: props.modelValue.name || '',
  date: props.modelValue.date || '',
  issuer: props.modelValue.issuer || '',
  url: props.modelValue.url || ''
}))

// Form validation setup
const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate({
  emit: emit as (event: string, ...args: any[]) => void,
  modelValue: computed(() => props.modelValue)
})

// Update field handler
const handleFieldUpdate = (field: keyof CertificateInterface, value: string) => {
  console.log(`Updating certificate field ${String(field)} with value:`, value)
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting certificate update with data:', updatedData)
  emit('update:modelValue', updatedData)
}

// Handle form submission
const handleSubmit = async () => {
  console.log('Certificate form submission - Current model:', JSON.stringify(props.modelValue))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Check that required fields are present
    if (!props.modelValue.name || !props.modelValue.date || !props.modelValue.issuer) {
      console.error('Required fields missing:', {
        name: !props.modelValue.name,
        date: !props.modelValue.date,
        issuer: !props.modelValue.issuer
      })
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
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path><path d="M9 12l2 2 4-4"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  issuer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 