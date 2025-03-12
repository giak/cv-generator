import { describe, it, expect } from 'vitest';
import { useBasicsFormValidation } from '../useBasicsFormValidation';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { waitForNextTick } from '@ui/test/utils';

describe('useBasicsFormValidation', () => {
  const { 
    validateForm, 
    state, 
    validateName, 
    validateEmail 
  } = useBasicsFormValidation();

  describe('validateForm', () => {
    it('should validate all required fields', async () => {
      const validData: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: []
      };

      const isValid = validateForm(validData);
      await waitForNextTick();
      expect(isValid).toBe(true);
      expect(state.errors).toEqual({});
    });

    it('should fail validation with invalid data', async () => {
      const invalidData: BasicsInterface = {
        name: '',
        email: 'invalid',
        profiles: []
      };

      const isValid = validateForm(invalidData);
      await waitForNextTick();
      expect(isValid).toBe(false);
      expect(state.errors).toHaveProperty('name');
      expect(state.errors).toHaveProperty('email');
    });

    it('should validate entire form', async () => {
      const isValid = validateForm({
        name: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        profiles: [],
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
      expect(state.errors.name).toBeDefined();
      expect(state.errors.email).toBeDefined();
    });

    it('should validate form with valid data', async () => {
      const isValid = validateForm({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        url: '',
        summary: '',
        profiles: [],
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
      expect(state.errors.name).toBeUndefined();
      expect(state.errors.email).toBeUndefined();
    });
  });

  describe('validateField', () => {
    it('should validate email field', async () => {
      const data: BasicsInterface = {
        name: 'John Doe',
        email: 'invalid-email',
        profiles: []
      };

      // Test invalid email
      const isValidWithInvalidEmail = validateEmail(data);
      await waitForNextTick();
      expect(isValidWithInvalidEmail).toBe(false);
      expect(state.errors.email).toBeDefined();

      // Update data with valid email
      data.email = 'john@example.com';
      const isValidWithValidEmail = validateEmail(data);
      await waitForNextTick();
      expect(isValidWithValidEmail).toBe(true);
      expect(state.errors.email).toBeUndefined();
    });

    it('should validate name field', async () => {
      const data: BasicsInterface = {
        name: '',
        email: 'john@example.com',
        profiles: []
      };

      // Test empty name
      const isValidWithEmptyName = validateName(data);
      await waitForNextTick();
      expect(isValidWithEmptyName).toBe(false);
      expect(state.errors.name).toBeDefined();

      // Update data with valid name
      data.name = 'John Doe';
      const isValidWithValidName = validateName(data);
      await waitForNextTick();
      expect(isValidWithValidName).toBe(true);
      expect(state.errors.name).toBeUndefined();
    });
  });
}); 