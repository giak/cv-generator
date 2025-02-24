import { ref, Ref } from 'vue';
import { z } from 'zod';
import debounce from 'lodash/debounce';

interface ValidationOptions {
  debounce?: number;
  formatError?: (error: z.ZodError) => string;
}

interface ValidationResult {
  validate: (value: any) => void;
  error: Ref<string>;
  isValid: Ref<boolean>;
  isDirty: Ref<boolean>;
}

const defaultFormatError = (error: z.ZodError): string => {
  return error.errors[0]?.message || '';
};

export function useFieldValidation(
  schema: z.ZodType,
  options: ValidationOptions = {}
): ValidationResult {
  const error = ref('');
  const isValid = ref(true);
  const isDirty = ref(false);

  const formatError = options.formatError || defaultFormatError;

  const validateValue = (value: any) => {
    isDirty.value = true;
    try {
      schema.parse(value);
      error.value = '';
      isValid.value = true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        error.value = formatError(err);
        isValid.value = false;
      }
    }
  };

  const validate = options.debounce
    ? debounce(validateValue, options.debounce)
    : validateValue;

  return {
    validate,
    error,
    isValid,
    isDirty
  };
} 