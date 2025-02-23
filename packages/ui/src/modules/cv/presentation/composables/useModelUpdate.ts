import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { computed, toRef } from 'vue'

export type EmitFn = (event: 'update:modelValue', value: BasicsInterface) => void

/**
 * Composable for handling model updates in form components
 * @param emit - Vue emit function for v-model updates
 * @param modelValue - Current model value
 * @returns Object containing update methods
 */
export function useModelUpdate(emit: EmitFn, modelValue: BasicsInterface) {
  // Create a reactive reference to the model
  const model = computed(() => modelValue)

  /**
   * Updates a single field in the model while preserving other values
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateField = (field: keyof BasicsInterface, value: string) => {
    // Emit the update with all fields preserved
    emit('update:modelValue', {
      name: field === 'name' ? value : model.value.name ?? '',
      email: field === 'email' ? value : model.value.email ?? '',
      label: field === 'label' ? value : model.value.label ?? '',
      phone: field === 'phone' ? value : model.value.phone ?? '',
      url: field === 'url' ? value : model.value.url ?? '',
      summary: field === 'summary' ? value : model.value.summary ?? '',
      location: model.value.location,
      profiles: model.value.profiles
    })
  }

  return {
    updateField
  }
} 