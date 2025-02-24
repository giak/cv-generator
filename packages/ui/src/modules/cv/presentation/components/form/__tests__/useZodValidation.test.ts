import { describe, it, expect } from 'vitest';
import { useFieldValidation } from '../useFieldValidation';
import { z } from 'zod';
import { nextTick } from 'vue';

describe('useZodValidation', () => {
  describe('Field Validation', () => {
    it('should validate required name field', async () => {
      const { validate, error, isValid } = useFieldValidation(
        z.string().min(2, "Le nom est requis")
      );

      validate('');
      await nextTick();
      expect(error.value).toBe('Le nom est requis');
      expect(isValid.value).toBe(false);

      validate('John');
      await nextTick();
      expect(error.value).toBe('');
      expect(isValid.value).toBe(true);
    });

    it('should validate email format', async () => {
      const { validate, error, isValid } = useFieldValidation(
        z.string().email("Format email invalide")
      );

      validate('invalid-email');
      await nextTick();
      expect(isValid.value).toBe(false);
      expect(error.value).toBe('Format email invalide');

      validate('valid@email.com');
      await nextTick();
      expect(isValid.value).toBe(true);
      expect(error.value).toBe('');
    });

    it('should handle optional fields', async () => {
      const { validate, error, isValid } = useFieldValidation(
        z.string().min(2).optional()
      );

      validate(undefined);
      await nextTick();
      expect(error.value).toBe('');
      expect(isValid.value).toBe(true);

      validate('a');
      await nextTick();
      expect(error.value).not.toBe('');
      expect(isValid.value).toBe(false);
    });
  });

  describe('Debounce', () => {
    it('should debounce validation', async () => {
      const { validate, error, isValid, isDirty } = useFieldValidation(
        z.string().min(2, "Le nom est requis"),
        { debounce: 100 }
      );

      validate('a');
      expect(isDirty.value).toBe(false);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(isDirty.value).toBe(true);
      expect(error.value).toBe('Le nom est requis');
      expect(isValid.value).toBe(false);
    });
  });

  describe('Error Formatting', () => {
    it('should use custom error formatter', async () => {
      const customFormatter = (error: z.ZodError) => 
        `Custom error: ${error.errors[0]?.message}`;

      const { validate, error } = useFieldValidation(
        z.string().min(2, "Le nom est requis"),
        { formatError: customFormatter }
      );

      validate('a');
      await nextTick();
      expect(error.value).toBe('Custom error: Le nom est requis');
    });
  });
}); 