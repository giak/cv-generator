/**
 * useValidation.ts
 * 
 * A composable for managing form validation in Vue components.
 * This composable provides a unified approach to form validation with:
 * 1. Schema-based validation using Zod
 * 2. Field-level validation with error tracking
 * 3. Form-level validation
 * 4. Support for required fields, email format, and custom validations
 * 5. Performance tracking for validation operations
 */

import { ref, Ref, computed } from 'vue'
import { z } from 'zod'
import { debounce, DebouncedFunc } from 'lodash-es'

export interface ValidationOptions {
  /**
   * Debounce time in milliseconds for validation
   */
  debounceTime?: number
  
  /**
   * Custom error formatter function
   */
  formatError?: (error: z.ZodError) => string
  
  /**
   * Whether to enable performance logging
   */
  enableLogging?: boolean
  
  /**
   * Required fields that must be present
   */
  requiredFields?: string[]
}

export interface ValidationResult<T extends Record<string, any>> {
  /**
   * Validate a single value against the schema
   */
  validateValue: (value: any) => boolean | void
  
  /**
   * Validate a specific field
   */
  validateField: (field: keyof T, value: any) => boolean
  
  /**
   * Validate the entire form
   */
  validateForm: (data: T) => boolean
  
  /**
   * Check if all required fields are present
   */
  checkRequiredFields: (data: T) => { valid: boolean, missing: string[] }
  
  /**
   * Current validation error
   */
  error: Ref<string>
  
  /**
   * Field-specific errors
   */
  errors: Ref<Record<string, string>>
  
  /**
   * Whether the form is valid
   */
  isValid: Ref<boolean>
  
  /**
   * Whether the form has been modified
   */
  isDirty: Ref<boolean>
  
  /**
   * Performance metrics (if logging is enabled)
   */
  perfMetrics?: {
    validationCount: number
    validationTime: number
  }
}

/**
 * Default error formatter for Zod errors
 */
const defaultFormatError = (error: z.ZodError): string => {
  return error.errors[0]?.message || 'Validation error'
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Composable for form validation
 */
export function useValidation<T extends Record<string, any>>(
  schema?: z.ZodType,
  options: ValidationOptions = {}
): ValidationResult<T> {
  const {
    debounceTime,
    formatError = defaultFormatError,
    enableLogging = false,
    requiredFields = []
  } = options
  
  // Reactive state
  const error = ref('')
  const errors = ref<Record<string, string>>({})
  const isValid = ref(false)
  const isDirty = ref(false)
  
  // Performance metrics
  const perfMetrics = enableLogging ? {
    validationCount: 0,
    validationTime: 0
  } : undefined
  
  /**
   * Validate a value against the schema
   */
  const validateValue = (value: any): boolean => {
    if (!schema) return true
    
    isDirty.value = true
    let startTime = 0
    
    if (enableLogging && perfMetrics) {
      startTime = performance.now()
      perfMetrics.validationCount++
    }
    
    try {
      schema.parse(value)
      error.value = ''
      isValid.value = true
      
      if (enableLogging && perfMetrics) {
        perfMetrics.validationTime += performance.now() - startTime
        console.log(`Validation #${perfMetrics.validationCount} took ${performance.now() - startTime}ms`)
      }
      
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        error.value = formatError(err)
        isValid.value = false
      }
      
      if (enableLogging && perfMetrics) {
        perfMetrics.validationTime += performance.now() - startTime
        console.log(`Validation #${perfMetrics.validationCount} failed in ${performance.now() - startTime}ms`)
      }
      
      return false
    }
  }
  
  /**
   * Debounced validation if debounceTime is provided
   */
  const debouncedValidate: (value: any) => boolean | void = debounceTime
    ? debounce(validateValue, debounceTime)
    : validateValue
  
  /**
   * Validate a specific field
   */
  const validateField = (field: keyof T, value: any): boolean => {
    if (enableLogging) {
      console.log(`Validating field ${String(field)} with value:`, value)
    }
    
    // Check if field is required
    if (requiredFields.includes(String(field)) && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.value[String(field)] = `Le champ ${String(field)} est requis`
      return false
    }
    
    // Email validation
    if (field === 'email' && value) {
      if (!EMAIL_REGEX.test(value)) {
        errors.value[String(field)] = 'Format email invalide'
        return false
      }
    }
    
    // Clear error if validation passes
    delete errors.value[String(field)]
    return true
  }
  
  /**
   * Validate the entire form
   */
  const validateForm = (data: T): boolean => {
    if (enableLogging) {
      console.log('Validating form with data:', data)
    }
    
    let isFormValid = true
    errors.value = {}
    
    // Validate each field
    Object.entries(data).forEach(([field, value]) => {
      if (!validateField(field as keyof T, value)) {
        isFormValid = false
      }
    })
    
    // Check required fields
    const requiredCheck = checkRequiredFields(data)
    if (!requiredCheck.valid) {
      isFormValid = false
      
      // Add missing required fields to errors
      requiredCheck.missing.forEach(field => {
        errors.value[field] = `Le champ ${field} est requis`
      })
    }
    
    return isFormValid
  }
  
  /**
   * Check if all required fields are present
   */
  const checkRequiredFields = (data: T): { valid: boolean, missing: string[] } => {
    const missing: string[] = []
    
    requiredFields.forEach(field => {
      const value = data[field as keyof T]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missing.push(field)
      }
    })
    
    return {
      valid: missing.length === 0,
      missing
    }
  }
  
  return {
    validateValue: debouncedValidate,
    validateField,
    validateForm,
    checkRequiredFields,
    error,
    errors,
    isValid,
    isDirty,
    perfMetrics
  }
} 