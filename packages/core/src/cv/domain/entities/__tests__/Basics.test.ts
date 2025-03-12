import { describe, it, expect } from 'vitest';
import { Basics } from '../Basics';
import { isSuccess, isFailure } from '@cv-generator/shared';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';

describe('Basics Entity', () => {
  describe('create', () => {
    it('should create a valid Basics entity with minimal data', () => {
      // Arrange
      const minimalData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(minimalData);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.entity).toBeDefined();
        expect(result.entity?.name).toBe('John Doe');
        expect(result.entity?.email).toBe('john@example.com');
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
      const result = Basics.create(invalidData);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const nameErrors = result.error.filter(e => e.field === 'name');
        expect(nameErrors.length).toBe(1);
        expect(nameErrors[0].message).toBe('Le nom est requis');
      }
    });
    
    it('should fail with name too long', () => {
      // Arrange
      const invalidData: Partial<BasicsInterface> = {
        name: 'a'.repeat(101), // 101 characters
        email: 'john@example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(invalidData);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const nameErrors = result.error.filter(e => e.field === 'name');
        expect(nameErrors.length).toBe(1);
        expect(nameErrors[0].message).toBe('Le nom ne doit pas dépasser 100 caractères');
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
      const result = Basics.create(invalidData);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const emailErrors = result.error.filter(e => e.field === 'email');
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0].message).toBe("L'email est requis");
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
      const result = Basics.create(invalidData);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const emailErrors = result.error.filter(e => e.field === 'email');
        expect(emailErrors.length).toBe(1);
        expect(emailErrors[0].message).toBe('Format email invalide');
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
      const result = Basics.create(data);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.warnings).toBeDefined();
        expect(result.warnings?.length).toBeGreaterThan(0);
        expect(result.warnings?.[0].message).toBe('Email personnel détecté');
      }
    });
    
    it('should validate URL correctly', () => {
      // Arrange
      const validData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        url: 'https://example.com',
        profiles: []
      };
      
      // Act
      const result = Basics.create(validData);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
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
      const result = Basics.create(invalidData);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const urlErrors = result.error.filter(e => e.field === 'url');
        expect(urlErrors.length).toBe(1);
        expect(urlErrors[0].message).toBe("Format d'URL invalide");
      }
    });
  });
  
  describe('validateField', () => {
    it('should validate name field correctly', () => {
      // Arrange
      const data = { name: 'John Doe' };
      
      // Act
      const result = Basics.validateField(data, 'name');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe('John Doe');
      }
    });
    
    it('should validate email field correctly', () => {
      // Arrange
      const data = { email: 'john@example.com' };
      
      // Act
      const result = Basics.validateField(data, 'email');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should validate url field correctly', () => {
      // Arrange
      const data = { url: 'https://example.com' };
      
      // Act
      const result = Basics.validateField(data, 'url');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
  });
  
  describe('update', () => {
    it('should update an existing entity with new values', () => {
      // Arrange
      const initialData: Partial<BasicsInterface> = {
        name: 'John Doe',
        email: 'john@example.com',
        profiles: []
      };
      
      const createResult = Basics.create(initialData);
      expect(isSuccess(createResult)).toBe(true);
      
      if (isSuccess(createResult) && createResult.entity) {
        const entity = createResult.entity;
        
        // Act
        const updateResult = entity.update({
          name: 'Jane Doe',
          summary: 'Professional summary'
        });
        
        // Assert
        expect(isSuccess(updateResult)).toBe(true);
        if (isSuccess(updateResult)) {
          expect(updateResult.entity?.name).toBe('Jane Doe');
          expect(updateResult.entity?.email).toBe('john@example.com'); // Unchanged
          expect(updateResult.entity?.summary).toBe('Professional summary'); // New value
        }
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
      
      const result = Basics.create(data);
      expect(isSuccess(result)).toBe(true);
      
      if (isSuccess(result) && result.entity) {
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