/**
 * Tests pour le Value Object Email
 */
import { describe, it, expect } from 'vitest';
import { Email } from '../../../src/cv/domain/value-objects/email.value-object';
import { isSuccess, isFailure, ValidationLayerType } from '@cv-generator/shared';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid Email object', () => {
      // Arrange
      const validEmail = 'test@example.com';
      
      // Act
      const result = Email.create(validEmail);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value.getValue()).toBe(validEmail);
      }
    });
    
    it('should fail with empty email', () => {
      // Arrange & Act
      const result = Email.create('');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe('missing_email');
        expect(result.error[0].severity).toBe('error');
        expect(result.error[0].layer).toBe(ValidationLayerType.DOMAIN);
      }
    });
    
    it('should fail with invalid email format', () => {
      // Arrange & Act
      const result = Email.create('invalid-email');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error.some(e => e.code === 'invalid_email')).toBe(true);
        expect(result.error[0].severity).toBe('error');
      }
    });
    
    it('should return success with warning for personal email domains', () => {
      // Arrange
      const personalEmails = [
        'test@gmail.com',
        'test@hotmail.com',
        'test@yahoo.com',
        'test@outlook.com'
      ];
      
      // Act & Assert
      personalEmails.forEach(email => {
        const result = Email.create(email);
        
        // Should be successful but with warnings
        expect(isSuccess(result)).toBe(true);
        // @ts-ignore: Testing the extended ResultType with warnings
        expect(result.warnings).toBeDefined();
        // @ts-ignore: Testing the extended ResultType with warnings
        expect(result.warnings.some(w => w.code === 'personal_email')).toBe(true);
        // @ts-ignore: Testing the extended ResultType with warnings
        expect(result.warnings[0].severity).toBe('warning');
      });
    });
  });
}); 