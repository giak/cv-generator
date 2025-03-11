/**
 * Validation Module
 * 
 * Ce module exporte tous les composables et utilitaires liés à la validation
 * basée sur le Result/Option Pattern pour l'application CV Generator.
 */

// Composables principaux
export { 
  useValidationResult,
  type ValidationResultOptionsInterface,
  type FieldValidationStateInterface,
  type UseValidationResultReturnInterface
} from './useValidationResult';

export {
  useValidationCatalogue,
  type ValidationCatalogueOptionsInterface,
  type ValidationCatalogueReturnInterface
} from './useValidationCatalogue';

// Réexporter l'ancien composable pour compatibilité
export { useValidation } from '../useValidation';

// Utilitaires spécifiques à Vue
export * from '../../helpers/result-handlers.utils';

// Export validation examples
export { default as ValidationExample } from '../../components/examples/ValidationExample.vue'
export { default as ValidationFormExample } from '../../components/examples/ValidationFormExample.vue'
export { default as CombinedFormExample } from '../../components/examples/CombinedFormExample.vue'
export { default as AdvancedValidationExample } from '../../components/examples/AdvancedValidationExample.vue'

// Export validation types
export type { ValidationErrorInterface, ValidationSeverityType, ResultType, FormValidationResultType } from '@cv-generator/shared';

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