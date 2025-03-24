import { describe, it, expect } from 'vitest';
import { Basics, BASICS_VALIDATION_KEYS, BasicsSuccess, BasicsFailure, BasicsSuccessWithWarnings } from '../Basics';
import { isSuccess, isFailure } from '@cv-generator/shared';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock';
import { EMAIL_VALIDATION_KEYS } from '../../../domain/value-objects/email.value-object';
import { URL_VALIDATION_KEYS } from '../../../domain/value-objects/url.value-object';

describe('Basics Entity', () => {
  // Create a mock i18n adapter with translations for testing
  const mockI18n = new MockDomainI18nAdapter({
    [BASICS_VALIDATION_KEYS.MISSING_NAME]: 'Le nom est requis',
    [BASICS_VALIDATION_KEYS.NAME_TOO_LONG]: 'Le nom ne doit pas dépasser 100 caractères',
    [BASICS_VALIDATION_KEYS.MISSING_EMAIL]: 'L\'email est requis',
    [EMAIL_VALIDATION_KEYS.INVALID_EMAIL]: 'Format email invalide',
    [EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL]: 'Email personnel détecté',
    [URL_VALIDATION_KEYS.INVALID_URL]: 'Format d\'URL invalide'
  });

  describe('create', () => {
    it('should create a valid Basics entity with minimal data', () => {
      // Arrange
      const minimalData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(minimalData, mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsSuccess);
      if (result instanceof BasicsSuccess) {
        expect(result.entity).toBeDefined();
        expect(result.entity.name).toBe('John Doe');
        expect(result.entity.email).toBe('john@example.com');
      }
    });
    
    it('should fail with missing name', () => {
      // Arrange
      const invalidData: Partial<BasicsInterface> = {
        name: '',
        email: 'john@example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData, mockI18n);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsFailure);
      if (result instanceof BasicsFailure) {
        const nameErrors = result.getErrors().filter(e => e.field === 'name');
        expect(nameErrors.length).toBe(1);
        expect(nameErrors[0].message).toBe('Le nom est requis');
        expect(nameErrors[0].i18nKey).toBe(BASICS_VALIDATION_KEYS.MISSING_NAME);
      }
    });
    
    it('should fail with name too long', () => {
      // Arrange
      const longName = 'a'.repeat(101);
      const invalidData: Partial<BasicsInterface> = {
        name: longName,
        email: 'john@example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData, mockI18n);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsFailure);
      if (result instanceof BasicsFailure) {
        const nameErrors = result.getErrors().filter(e => e.field === 'name');
        expect(nameErrors.length).toBe(1);
        expect(nameErrors[0].message).toBe('Le nom ne doit pas dépasser 100 caractères');
        expect(nameErrors[0].i18nKey).toBe(BASICS_VALIDATION_KEYS.NAME_TOO_LONG);
      }
    });
    
    it('should fail with missing email', () => {
      // Arrange
      const invalidData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: '',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData, mockI18n);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsFailure);
      if (result instanceof BasicsFailure) {
        const emailErrors = result.getErrors().filter(e => e.field === 'email');
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0].message).toBe('L\'email est requis');
        expect(emailErrors[0].i18nKey).toBe(BASICS_VALIDATION_KEYS.MISSING_EMAIL);
      }
    });
    
    it('should fail with invalid email', () => {
      // Arrange
      const invalidData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'invalid-email',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData, mockI18n);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsFailure);
      if (result instanceof BasicsFailure) {
        const emailErrors = result.getErrors().filter(e => e.field === 'email');
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0].message).toBe('Format email invalide');
        expect(emailErrors[0].i18nKey).toBe(EMAIL_VALIDATION_KEYS.INVALID_EMAIL);
      }
    });
    
    it('should add warning for personal email', () => {
      // Arrange
      const data: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@gmail.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(data, mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsSuccessWithWarnings);
      if (result instanceof BasicsSuccessWithWarnings) {
        expect(result.warnings).toBeDefined();
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings[0].message).toBe('Email personnel détecté');
        expect(result.warnings[0].i18nKey).toBe(EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL);
      }
    });
    
    it('should validate URL correctly', () => {
      // Arrange
      const data: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        url: 'https://example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(data, mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.entity).toBeDefined();
        expect(result.entity?.url).toBe('https://example.com');
      }
    });
    
    it('should fail with invalid URL', () => {
      // Arrange
      const invalidData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        url: 'invalid-url',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData, mockI18n);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsFailure);
      if (result instanceof BasicsFailure) {
        const urlErrors = result.getErrors().filter(e => e.field === 'url');
        expect(urlErrors.length).toBe(1);
        expect(urlErrors[0].message).toBe('Format d\'URL invalide');
        expect(urlErrors[0].i18nKey).toBe(URL_VALIDATION_KEYS.INVALID_URL);
      }
    });
  });
  
  describe('validateField', () => {
    it('should validate name field correctly', () => {
      // Act
      const result = Basics.validateField({ name: 'John Doe' }, 'name', mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.getValue()).toBe('John Doe');
      }
    });
    
    it('should validate email field correctly', () => {
      // Act
      const result = Basics.validateField({ email: 'john@example.com' }, 'email', mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should validate url field correctly', () => {
      // Act
      const result = Basics.validateField({ url: 'https://example.com' }, 'url', mockI18n);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
  });
  
  describe('update', () => {
    it('should update an existing entity with new values', () => {
      // Arrange
      const originalData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: []
      };
      
      const result = Basics.create(originalData, mockI18n);
      expect(isSuccess(result)).toBe(true);
      expect(result).toBeInstanceOf(BasicsSuccess);
      if (!(result instanceof BasicsSuccess)) return;
      
      const entity = result.entity;
      
      // Act
      const updateResult = entity.update({
        name: 'Jane Doe',
        summary: 'Professional summary'
      });
      
      // Assert
      expect(isSuccess(updateResult)).toBe(true);
      expect(updateResult).toBeInstanceOf(BasicsSuccess);
      if (updateResult instanceof BasicsSuccess) {
        expect(updateResult.entity.name).toBe('Jane Doe');
        expect(updateResult.entity.email).toBe('john@example.com'); // Unchanged
        expect(updateResult.entity.summary).toBe('Professional summary'); // New
      }
    });
  });
  
  describe('toJSON', () => {
    it('should convert entity to JSON object', () => {
      // Arrange
      const data: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33612345678',
        url: 'https://example.com',
        profiles: []
      };
      
      const result = Basics.create(data, mockI18n);
      expect(isSuccess(result)).toBe(true);
      
      // Nous acceptons maintenant que le résultat soit soit BasicsSuccess soit BasicsSuccessWithWarnings
      // car le numéro de téléphone ou l'email peuvent générer des avertissements
      if (result instanceof BasicsSuccess || result instanceof BasicsSuccessWithWarnings) {
        // Act
        const json = result.entity.toJSON();
        
        // Assert
        expect(json).toEqual({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+33612345678',
          url: 'https://example.com',
          profiles: []
        });
      }
    });
  });
}); 