import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

export type EmitFn = (event: 'update:modelValue', value: BasicsInterface) => void

export function useModelUpdate(emit: EmitFn, modelValue: BasicsInterface) {
  const updateField = (field: keyof BasicsInterface, value: string) => {
    emit('update:modelValue', {
      ...modelValue,
      [field]: value
    })
  }

  return {
    updateField
  }
} 