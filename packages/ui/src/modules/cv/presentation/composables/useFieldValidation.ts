import { ref } from 'vue'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Email } from '@cv-generator/core'

export function useFieldValidation() {
  const errors = ref<Record<string, string>>({})

  const validateField = (field: keyof BasicsInterface, value: string | undefined) => {
    if (field in errors.value) {
      delete errors.value[field]
    }

    // Validation des champs requis
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

    // Validation spécifique par type
    if (field === 'email' && value) {
      const emailResult = Email.create(value)
      if (emailResult.isFailure) {
        errors.value[field] = emailResult.error
        return false
      }
    }

    return true
  }

  const validateForm = (data: BasicsInterface) => {
    let isValid = true
    
    // Valider les champs requis
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