import { describe, it, expect } from 'vitest';
import { useFieldValidation } from '../../../composables/useFieldValidation';
import { z } from 'zod';
import { nextTick } from 'vue';

describe('useFieldValidation', () => {
  describe('String Validation', () => {
    it('should start with initial state', () => {
      const validation = useFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(false);
      expect(validation.isDirty.value).toBe(false);
    });

    it('should validate valid string', async () => {
      const validation = useFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      validation.validate('John');
      await nextTick();
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });

    it('should fail for too short string', async () => {
      const validation = useFieldValidation(
        z.string().min(2, "Le nom est requis")
      );
      validation.validate('a');
      await nextTick();
      expect(validation.error.value).toBe('Le nom est requis');
      expect(validation.isValid.value).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', async () => {
      const validation = useFieldValidation(
        z.string().email("Format email invalide")
      );

      validation.validate('invalid-email');
      await nextTick();
      expect(validation.isValid.value).toBe(false);
      expect(validation.error.value).toBe('Format email invalide');

      validation.validate('valid@email.com');
      await nextTick();
      expect(validation.isValid.value).toBe(true);
      expect(validation.error.value).toBe('');
    });

    it('should handle empty email', async () => {
      const validation = useFieldValidation(
        z.string().email("Format email invalide")
      );

      validation.validate('');
      await nextTick();
      expect(validation.isValid.value).toBe(false);
      expect(validation.error.value).toBe('Format email invalide');
    });
  });

  describe('Optional Fields', () => {
    it('should handle undefined value', async () => {
      const validation = useFieldValidation(
        z.string().min(2).optional()
      );

      validation.validate(undefined);
      await nextTick();
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });

    it('should validate when value is provided', async () => {
      const validation = useFieldValidation(
        z.string().min(2).optional()
      );

      validation.validate('a');
      await nextTick();
      expect(validation.error.value).not.toBe('');
      expect(validation.isValid.value).toBe(false);

      validation.validate('valid');
      await nextTick();
      expect(validation.error.value).toBe('');
      expect(validation.isValid.value).toBe(true);
    });
  });

  describe('Debounce', () => {
    it('should debounce validation', async () => {
      const validation = useFieldValidation(
        z.string().min(2, "Le nom est requis"),
        { debounce: 100 }
      );

      validation.validate('a');
      expect(validation.isDirty.value).toBe(false);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(validation.isDirty.value).toBe(true);
      expect(validation.error.value).toBe('Le nom est requis');
      expect(validation.isValid.value).toBe(false);
    });
  });

  describe('Legacy Validation', () => {
    it('should validate required name field', () => {
      const validation = useFieldValidation();
      
      expect(validation.validateField('name', '')).toBe(false);
      expect(validation.errors.value.name).toBe('Le nom est requis');

      expect(validation.validateField('name', 'John')).toBe(true);
      expect(validation.errors.value.name).toBeUndefined();
    });

    it('should validate email format', () => {
      const validation = useFieldValidation();
      
      expect(validation.validateField('email', 'invalid-email')).toBe(false);
      expect(validation.errors.value.email).toBe('Format email invalide');

      expect(validation.validateField('email', 'valid@email.com')).toBe(true);
      expect(validation.errors.value.email).toBeUndefined();
    });

    it('should validate form data', () => {
      const validation = useFieldValidation();
      const validData = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      expect(validation.validateForm(validData)).toBe(true);
      expect(validation.errors.value).toEqual({});

      const invalidData = {
        name: '',
        email: 'invalid-email'
      };
      
      expect(validation.validateForm(invalidData)).toBe(false);
      expect(validation.errors.value).toHaveProperty('name');
      expect(validation.errors.value).toHaveProperty('email');
    });
  });
}); 