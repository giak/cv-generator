<script setup lang="ts">
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useFieldValidation'
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

const { errors, validateField, validateForm } = useFieldValidation()

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
  emit('update:modelValue', updatedData)
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
</script>

<template>
  <Form 
    :loading="loading"
    @submit="handleSubmit"
  >
    <FormField
      name="name"
      label="Nom"
      :model-value="formModel.name"
      :error="errors.name"
      required
      @update:model-value="handleFieldUpdate('name', $event)"
      @blur="validateField('name', formModel.name)"
    />

    <FormField
      name="email"
      type="email"
      label="Email"
      :model-value="formModel.email"
      :error="errors.email"
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
      @update:model-value="handleFieldUpdate('phone', $event)"
      @blur="validateField('phone', formModel.phone)"
    />

    <FormField
      name="label"
      label="Titre"
      :model-value="formModel.label"
      @update:model-value="handleFieldUpdate('label', $event)"
    />
  </Form>
</template> 