<script setup lang="ts">
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation as useCVFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, reactive, watch } from 'vue'

interface Props {
  modelValue: BasicsInterface
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: BasicsInterface): void
  (e: 'validate'): void
}>()

// Create a computed model for form fields
const formModel = computed(() => ({
  name: props.modelValue.name || '',
  email: props.modelValue.email || '',
  label: props.modelValue.label || '',
  phone: props.modelValue.phone || '',
  url: props.modelValue.url || '',
  summary: props.modelValue.summary || '',
  location: props.modelValue.location ? { ...props.modelValue.location } : {
    address: '',
    postalCode: '',
    city: '',
    region: ''
  },
  profiles: [...(props.modelValue.profiles || [])]
}))

const { errors, validateField, validateForm } = useCVFieldValidation()
const { updateField } = useModelUpdate({ emit, modelValue: computed(() => props.modelValue) })

// Update field handler
const handleFieldUpdate = (field: keyof BasicsInterface, value: string) => {
  console.log(`Updating field ${field} with value:`, value)
  
  // Update local model
  if (field === 'location' || field === 'profiles') {
    return // Ces champs ne sont pas modifiables directement
  }
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting update with data:', updatedData)
  updateField(field, value)
}

// Validate form before emitting validate event
const handleSubmit = async () => {
  console.log('Form submission - Current model:', JSON.parse(JSON.stringify(props.modelValue)))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Ensure all required fields are present
    if (!props.modelValue.name || !props.modelValue.email) {
      console.error('Required fields missing:', {
        name: !props.modelValue.name,
        email: !props.modelValue.email
      })
      return
    }
    
    emit('validate')
  }
}

// Log model changes
watch(() => props.modelValue, (newValue) => {
  console.log('Model updated:', JSON.parse(JSON.stringify(newValue)))
}, { deep: true })

// Icônes SVG pour les champs
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    title="Informations personnelles"
    subtitle="Complétez vos informations pour créer un CV professionnel."
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom complet"
        :model-value="formModel.name"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: Jean Dupont"
        help-text="Votre nom et prénom comme ils apparaîtront sur votre CV."
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', formModel.name)"
      />

      <FormField
        name="email"
        type="email"
        label="Adresse email"
        :model-value="formModel.email"
        :error="errors.email"
        :icon="icons.email"
        placeholder="Ex: jean.dupont@example.com"
        help-text="Email professionnel pour les employeurs potentiels."
        required
        @update:model-value="handleFieldUpdate('email', $event)"
        @blur="validateField('email', formModel.email)"
      />

      <FormField
        name="phone"
        type="tel"
        label="Téléphone"
        :model-value="formModel.phone"
        :error="errors.phone"
        :icon="icons.phone"
        placeholder="Ex: 0612345678"
        help-text="Numéro de téléphone où vous êtes joignable."
        @update:model-value="handleFieldUpdate('phone', $event)"
        @blur="validateField('phone', formModel.phone)"
      />

      <FormField
        name="label"
        label="Titre professionnel"
        :model-value="formModel.label"
        :icon="icons.label"
        placeholder="Ex: Développeur Web Senior"
        help-text="Votre position ou titre actuel."
        @update:model-value="handleFieldUpdate('label', $event)"
      />
      
      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          label="Site Web"
          :model-value="formModel.url"
          :error="errors.url"
          :icon="icons.url"
          placeholder="Ex: https://monportfolio.com"
          help-text="URL de votre portfolio ou site personnel (optionnel)."
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateField('url', formModel.url)"
        />
      </div>
    </div>
    
    <!-- Section pour les informations supplémentaires (désactivée pour l'instant) -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4">Informations supplémentaires</h3>
      <p class="text-sm text-neutral-400 mb-4">
        Cette section vous permet d'ajouter d'autres détails à votre CV, comme votre adresse, un résumé professionnel ou vos profils sur les réseaux sociaux. Ces fonctionnalités seront disponibles prochainement.
      </p>
    </div>
  </Form>
</template> 