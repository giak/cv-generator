/**
 * Exports centralisés pour le module shared
 */
export type { ResultType, SuccessType, FailureType, OptionType, FormValidationResultType } from './types/result.type';
export type { ValidationSeverityType, ValidationErrorInterface, HelpMessageInterface } from './types/validation.interface';
export { ValidationLayerType } from './enums/validation.enum';
export { createSuccess, createFailure, createSuccessWithWarnings, isSuccess, isFailure, map, flatMap, getErrorsForField, combineValidationResults } from './utils/result.utils';
export { zodToResult } from './utils/zod-adapter';
export { ERROR_CODES } from './constants/error-codes.const';
export type { ErrorCodeType } from './constants/error-codes.const';
