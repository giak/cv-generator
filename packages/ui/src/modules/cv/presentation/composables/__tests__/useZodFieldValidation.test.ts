import { describe, it, expect } from 'vitest';
import { useFieldValidation as useZodFieldValidation } from '../useZodFieldValidation';
import { z } from 'zod';
import { nextTick } from 'vue';

describe('useZodFieldValidation', () => {
  describe('String Validation', () => {
    it('should start with initial state', () => {
      const validation = useZodFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
      expect(validation.isDirty.value).toBe(false);
    });

    it('should validate valid string', async () => {
      const validation = useZodFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      
      validation.validate('John');
      await nextTick();
      
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
      expect(validation.isDirty.value).toBe(true);
    });

    it('should fail for too short string', async () => {
      const validation = useZodFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      
      validation.validate('J');
      await nextTick();
      
      expect(validation.error.value).toBe('Le nom est requis');
      expect(validation.isValid.value).toBe(false);
      expect(validation.isDirty.value).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', async () => {
      const validation = useZodFieldValidation(
        z.string().email("Format email invalide")
      );
      
      validation.validate('valid@email.com');
      await nextTick();
      
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });

    it('should handle empty email', async () => {
      const validation = useZodFieldValidation(
        z.string().email("Format email invalide")
      );
      
      validation.validate('');
      await nextTick();
      
      expect(validation.error.value).toBe('Format email invalide');
      expect(validation.isValid.value).toBe(false);
    });
  });

  describe('Optional Fields', () => {
    it('should handle undefined value', async () => {
      const validation = useZodFieldValidation(
        z.string().min(2).optional()
      );
      
      validation.validate(undefined);
      await nextTick();
      
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });

    it('should validate when value is provided', async () => {
      const validation = useZodFieldValidation(
        z.string().min(2).optional()
      );
      
      validation.validate('test');
      await nextTick();
      
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });
  });

  describe('Debounce', () => {
    it('should debounce validation', async () => {
      const validation = useZodFieldValidation(
        z.string().min(2, "Le nom est requis"),
        { debounce: 100 }
      );
      
      validation.validate('J');
      await nextTick();
      
      // Initial state should not change immediately
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Now the validation should be complete
      expect(validation.error.value).toBe('Le nom est requis');
      expect(validation.isValid.value).toBe(false);
    });
  });

  describe('Error Formatting', () => {
    it('should use custom error formatter', async () => {
      const customFormatter = (error: z.ZodError) => 
        `Custom error: ${error.errors[0]?.message}`;

      const { validate, error } = useZodFieldValidation(
        z.string().min(2, "Le nom est requis"),
        { formatError: customFormatter }
      );

      validate('a');
      await nextTick();
      expect(error.value).toBe('Custom error: Le nom est requis');
    });
  });
}); 