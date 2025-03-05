/**
 * Validation Module
 * 
 * This module exports all validation-related composables and utilities
 * for form validation in the CV Generator application.
 */

// Export the main validation composable
export { useValidation } from '../useValidation'

// Export validation examples
export { default as ValidationExample } from '../../components/examples/ValidationExample.vue'
export { default as ValidationFormExample } from '../../components/examples/ValidationFormExample.vue'
export { default as CombinedFormExample } from '../../components/examples/CombinedFormExample.vue'
export { default as AdvancedValidationExample } from '../../components/examples/AdvancedValidationExample.vue'

// Export validation types
export type { 
  ValidationOptions,
  ValidationResult
} from '../useValidation'

/**
 * Validation Module Usage
 * 
 * This module provides a comprehensive solution for form validation
 * in Vue 3 applications using Zod for schema validation.
 * 
 * Basic usage:
 * ```typescript
 * import { useValidation } from '@ui/modules/cv/presentation/composables/validation'
 * import { z } from 'zod'
 * 
 * const schema = z.object({
 *   name: z.string().min(2, 'Name must be at least 2 characters'),
 *   email: z.string().email('Invalid email format')
 * })
 * 
 * const { validateField, validateForm, errors, isValid } = useValidation(schema, {
 *   requiredFields: ['name', 'email']
 * })
 * ```
 * 
 * See the README.md file for more detailed documentation.
 */ 