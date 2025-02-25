import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorMappingService, type ErrorInfo, type ErrorMapper } from '../ErrorMappingService';
import { ValidationError } from '../../../domain/errors/ValidationError';

// Mock error mappers
class MockInfrastructureMapper implements ErrorMapper {
  map(error: Error): ErrorInfo {
    return {
      id: '123',
      message: 'Mocked infrastructure error',
      timestamp: 1000,
      severity: 'error',
      source: 'infrastructure',
      dismissed: false
    };
  }
}

class MockDomainMapper implements ErrorMapper {
  map(error: Error): ErrorInfo {
    return {
      id: '456',
      message: 'Mocked domain error',
      timestamp: 2000,
      severity: 'warning',
      source: 'domain',
      dismissed: false
    };
  }
}

// Mock Errors
class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

describe('ErrorMappingService', () => {
  let service: ErrorMappingService;
  let mockInfrastructureMapper: MockInfrastructureMapper;
  let mockDomainMapper: MockDomainMapper;

  beforeEach(() => {
    service = new ErrorMappingService();
    mockInfrastructureMapper = new MockInfrastructureMapper();
    mockDomainMapper = new MockDomainMapper();
    
    // Register the mappers
    service.registerMapper('infrastructure', mockInfrastructureMapper);
    service.registerMapper('domain', mockDomainMapper);
  });

  describe('mapError method', () => {
    it('should use infrastructure mapper for storage errors', () => {
      // Arrange
      const storageError = new StorageError('Storage operation failed');
      const spy = vi.spyOn(mockInfrastructureMapper, 'map');
      
      // Act
      const result = service.mapError(storageError);
      
      // Assert
      expect(spy).toHaveBeenCalledWith(storageError);
      expect(result.source).toBe('infrastructure');
      expect(result.message).toBe('Mocked infrastructure error');
    });

    it('should use domain mapper for validation errors', () => {
      // Arrange
      const validationError = new ValidationError(['Invalid data'], 'Domain validation failed');
      const spy = vi.spyOn(mockDomainMapper, 'map');
      
      // Act
      const result = service.mapError(validationError);
      
      // Assert
      expect(spy).toHaveBeenCalledWith(validationError);
      expect(result.source).toBe('domain');
      expect(result.message).toBe('Mocked domain error');
    });

    it('should fall back to default mapping when no mapper is registered', () => {
      // Arrange
      const service = new ErrorMappingService(); // New service with no mappers
      const genericError = new Error('Generic application error');
      
      // Act
      const result = service.mapError(genericError);
      
      // Assert
      expect(result.source).toBe('application');
      expect(result.message).toContain('Generic application error');
      expect(result.severity).toBe('error');
    });

    it('should work with the application mapper for generic errors', () => {
      // Arrange
      const applicationError = new Error('Application error');
      service.registerMapper('application', {
        map: () => ({
          id: '789',
          message: 'Mocked application error',
          timestamp: 3000,
          severity: 'info',
          source: 'application',
          dismissed: false
        })
      });
      
      // Act
      const result = service.mapError(applicationError);
      
      // Assert
      expect(result.source).toBe('application');
      expect(result.message).toBe('Mocked application error');
    });
  });

  describe('Error propagation flow', () => {
    it('should correctly propagate infrastructure errors', () => {
      // Arrange - Setup a realistic error propagation flow
      const originalError = new StorageError('Failed to save data');
      
      // Mock the infrastructure mapper with a more realistic implementation
      const realMapper: ErrorMapper = {
        map: (error: Error): ErrorInfo => ({
          id: '123',
          message: `Storage error: ${error.message}`,
          timestamp: Date.now(),
          severity: 'error',
          source: 'infrastructure',
          field: 'basics.name',
          action: {
            label: 'Retry',
            handler: 'resume/retry'
          },
          dismissed: false
        })
      };
      
      // Re-register the mapper
      service.registerMapper('infrastructure', realMapper);
      
      // Act - Map the error as it would happen in the application layer
      const mappedError = service.mapError(originalError);
      
      // Assert - Verify the error is properly mapped for UI consumption
      expect(mappedError.message).toContain('Storage error');
      expect(mappedError.source).toBe('infrastructure');
      expect(mappedError.field).toBe('basics.name');
      expect(mappedError.action).toBeDefined();
      expect(mappedError.action?.label).toBe('Retry');
    });
  });
}); 