<script setup lang="ts">
import type { AwardInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, ref } from 'vue'

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

// Create a local form model
const formModel = computed(() => ({
  title: props.modelValue.title || '',
  date: props.modelValue.date || '',
  awarder: props.modelValue.awarder || '',
  summary: props.modelValue.summary || ''
}))

// Form validation setup
const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate({
  emit: emit as (event: string, ...args: any[]) => void,
  modelValue: computed(() => props.modelValue)
})

// Update field handler
const handleFieldUpdate = (field: keyof AwardInterface, value: string) => {
  console.log(`Updating award field ${String(field)} with value:`, value)
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting award update with data:', updatedData)
  emit('update:modelValue', updatedData)
}

// Handle form submission
const handleSubmit = async () => {
  console.log('Award form submission - Current model:', JSON.stringify(props.modelValue))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Check that required fields are present
    if (!props.modelValue.title || !props.modelValue.date || !props.modelValue.awarder) {
      console.error('Required fields missing:', {
        title: !props.modelValue.title,
        date: !props.modelValue.date,
        awarder: !props.modelValue.awarder
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
  title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  awarder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter un prix ou une distinction' : 'Modifier le prix ou la distinction'"
    :subtitle="isNew ? 'Détaillez les prix et distinctions que vous avez reçus.' : 'Mettez à jour les détails de ce prix ou distinction.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="title"
        label="Titre du prix"
        :model-value="formModel.title"
        :error="errors.title"
        :icon="icons.title"
        placeholder="Ex: Employé du mois"
        help-text="Nom ou titre du prix ou de la distinction reçue."
        required
        @update:model-value="handleFieldUpdate('title', $event)"
        @blur="validateField('title', formModel.title)"
      />

      <FormField
        name="awarder"
        label="Décerné par"
        :model-value="formModel.awarder"
        :error="errors.awarder"
        :icon="icons.awarder"
        placeholder="Ex: Entreprise XYZ"
        help-text="Organisation ou personne ayant décerné le prix."
        required
        @update:model-value="handleFieldUpdate('awarder', $event)"
        @blur="validateField('awarder', formModel.awarder)"
      />

      <FormField
        name="date"
        label="Date d'obtention"
        :model-value="formModel.date"
        :error="errors.date"
        :icon="icons.date"
        help-text="Date à laquelle vous avez reçu ce prix."
        required
        @update:model-value="handleFieldUpdate('date', $event)"
        @blur="validateField('date', formModel.date)"
      />
    </div>

    <!-- Résumé / Summary section -->
    <div class="mt-6">
      <FormField
        name="summary"
        label="Description"
        :model-value="formModel.summary"
        :error="errors.summary"
        :icon="icons.summary"
        placeholder="Ex: Reconnaissance pour l'excellence dans le développement de solutions innovantes..."
        help-text="Brève description du prix et des raisons pour lesquelles il vous a été décerné."
        textarea
        rows="4"
        @update:model-value="handleFieldUpdate('summary', $event)"
        @blur="validateField('summary', formModel.summary)"
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