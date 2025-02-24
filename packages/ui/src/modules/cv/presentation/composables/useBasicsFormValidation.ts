import { ref } from 'vue';
import { useFieldValidation } from '@composables/useFieldValidation';
import { z } from 'zod';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';

export function useFormValidation() {
  const errors = ref<Record<string, string>>({});

  const nameSchema = z.string().min(2, 'Le nom est requis');
  const emailSchema = z.string().email('Format email invalide');

  const nameValidation = useFieldValidation(nameSchema);
  const emailValidation = useFieldValidation(emailSchema);

  const validateField = async (field: string, value: any): Promise<boolean> => {
    switch (field) {
      case 'name':
        await nameValidation.validate(value);
        if (!nameValidation.isValid.value) {
          errors.value[field] = nameValidation.error.value;
          return false;
        }
        break;
      case 'email':
        await emailValidation.validate(value);
        if (!emailValidation.isValid.value) {
          errors.value[field] = emailValidation.error.value;
          return false;
        }
        break;
    }
    delete errors.value[field];
    return true;
  };

  const validateForm = async (data: Record<string, any>): Promise<boolean> => {
    let isValid = true;
    errors.value = {};

    const validations = Object.entries(data).map(async ([field, value]) => {
      if (!await validateField(field, value)) {
        isValid = false;
      }
    });

    await Promise.all(validations);
    return isValid;
  };

  return {
    validateField,
    validateForm,
    errors
  };
} 