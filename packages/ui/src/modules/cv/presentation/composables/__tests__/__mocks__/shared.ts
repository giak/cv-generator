/**
 * Mock implementation of shared package for testing
 */

// Types
export type ValidationSeverityType = 'info' | 'warning' | 'error';

export type ValidationLayerType = 'domain' | 'application' | 'presentation';

export interface ValidationErrorInterface {
  code: string;
  message: string;
  field: string;
  severity: ValidationSeverityType;
  layer: ValidationLayerType;
  suggestion?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface HelpMessageInterface {
  id: string;
  title: string;
  content: string;
  field: string;
  autoShow?: boolean;
  examples?: string[];
}

export type SuccessType<T> = {
  success: true;
  value: T;
  warnings?: ValidationErrorInterface[];
};

export type FailureType<E> = {
  success: false;
  error: E;
};

export type ResultType<T, E = ValidationErrorInterface[]> = SuccessType<T> | FailureType<E>;

export type OptionType<T> = T | undefined;

export type FormValidationResultType<T> = ResultType<T, ValidationErrorInterface[]>;

// Utility functions
export const isSuccess = <T, E>(result: ResultType<T, E>): result is SuccessType<T> => {
  return result.success === true;
};

export const isFailure = <T, E>(result: ResultType<T, E>): result is FailureType<E> => {
  return result.success === false;
};

export const createSuccess = <T, E = ValidationErrorInterface[]>(value: T): ResultType<T, E> => {
  return { success: true, value };
};

export const createFailure = <T = unknown, E = ValidationErrorInterface[]>(error: E): ResultType<T, E> => {
  return { success: false, error };
};

export const createSuccessWithWarnings = <T>(
  value: T, 
  warnings: ValidationErrorInterface[]
): ResultType<T, ValidationErrorInterface[]> => {
  return { success: true, value, warnings };
};

export const getErrorsForField = (
  result: FormValidationResultType<unknown>,
  fieldName: string
): ValidationErrorInterface[] => {
  if (isSuccess(result)) return [];
  return result.error.filter((err) => err.field === fieldName);
};

// Error codes
export const ERROR_CODES = {
  COMMON: {
    REQUIRED_FIELD: 'COMMON.REQUIRED_FIELD',
    INVALID_FORMAT: 'COMMON.INVALID_FORMAT',
    TOO_SHORT: 'COMMON.TOO_SHORT',
    TOO_LONG: 'COMMON.TOO_LONG',
    INVALID_DATE_FORMAT: 'COMMON.INVALID_DATE_FORMAT'
  },
  RESUME: {
    BASICS: {
      MISSING_NAME: 'RESUME.BASICS.MISSING_NAME',
      MISSING_EMAIL: 'RESUME.BASICS.MISSING_EMAIL',
      INVALID_EMAIL: 'RESUME.BASICS.INVALID_EMAIL',
      PERSONAL_EMAIL: 'RESUME.BASICS.PERSONAL_EMAIL'
    },
    WORK: {
      MISSING_COMPANY: 'RESUME.WORK.MISSING_COMPANY',
      MISSING_POSITION: 'RESUME.WORK.MISSING_POSITION',
      INVALID_DATE_RANGE: 'RESUME.WORK.INVALID_DATE_RANGE'
    },
    PROJECT: {
      MISSING_PROJECT_NAME: 'RESUME.PROJECT.MISSING_PROJECT_NAME',
      MISSING_DESCRIPTION: 'RESUME.PROJECT.MISSING_DESCRIPTION',
      BRIEF_DESCRIPTION: 'RESUME.PROJECT.BRIEF_DESCRIPTION'
    }
  }
}; 