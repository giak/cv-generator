import { describe, it, expect } from 'vitest';
import { ApplicationErrorMapper } from '../ApplicationErrorMapper';
import { ValidationError } from '../../../domain/errors/ValidationError';

describe('ApplicationErrorMapper', () => {
  const mapper = new ApplicationErrorMapper();

  describe('map method', () => {
    it('should map ValidationError to appropriate error info', () => {
      // Arrange
      const validationError = new ValidationError(['Invalid field value'], 'Validation failed');
      
      // Act
      const errorInfo = mapper.map(validationError);
      
      // Assert
      expect(errorInfo).toEqual(expect.objectContaining({
        message: 'Validation failed',
        severity: 'error',
        source: 'application',
        dismissed: false
      }));
    });

    it('should map generic errors to appropriate error info', () => {
      // Arrange
      const genericError = new Error('Something went wrong');
      
      // Act
      const errorInfo = mapper.map(genericError);
      
      // Assert
      expect(errorInfo).toEqual(expect.objectContaining({
        message: 'Application error: Something went wrong',
        severity: 'error',
        source: 'application',
        dismissed: false
      }));
    });

    it('should always generate unique IDs for errors', () => {
      // Arrange
      const error1 = new Error('First error');
      const error2 = new Error('Second error');
      
      // Act
      const errorInfo1 = mapper.map(error1);
      const errorInfo2 = mapper.map(error2);
      
      // Assert
      expect(errorInfo1.id).not.toBe(errorInfo2.id);
    });
  });
}); 