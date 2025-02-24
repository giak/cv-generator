import { ref } from 'vue'
import type { z } from 'zod'
import { debounce as _debounce } from 'lodash-es'

export interface ValidationOptions {
  debounce?: number
}

export function useFieldValidation<T extends z.ZodType>(
  schema: T,
  options: ValidationOptions = {}
) {
  const error = ref('')
  const isValid = ref(false)
  const isDirty = ref(false)

  const validateValue = async (value: unknown) => {
    isDirty.value = true
    
    if (value === undefined || value === '') {
      if (schema.isOptional()) {
        error.value = ''
        isValid.value = true
        return true
      }
    }

    const result = await schema.safeParseAsync(value)

    if (!result.success) {
      error.value = result.error.errors[0]?.message || 'Invalid value'
      isValid.value = false
      return false
    }

    error.value = ''
    isValid.value = true
    return true
  }

  const validate = options.debounce
    ? _debounce(validateValue, options.debounce)
    : validateValue

  return {
    error,
    isValid,
    isDirty,
    validate
  }
} 