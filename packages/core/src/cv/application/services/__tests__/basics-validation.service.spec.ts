import { describe, it, expect } from 'vitest';
import { BasicsValidationService } from '../basics-validation.service';
import { isSuccess, isFailure } from '@cv-generator/shared';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock';
import { BASICS_VALIDATION_KEYS } from '../../../domain/entities/Basics';
import { EMAIL_VALIDATION_KEYS } from '../../../domain/value-objects/email.value-object';
import { URL_VALIDATION_KEYS } from '../../../domain/value-objects/url.value-object';
import { PHONE_VALIDATION_KEYS } from '../../../domain/value-objects/phone.value-object';

describe('BasicsValidationService', () => {
  // Create a mock i18n adapter with translations for testing
  const mockI18n = new MockDomainI18nAdapter({
    [BASICS_VALIDATION_KEYS.MISSING_NAME]: 'Le nom est requis',
    [BASICS_VALIDATION_KEYS.NAME_TOO_LONG]: 'Le nom ne doit pas dépasser 100 caractères',
    [BASICS_VALIDATION_KEYS.MISSING_EMAIL]: 'L\'email est requis',
    [EMAIL_VALIDATION_KEYS.INVALID_EMAIL]: 'Format email invalide',
    [EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL]: 'Email personnel détecté',
    [URL_VALIDATION_KEYS.INVALID_URL]: 'Format d\'URL invalide',
    [PHONE_VALIDATION_KEYS.INVALID_PHONE]: 'Format de téléphone invalide'
  });

  // Create the validation service with the mock i18n adapter
  const validationService = new BasicsValidationService(mockI18n);
  
  describe('validate', () => {
    it('should validate valid basics data', () => {
      // Arrange
      const validBasics: BasicsInterface = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+33612345678',
        label: 'Software Engineer',
        url: 'https://johndoe.com',
        image: 'https://example.com/avatar.jpg',
        summary: 'Experienced software engineer',
        location: {
          address: '15 rue de Paris',
          postalCode: '75001',
          city: 'Paris',
          countryCode: 'FR',
          region: 'Île-de-France'
        },
        profiles: []
      };
      
      // Act
      const result = validationService.validate(validBasics);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should fail with missing name', () => {
      // Arrange
      const invalidBasics: BasicsInterface = {
        name: '',
        email: 'john.doe@company.com',
        phone: '+33612345678',
        label: 'Software Engineer',
        profiles: []
      };
      
      // Act
      const result = validationService.validate(invalidBasics);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const nameErrors = result.error.filter(e => e.field === 'name');
        expect(nameErrors.length).toBe(1);
        expect(nameErrors[0].message).toBe('Le nom est requis');
        expect(nameErrors[0].i18nKey).toBe(BASICS_VALIDATION_KEYS.MISSING_NAME);
      }
    });
    
    it('should fail with invalid email', () => {
      // Arrange
      const invalidBasics: BasicsInterface = {
        name: 'John Doe',
        email: 'invalid-email',
        profiles: []
      };
      
      // Act
      const result = validationService.validate(invalidBasics);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const emailErrors = result.error.filter(e => e.field === 'email');
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0].message).toBe('Format email invalide');
        expect(emailErrors[0].i18nKey).toBe(EMAIL_VALIDATION_KEYS.INVALID_EMAIL);
      }
    });
    
    it('should add warning for personal email', () => {
      // Arrange
      const basicsWithPersonalEmail: BasicsInterface = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        profiles: []
      };
      
      // Act
      const result = validationService.validate(basicsWithPersonalEmail);
      
      // Assert
      // Le résultat global devrait être un succès avec des warnings
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        const emailWarnings = result.warnings?.filter(e => e.field === 'email' && e.severity === 'warning');
        expect(emailWarnings?.length).toBe(1);
        expect(emailWarnings?.[0].message).toBe('Email personnel détecté');
        expect(emailWarnings?.[0].i18nKey).toBe(EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL);
      }
    });
    
    it('should fail with invalid phone', () => {
      // Arrange
      const invalidBasics: BasicsInterface = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '123', // Trop court
        profiles: []
      };
      
      // Act
      const result = validationService.validate(invalidBasics);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const phoneErrors = result.error.filter(e => e.field === 'phone');
        expect(phoneErrors.length).toBe(1);
        expect(phoneErrors[0].message).toBe('Format de téléphone invalide');
      }
    });
    
    it('should fail with invalid URL', () => {
      // Arrange
      const invalidBasics: BasicsInterface = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        url: 'invalid-url', // URL non valide
        profiles: []
      };
      
      // Act
      const result = validationService.validate(invalidBasics);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const urlErrors = result.error.filter(e => e.field === 'url');
        expect(urlErrors.length).toBe(1);
        expect(urlErrors[0].message).toBe("Format d'URL invalide");
        expect(urlErrors[0].i18nKey).toBe(URL_VALIDATION_KEYS.INVALID_URL);
      }
    });
  });
  
  describe('validateField', () => {
    it('should validate name field correctly', () => {
      // Arrange
      const basics: Partial<BasicsInterface> & Pick<BasicsInterface, 'name' | 'profiles'> = { 
        name: 'John Doe', 
        profiles: [] 
      };
      
      // Act
      const result = validationService.validateField(basics as BasicsInterface, 'name');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe('John Doe');
      }
    });
    
    it('should fail validating empty name', () => {
      // Arrange
      const basics: Partial<BasicsInterface> & Pick<BasicsInterface, 'name' | 'profiles'> = { 
        name: '', 
        profiles: [],
        email: 'dummy@example.com' // Ajout de l'email pour respecter l'interface
      };
      
      // Act
      const result = validationService.validateField(basics as BasicsInterface, 'name');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].message).toBe('Le nom est requis');
        expect(result.error[0].i18nKey).toBe(BASICS_VALIDATION_KEYS.MISSING_NAME);
      }
    });
    
    it('should validate email field correctly', () => {
      // Arrange
      const basics: Partial<BasicsInterface> & Pick<BasicsInterface, 'name' | 'email' | 'profiles'> = { 
        name: 'John Doe', 
        email: 'john.doe@company.com', 
        profiles: [] 
      };
      
      // Act
      const result = validationService.validateField(basics as BasicsInterface, 'email');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        // Vérifier que la valeur est un objet avec une méthode getValue
        expect(typeof result.value).toBe('object');
        expect(typeof (result.value as any).getValue).toBe('function');
        
        // Vérifier que la valeur de l'email est correcte
        const emailValue = (result.value as any).getValue();
        expect(emailValue).toBe('john.doe@company.com');
      }
    });
    
    it('should return warning for personal email', () => {
      // Arrange
      const basics: Partial<BasicsInterface> & Pick<BasicsInterface, 'name' | 'email' | 'profiles'> = { 
        name: 'John Doe', 
        email: 'john.doe@gmail.com', 
        profiles: [] 
      };
      
      // Act
      const result = validationService.validateField(basics as BasicsInterface, 'email');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && 'warnings' in result) {
        expect(result.warnings?.length).toBeGreaterThan(0);
        expect(result.warnings?.[0].message).toBe('Email personnel détecté');
      }
    });
  });
}); 