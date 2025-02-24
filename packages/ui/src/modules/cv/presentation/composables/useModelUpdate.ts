import { Ref } from 'vue'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { computed } from 'vue'

interface ModelUpdateOptions {
  emit: (event: string, ...args: any[]) => void
  modelValue: Ref<Record<string, any>>
}

/**
 * Composable for handling model updates in form components
 * @param emit - Vue emit function for v-model updates
 * @param getCurrentModel - Function to get current model value
 * @returns Object containing update methods
 */
export function useModelUpdate({ emit, modelValue }: ModelUpdateOptions) {
  /**
   * Updates a single field in the model while preserving other values
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateField = (field: string, value: any) => {
    console.log(`Updating field ${field} with value: ${value}`)
    
    // Get current model value
    const currentModel = modelValue.value
    console.log('Current model before update:', currentModel)
    
    // Create updated model
    const updatedModel = {
      ...currentModel,
      [field]: value
    }
    
    // Emit update event
    console.log('Emitting update with data:', updatedModel)
    emit('update:modelValue', updatedModel)
  }

  return {
    updateField
  }
} 