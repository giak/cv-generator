import { ref, Ref } from 'vue'
import { z } from 'zod'
import debounce from 'lodash/debounce'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Email } from '@cv-generator/core'

interface ValidationOptions {
  debounce?: number
  formatError?: (error: z.ZodError) => string
}

interface ValidationResult {
  validate: (value: any) => void
  validateField: (field: string, value: any) => boolean
  validateForm: (data: Record<string, any>) => boolean
  error: Ref<string>
  errors: Ref<Record<string, string>>
  isValid: Ref<boolean>
  isDirty: Ref<boolean>
}

const defaultFormatError = (error: z.ZodError): string => {
  return error.errors[0]?.message || ''
}

export function useFieldValidation(
  schema?: z.ZodType,
  options: ValidationOptions = {}
): ValidationResult {
  const error = ref('')
  const errors = ref<Record<string, string>>({})
  const isValid = ref(false)
  const isDirty = ref(false)

  const formatError = options.formatError || defaultFormatError

  const validateValue = (value: any) => {
    if (!schema) return true
    isDirty.value = true
    try {
      schema.parse(value)
      error.value = ''
      isValid.value = true
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        error.value = formatError(err)
        isValid.value = false
      }
      return false
    }
  }

  const validate = options.debounce
    ? debounce(validateValue, options.debounce)
    : validateValue

  // Legacy validation methods
  const validateField = (field: string, value: any): boolean => {
    if (field === 'name' && (!value || value.length < 2)) {
      errors.value[field] = 'Le nom est requis'
      return false
    }
    if (field === 'email') {
      if (!value) {
        errors.value[field] = 'L\'email est requis'
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors.value[field] = 'Format email invalide'
        return false
      }
    }
    delete errors.value[field]
    return true
  }

  const validateForm = (data: Record<string, any>): boolean => {
    let isValid = true
    errors.value = {}

    Object.entries(data).forEach(([field, value]) => {
      if (!validateField(field, value)) {
        isValid = false
      }
    })

    return isValid
  }

  return {
    validate,
    validateField,
    validateForm,
    error,
    errors,
    isValid,
    isDirty
  }
} 