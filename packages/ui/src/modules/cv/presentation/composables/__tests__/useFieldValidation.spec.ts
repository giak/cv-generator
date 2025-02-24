import { describe, it, expect, beforeEach } from 'vitest';
import { useFieldValidation } from '../useFieldValidation';
import { z } from 'zod';
import { nextTick } from 'vue';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';

describe('useFieldValidation', () => {
  describe('validateField', () => {
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

    it('should validate required email field', async () => {
      const { validate, error, isValid } = useFieldValidation(
        z.string().email("Format email invalide")
      );

      validate('');
      await nextTick();
      expect(error.value).toBe('Format email invalide');
      expect(isValid.value).toBe(false);

      validate('invalid');
      await nextTick();
      expect(error.value).toBe('Format email invalide');
      expect(isValid.value).toBe(false);
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

    it('should clear errors when field becomes valid', async () => {
      const { validate, error, isValid } = useFieldValidation(
        z.string().min(2, "Le nom est requis")
      );

      validate('a');
      await nextTick();
      expect(error.value).toBe('Le nom est requis');
      expect(isValid.value).toBe(false);

      validate('John');
      await nextTick();
      expect(error.value).toBe('');
      expect(isValid.value).toBe(true);
    });

    it('should allow optional fields to be empty', async () => {
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

  describe('debounce', () => {
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
});

describe('useFieldValidation (Legacy)', () => {
  const { validateField, validateForm, errors } = useFieldValidation();

  describe('validateField', () => {
    it('should validate required name field', () => {
      const isValid = validateField('name', '');
      expect(isValid).toBe(false);
      expect(errors.value.name).toBe('Le nom est requis');

      expect(validateField('name', 'John Doe')).toBe(true);
      expect(errors.value.name).toBeUndefined();
    });

    it('should validate required email field', () => {
      const isValid = validateField('email', '');
      expect(isValid).toBe(false);
      expect(errors.value.email).toBe('L\'email est requis');

      expect(validateField('email', 'invalid')).toBe(false);
      expect(errors.value.email).toBe('Format email invalide');

      expect(validateField('email', 'john@example.com')).toBe(true);
      expect(errors.value.email).toBeUndefined();
    });

    it('should validate email format', () => {
      const isValid = validateField('email', 'invalid-email');
      expect(isValid).toBe(false);
      expect(errors.value.email).toBeDefined();
    });

    it('should clear errors when field becomes valid', () => {
      validateField('email', '');
      expect(errors.value.email).toBeDefined();

      validateField('email', 'valid@example.com');
      expect(errors.value.email).toBeUndefined();
    });

    it('should allow optional fields to be empty', () => {
      expect(validateField('label', '')).toBe(true);
      expect(errors.value.label).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    it('should validate all required fields', () => {
      const validData: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      expect(validateForm(validData)).toBe(true);
      expect(errors.value).toEqual({});
    });

    it('should fail validation with invalid data', () => {
      const invalidData: BasicsInterface = {
        name: '',
        email: 'invalid'
      };

      expect(validateForm(invalidData)).toBe(false);
      expect(errors.value).toHaveProperty('name');
      expect(errors.value).toHaveProperty('email');
    });

    it('should validate entire form', () => {
      const isValid = validateForm({
        name: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      });

      expect(isValid).toBe(false);
      expect(errors.value.name).toBeDefined();
      expect(errors.value.email).toBeDefined();
    });

    it('should validate form with valid data', () => {
      const isValid = validateForm({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        url: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      });

      expect(isValid).toBe(true);
      expect(errors.value.name).toBeUndefined();
      expect(errors.value.email).toBeUndefined();
    });
  });
}); 