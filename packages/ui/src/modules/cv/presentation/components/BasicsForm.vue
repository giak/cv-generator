<script setup lang="ts">
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed } from 'vue'

interface Props {
  modelValue: BasicsInterface
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: BasicsInterface): void
  (e: 'validate'): void
}>()

// Create a computed reference to ensure reactivity
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate(emit, model.value)

const handleSubmit = async () => {
  const formIsValid = validateForm(model.value)
  if (formIsValid) {
    emit('validate')
  }
}
</script>

<template>
  <Form 
    :loading="loading"
    @submit="handleSubmit"
  >
    <FormField
      name="name"
      label="Nom"
      :model-value="model.name"
      :error="errors.name"
      required
      @update:model-value="updateField('name', $event)"
      @blur="validateField('name', model.name)"
    />

    <FormField
      name="email"
      type="email"
      label="Email"
      :model-value="model.email"
      :error="errors.email"
      required
      @update:model-value="updateField('email', $event)"
      @blur="validateField('email', model.email)"
    />

    <FormField
      name="label"
      label="Titre"
      :model-value="model.label"
      @update:model-value="updateField('label', $event)"
    />
  </Form>
</template> 