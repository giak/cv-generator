import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { computed } from 'vue'

export type EmitFn = (event: 'update:modelValue', value: BasicsInterface) => void

/**
 * Composable for handling model updates in form components
 * @param emit - Vue emit function for v-model updates
 * @param getCurrentModel - Function to get current model value
 * @returns Object containing update methods
 */
export function useModelUpdate(emit: EmitFn, getCurrentModel: () => BasicsInterface) {
  /**
   * Updates a single field in the model while preserving other values
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateField = (field: keyof BasicsInterface, value: string) => {
    console.log(`Updating field ${field} with value:`, value)
    
    // Get current model value
    const currentModel = getCurrentModel()
    console.log('Current model before update:', currentModel)
    
    // Create a new object with all current values
    const updatedModel = {
      ...currentModel,
      [field]: value,
      location: { ...currentModel.location },
      profiles: [...(currentModel.profiles || [])]
    }
    
    console.log('Updated model:', updatedModel)
    
    // Emit the update
    emit('update:modelValue', updatedModel)
  }

  return {
    updateField
  }
} 