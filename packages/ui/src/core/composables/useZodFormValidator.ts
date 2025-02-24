import { ref } from 'vue'
import type { z } from 'zod'

export interface FormErrors {
  [key: string]: string | undefined
}

export function useFormValidation<T extends z.ZodObject<any>>(schema: T) {
  const errors = ref<FormErrors>({})
  const isValid = ref(false)
  const isDirty = ref(false)

  const validate = async (data: unknown) => {
    isDirty.value = true
    const result = await schema.safeParseAsync(data)

    if (!result.success) {
      errors.value = result.error.errors.reduce((acc, error) => {
        const path = error.path[0] as string
        acc[path] = error.message
        return acc
      }, {} as FormErrors)
      isValid.value = false
      return false
    }

    errors.value = {}
    isValid.value = true
    return true
  }

  const validateField = async (field: keyof z.infer<T>, value: unknown) => {
    isDirty.value = true
    const fieldSchema = schema.shape[field] as z.ZodType

    const result = await fieldSchema.safeParseAsync(value)
    if (!result.success) {
      errors.value = {
        ...errors.value,
        [field]: result.error.errors[0]?.message
      }
      isValid.value = false
      return false
    }

    errors.value = {
      ...errors.value,
      [field]: undefined
    }
    
    // Check if there are any remaining errors
    isValid.value = !Object.values(errors.value).some(error => error !== undefined)
    return true
  }

  return {
    errors,
    isValid,
    isDirty,
    validate,
    validateField
  }
} 