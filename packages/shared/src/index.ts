/**
 * Exports centralisés pour le module shared
 */

// Types
export type {
  ResultType,
  SuccessType,
  FailureType,
  OptionType,
  FormValidationResultType
} from './types/result.type';

export type {
  ValidationSeverityType,
  ValidationErrorInterface,
  HelpMessageInterface
} from './types/validation.interface';

// Enums
export { ValidationLayerType } from './enums/validation.enum';

// Utilitaires
export {
  createSuccess,
  createFailure,
  createSuccessWithWarnings,
  isSuccess,
  isFailure,
  map,
  flatMap,
  getErrorsForField,
  combineValidationResults
} from './utils/result.utils';

// Utilitaires Zod
export { zodToResult } from './utils/zod-adapter';

// Constantes
export { ERROR_CODES } from './constants/error-codes.const';
export type { ErrorCodeType } from './constants/error-codes.const';

// Internationalisation
export { TRANSLATION_KEYS } from './i18n/keys';
export type { TranslationKeyType } from './i18n/keys';
export { 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE, 
  LOCALE_NAMES 
} from './i18n/constants/supported-locales';
export type { SupportedLocale } from './i18n/constants/supported-locales'; 