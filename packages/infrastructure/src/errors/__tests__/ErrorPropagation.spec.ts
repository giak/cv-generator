import { describe, it, expect } from 'vitest';
import { InfrastructureErrorMapper } from '../InfrastructureErrorMapper';
import { StorageValidationError, StorageError } from '../../repositories/LocalStorageResumeRepository';

// Mock ErrorMappingService to avoid import issues
class MockErrorMappingService {
  private mappers = new Map<string, any>();
  
  registerMapper(source: string, mapper: any): void {
    this.mappers.set(source, mapper);
  }
  
  mapError(error: Error): any {
    let source = 'application';
    
    if (error.name?.includes('Storage') || error.name?.includes('Repository')) {
      source = 'infrastructure';
    }
    
    const mapper = this.mappers.get(source);
    
    if (mapper) {
      return mapper.map(error);
    }
    
    return {
      id: '123',
      message: `An error occurred: ${error.message}`,
      timestamp: Date.now(),
      severity: 'error',
      source,
      dismissed: false
    };
  }
}

/**
 * This test demonstrates the complete error propagation flow from 
 * infrastructure (storage) layer to application layer, and how
 * errors are transformed into user-friendly format.
 */
describe('Error Propagation Flow', () => {
  // Create the infrastructure error mapper
  const infrastructureMapper = new InfrastructureErrorMapper();
  
  // Create the error mapping service (application layer)
  const errorMappingService = new MockErrorMappingService();
  
  // Register the infrastructure mapper with the service
  errorMappingService.registerMapper('infrastructure', infrastructureMapper);
  
  describe('From Infrastructure to Application', () => {
    it('should properly propagate and transform validation errors', () => {
      // Arrange - Infrastructure layer error (storage validation)
      const validationError = new StorageValidationError(['basics.name: Le nom est requis']);
      
      // Act - Error is propagated to application layer and mapped
      const mappedError = errorMappingService.mapError(validationError);
      
      // Assert - Application has transformed it into user-friendly format
      expect(mappedError).toEqual(expect.objectContaining({
        message: 'Name is required', // User-friendly message
        severity: 'error',
        source: 'infrastructure',
        field: 'basics.name', // Field information preserved
        dismissed: false
      }));
    });
    
    it('should properly propagate and transform storage operation errors', () => {
      // Arrange - Infrastructure layer error (storage operation)
      const operationError = new StorageError(new Error('Failed to write to localStorage'));
      
      // Act - Error is propagated to application layer and mapped
      const mappedError = errorMappingService.mapError(operationError);
      
      // Assert - Application has transformed it into user-friendly format with action
      expect(mappedError).toEqual(expect.objectContaining({
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
    
    it('should handle multiple field errors from infrastructure layer', () => {
      // Arrange - Infrastructure layer error with multiple validation failures
      const multiFieldError = new StorageValidationError([
        'basics.name: Le nom est requis',
        'basics.email: Format email invalide'
      ]);
      
      // Act - Error is propagated to application layer and mapped
      const mappedError = errorMappingService.mapError(multiFieldError);
      
      // Assert - Application has transformed it to focus on the first field error
      expect(mappedError).toBeDefined();
      expect(mappedError.field).toBeDefined();
      // The mapper should return at least one of the field errors
      expect(['basics.name', 'basics.email']).toContain(mappedError.field);
    });
  });
  
  describe('Use case: Resume save operation', () => {
    // This simulates the realistic flow of how the application layer would handle
    // errors from the infrastructure layer during a save operation
    
    // Mock application use case
    function saveResume() {
      try {
        // Simulate infrastructure throwing a validation error
        throw new StorageValidationError(['basics.name: Le nom est requis']);
      } catch (error) {
        // Application layer catches the error and maps it for UI consumption
        if (error instanceof Error) {
          return errorMappingService.mapError(error);
        }
        throw error;
      }
    }
    
    it('should capture and transform infrastructure errors during use case execution', () => {
      // Act - Execute application use case that will fail with infrastructure error
      const result = saveResume();
      
      // Assert - Error is properly transformed for UI consumption
      expect(result).toEqual(expect.objectContaining({
        message: 'Name is required',
        severity: 'error',
        source: 'infrastructure',
        field: 'basics.name',
        dismissed: false
      }));
    });
  });
}); 