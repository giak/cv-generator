<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une publication' : 'Modifier la publication'"
    :subtitle="isNew ? 'Détaillez vos publications professionnelles, livres, articles ou autres travaux publiés.' : 'Mettez à jour les détails de cette publication.'"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom de la publication"
        :model-value="formModel.name"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: Architecture moderne des applications web"
        help-text="Titre de votre publication ou article."
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', formModel.name)"
      />

      <FormField
        name="publisher"
        label="Éditeur"
        :model-value="formModel.publisher"
        :error="errors.publisher"
        :icon="icons.publisher"
        placeholder="Ex: Éditions Techniques"
        help-text="Nom de l'éditeur ou de la plateforme de publication."
        required
        @update:model-value="handleFieldUpdate('publisher', $event)"
        @blur="validateField('publisher', formModel.publisher)"
      />

      <FormField
        name="releaseDate"
        label="Date de publication"
        :model-value="formModel.releaseDate"
        :error="errors.releaseDate"
        :icon="icons.releaseDate"
        help-text="Date à laquelle votre travail a été publié."
        required
        @update:model-value="handleFieldUpdate('releaseDate', $event)"
        @blur="validateField('releaseDate', formModel.releaseDate)"
      />

      <FormField
        name="url"
        type="url"
        label="URL de la publication"
        :model-value="formModel.url"
        :error="errors.url"
        :icon="icons.url"
        placeholder="Ex: https://exemple.com/publication"
        help-text="Lien vers la publication en ligne (optionnel)."
        @update:model-value="handleFieldUpdate('url', $event)"
        @blur="validateField('url', formModel.url)"
      />
    </div>

    <!-- Summary field - full width -->
    <div class="mt-6">
      <FormField
        name="summary"
        label="Résumé"
        :model-value="formModel.summary"
        :error="errors.summary"
        :icon="icons.summary"
        placeholder="Décrivez brièvement le contenu de votre publication..."
        help-text="Un court résumé du contenu de votre publication (optionnel)."
        @update:model-value="handleFieldUpdate('summary', $event)"
        @blur="validateField('summary', formModel.summary)"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { PublicationInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, ref } from 'vue'

interface Props {
  modelValue: PublicationInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: PublicationInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a local form model
const formModel = computed(() => ({
  name: props.modelValue.name || '',
  publisher: props.modelValue.publisher || '',
  releaseDate: props.modelValue.releaseDate || '',
  url: props.modelValue.url || '',
  summary: props.modelValue.summary || ''
}))

// Form validation setup
const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate({
  emit: emit as (event: string, ...args: any[]) => void,
  modelValue: computed(() => props.modelValue)
})

// Update field handler
const handleFieldUpdate = (field: keyof PublicationInterface, value: string) => {
  console.log(`Updating publication field ${String(field)} with value:`, value)
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting publication update with data:', updatedData)
  emit('update:modelValue', updatedData)
}

// Handle form submission
const handleSubmit = async () => {
  console.log('Publication form submission - Current model:', JSON.stringify(props.modelValue))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Check that required fields are present
    if (!props.modelValue.name || !props.modelValue.publisher || !props.modelValue.releaseDate) {
      console.error('Required fields missing:', {
        name: !props.modelValue.name,
        publisher: !props.modelValue.publisher,
        releaseDate: !props.modelValue.releaseDate
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
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  publisher: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  releaseDate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
}
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style> 