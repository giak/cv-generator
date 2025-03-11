/**
 * Exports centralisés pour le module shared
 */
// Enums
export { ValidationLayerType } from './enums/validation.enum';
// Utilitaires
export { createSuccess, createFailure, createSuccessWithWarnings, isSuccess, isFailure, map, flatMap, getErrorsForField, combineValidationResults } from './utils/result.utils';
// Utilitaires Zod
export { zodToResult } from './utils/zod-adapter';
// Constantes
export { ERROR_CODES } from './constants/error-codes.const';
