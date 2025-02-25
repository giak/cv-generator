import { describe, it, expect } from 'vitest';
import { InfrastructureErrorMapper } from '../InfrastructureErrorMapper';
import { StorageError, StorageValidationError } from '../../repositories/LocalStorageResumeRepository';

describe('InfrastructureErrorMapper', () => {
  const mapper = new InfrastructureErrorMapper();

  describe('map method', () => {
    it('should map StorageValidationError to appropriate error info', () => {
      // Arrange
      const validationError = new StorageValidationError(['basics.name: Le nom est requis']);
      
      // Act
      const errorInfo = mapper.map(validationError);
      
      // Assert
      expect(errorInfo).toEqual(expect.objectContaining({
        message: expect.any(String),
        severity: 'error',
        source: 'infrastructure',
        field: 'basics.name',
        dismissed: false
      }));
    });

    it('should use specific field mapping when available', () => {
      // Arrange
      const validationError = new StorageValidationError(['basics.name: Le nom est requis']);
      
      // Act
      const errorInfo = mapper.map(validationError);
      
      // Assert
      expect(errorInfo.message).toBe('Name is required');
      expect(errorInfo.field).toBe('basics.name');
    });

    it('should map StorageError to appropriate error info', () => {
      // Arrange
      const storageError = new StorageError(new Error('Failed to save data'));
      
      // Act
      const errorInfo = mapper.map(storageError);
      
      // Assert
      expect(errorInfo).toEqual(expect.objectContaining({
        message: 'Unable to save your changes. Please try again later',
        severity: 'error',
        source: 'infrastructure',
        action: {
          label: 'Try Again',
          handler: 'resume/retryLastOperation'
        },
        dismissed: false
      }));
    });

    it('should handle unknown errors with a generic message', () => {
      // Arrange
      const unknownError = new Error('Unknown error');
      
      // Act
      const errorInfo = mapper.map(unknownError);
      
      // Assert
      expect(errorInfo).toEqual(expect.objectContaining({
        message: 'An unexpected error occurred',
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      }));
    });
  });
}); 