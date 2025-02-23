import { ref } from 'vue'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Email } from '@cv-generator/core'

export interface ValidationErrors {
  [key: string]: string
}

/**
 * Composable for handling form field validation
 * @returns Object containing validation methods and error state
 */
export function useFieldValidation() {
  const errors = ref<ValidationErrors>({})

  /**
   * Validates a single field
   * @param field - Field name to validate
   * @param value - Field value to validate
   * @returns boolean indicating if field is valid
   */
  const validateField = (field: keyof BasicsInterface, value: string | undefined) => {
    // Clear existing error for this field
    if (field in errors.value) {
      delete errors.value[field]
    }

    // Required field validation
    if (!value) {
      if (field === 'name') {
        errors.value[field] = 'Le nom est requis'
        return false
      }
      if (field === 'email') {
        errors.value[field] = 'L\'email est requis'
        return false
      }
    }

    // Email format validation
    if (field === 'email' && value) {
      const emailResult = Email.create(value)
      if (emailResult.isFailure) {
        errors.value[field] = emailResult.error
        return false
      }
    }

    return true
  }

  /**
   * Validates the entire form
   * @param data - Form data to validate
   * @returns boolean indicating if form is valid
   */
  const validateForm = (data: BasicsInterface) => {
    let isValid = true
    
    // Validate required fields
    isValid = validateField('name', data.name) && isValid
    isValid = validateField('email', data.email) && isValid
    
    return isValid
  }

  return {
    errors,
    validateField,
    validateForm
  }
} 