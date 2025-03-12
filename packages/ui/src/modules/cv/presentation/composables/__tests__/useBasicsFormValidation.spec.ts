import { describe, it, expect } from 'vitest';
import { useBasicsFormValidation } from '../useBasicsFormValidation';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { waitForNextTick } from '@ui/test/utils';

describe('useBasicsFormValidation', () => {
  const { 
    validateForm, 
    state, 
    validateName, 
    validateEmail,
    validateField
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

    it('should validate location fields', async () => {
      const data: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: [],
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      };
      
      // S'assurer que location existe avant de l'utiliser
      if (data.location) {
        // Test postal code validation - invalid format (not 5 digits)
        data.location.postalCode = '1234';
        const isValidPostalCode = validateField(data, 'location.postalCode');
        await waitForNextTick();
        expect(isValidPostalCode).toBe(true); // Should return true because it's just a warning
        expect(state.warnings['location.postalCode']).toBeDefined();
        expect(state.warnings['location.postalCode']).toContain('postal');
        
        // Test postal code validation - valid format
        data.location.postalCode = '75001';
        const isValidPostalCode2 = validateField(data, 'location.postalCode');
        await waitForNextTick();
        expect(isValidPostalCode2).toBe(true);
        expect(state.warnings['location.postalCode']).toBeUndefined();
        
        // Test country code validation - invalid format (3 letters instead of 2)
        data.location.countryCode = 'USA';
        const isValidCountryCode = validateField(data, 'location.countryCode');
        await waitForNextTick();
        expect(isValidCountryCode).toBe(true); // Should return true because it's just a warning
        expect(state.warnings['location.countryCode']).toBeDefined();
        expect(state.warnings['location.countryCode']).toContain('code pays');
        
        // Test country code validation - valid format
        data.location.countryCode = 'FR';
        const isValidCountryCode2 = validateField(data, 'location.countryCode');
        await waitForNextTick();
        expect(isValidCountryCode2).toBe(true);
        expect(state.warnings['location.countryCode']).toBeUndefined();
        
        // Test lowercase country code
        data.location.countryCode = 'fr';
        const isValidCountryCode3 = validateField(data, 'location.countryCode');
        await waitForNextTick();
        expect(isValidCountryCode3).toBe(true);
        expect(state.warnings['location.countryCode']).toBeDefined();
        expect(state.warnings['location.countryCode']).toContain('code pays');
      }
    });

    it('should validate countryCode field with 3-letter code', async () => {
      const data: BasicsInterface = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: [],
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: 'USA', // 3-letter code
          region: ''
        }
      };

      // Test 3-letter country code
      const isValid = validateField(data, 'location.countryCode');
      await waitForNextTick();
      
      // Should be valid but with warnings
      expect(isValid).toBe(true);
      expect(state.errors['location.countryCode']).toBeUndefined();
      expect(state.warnings['location.countryCode']).toBeDefined();
      expect(state.warnings['location.countryCode']).toContain('ISO à 2 lettres');
      
      // Update to valid 2-letter code
      data.location!.countryCode = 'US';
      const isValidWithCorrectCode = validateField(data, 'location.countryCode');
      await waitForNextTick();
      
      expect(isValidWithCorrectCode).toBe(true);
      expect(state.errors['location.countryCode']).toBeUndefined();
      expect(state.warnings['location.countryCode']).toBeUndefined();
    });
  });
}); 