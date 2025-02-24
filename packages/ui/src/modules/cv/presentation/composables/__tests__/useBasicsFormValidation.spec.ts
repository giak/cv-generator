import { describe, it, expect } from 'vitest';
import { useFormValidation as useBasicsFormValidation } from '../useBasicsFormValidation';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { waitForNextTick } from '@test/utils';

describe('useBasicsFormValidation', () => {
  const { validateForm, errors } = useBasicsFormValidation();

  describe('validateForm', () => {
    it('should validate all required fields', async () => {
      const validData: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const isValid = await validateForm(validData);
      await waitForNextTick();
      expect(isValid).toBe(true);
      expect(errors.value).toEqual({});
    });

    it('should fail validation with invalid data', async () => {
      const invalidData: BasicsInterface = {
        name: '',
        email: 'invalid'
      };

      const isValid = await validateForm(invalidData);
      await waitForNextTick();
      expect(isValid).toBe(false);
      expect(errors.value).toHaveProperty('name');
      expect(errors.value).toHaveProperty('email');
    });

    it('should validate entire form', async () => {
      const isValid = await validateForm({
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

      await waitForNextTick();
      expect(isValid).toBe(false);
      expect(errors.value.name).toBeDefined();
      expect(errors.value.email).toBeDefined();
    });

    it('should validate form with valid data', async () => {
      const isValid = await validateForm({
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

      await waitForNextTick();
      expect(isValid).toBe(true);
      expect(errors.value.name).toBeUndefined();
      expect(errors.value.email).toBeUndefined();
    });
  });
}); 