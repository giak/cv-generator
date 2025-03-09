/**
 * Tests unitaires pour les utilitaires Result/Option
 */
import { describe, it, expect } from 'vitest';
import { 
  createSuccess, 
  createFailure, 
  isSuccess, 
  isFailure, 
  map, 
  flatMap, 
  getErrorsForField,
  combineValidationResults 
} from '../../src/utils/result.utils';
import { ValidationLayerType } from '../../src/enums/validation.enum';

describe('Result Pattern Utilities', () => {
  // Tests pour createSuccess et isSuccess
  describe('createSuccess & isSuccess', () => {
    it('should create a success result', () => {
      const result = createSuccess('test value');
      
      expect(result).toEqual({
        success: true,
        value: 'test value'
      });
      expect(isSuccess(result)).toBe(true);
      expect(isFailure(result)).toBe(false);
    });
    
    it('should handle complex objects', () => {
      const complexValue = { name: 'John', age: 30, info: { hobby: 'coding' } };
      const result = createSuccess(complexValue);
      
      expect(result.success).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toEqual(complexValue);
      }
    });
  });
  
  // Tests pour createFailure et isFailure
  describe('createFailure & isFailure', () => {
    it('should create a failure result', () => {
      const error = [{ 
        code: 'test_error', 
        message: 'Test error message', 
        field: 'testField',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      }];
      
      const result = createFailure(error);
      
      expect(result).toEqual({
        success: false,
        error
      });
      expect(isFailure(result)).toBe(true);
      expect(isSuccess(result)).toBe(false);
    });
  });
  
  // Tests pour map
  describe('map', () => {
    it('should transform a success value', () => {
      const result = createSuccess('test');
      const mapped = map(result, value => value.toUpperCase());
      
      expect(isSuccess(mapped)).toBe(true);
      expect(mapped.success ? mapped.value : null).toBe('TEST');
    });
    
    it('should pass through failure results', () => {
      const error = [{ 
        code: 'test_error', 
        message: 'Test error message', 
        field: 'testField',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      }];
      
      const result = createFailure(error);
      const mapped = map(result, (value: unknown) => String(value));
      
      expect(isFailure(mapped)).toBe(true);
      expect(mapped.success ? null : mapped.error).toEqual(error);
    });
  });
  
  // Tests pour flatMap
  describe('flatMap', () => {
    it('should chain successes', () => {
      const result = createSuccess(5);
      const chained = flatMap(result, value => 
        createSuccess(value * 2)
      );
      
      expect(isSuccess(chained)).toBe(true);
      expect(chained.success ? chained.value : null).toBe(10);
    });
    
    it('should chain from success to failure', () => {
      const result = createSuccess('test');
      const error = [{ 
        code: 'validation_error', 
        message: 'Validation failed', 
        field: 'testField',
        severity: 'error' as const,
        layer: ValidationLayerType.APPLICATION
      }];
      
      const chained = flatMap(result, () => createFailure(error));
      
      expect(isFailure(chained)).toBe(true);
      expect(chained.success ? null : chained.error).toEqual(error);
    });
    
    it('should not process failures', () => {
      const error = [{ 
        code: 'original_error', 
        message: 'Original error', 
        field: 'field1',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      }];
      
      const result = createFailure(error);
      let processedCount = 0;
      
      const chained = flatMap(result, () => {
        processedCount++;
        return createSuccess('never reached');
      });
      
      expect(isFailure(chained)).toBe(true);
      expect(chained.success ? null : chained.error).toEqual(error);
      expect(processedCount).toBe(0); // La fonction ne doit pas être appelée
    });
  });
  
  // Tests pour getErrorsForField
  describe('getErrorsForField', () => {
    it('should return empty array for success results', () => {
      const result = createSuccess({ name: 'Test' });
      const errors = getErrorsForField(result, 'name');
      
      expect(errors).toEqual([]);
    });
    
    it('should filter errors by field name', () => {
      const errors = [
        { 
          code: 'error1', 
          message: 'Error 1', 
          field: 'name',
          severity: 'error' as const,
          layer: ValidationLayerType.DOMAIN
        },
        { 
          code: 'error2', 
          message: 'Error 2', 
          field: 'email',
          severity: 'warning' as const,
          layer: ValidationLayerType.APPLICATION
        },
        { 
          code: 'error3', 
          message: 'Error 3', 
          field: 'name',
          severity: 'info' as const,
          layer: ValidationLayerType.PRESENTATION
        }
      ];
      
      const result = createFailure(errors);
      const nameErrors = getErrorsForField(result, 'name');
      
      expect(nameErrors).toHaveLength(2);
      expect(nameErrors[0].code).toBe('error1');
      expect(nameErrors[1].code).toBe('error3');
    });
  });
  
  // Tests pour combineValidationResults
  describe('combineValidationResults', () => {
    it('should combine multiple successful results', () => {
      const results = {
        name: createSuccess('John'),
        age: createSuccess(30)
      };
      
      const combined = combineValidationResults(results);
      
      expect(isSuccess(combined)).toBe(true);
      expect(combined.success ? combined.value : null).toEqual({
        name: 'John',
        age: 30
      });
    });
    
    it('should collect all errors from multiple results', () => {
      const nameError = { 
        code: 'invalid_name', 
        message: 'Invalid name', 
        field: 'name',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      };
      
      const ageError = { 
        code: 'invalid_age', 
        message: 'Invalid age', 
        field: 'age',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      };
      
      const results = {
        name: createFailure([nameError]),
        age: createFailure([ageError])
      };
      
      const combined = combineValidationResults(results);
      
      expect(isFailure(combined)).toBe(true);
      expect(combined.success ? null : combined.error).toHaveLength(2);
      expect(combined.success ? null : combined.error).toContainEqual(nameError);
      expect(combined.success ? null : combined.error).toContainEqual(ageError);
    });
    
    it('should handle mixed success and failure results', () => {
      const ageError = { 
        code: 'invalid_age', 
        message: 'Invalid age', 
        field: 'age',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      };
      
      const results = {
        name: createSuccess('John'),
        age: createFailure([ageError])
      };
      
      const combined = combineValidationResults(results);
      
      expect(isFailure(combined)).toBe(true);
      expect(combined.success ? null : combined.error).toHaveLength(1);
      expect(combined.success ? null : combined.error[0]).toEqual(ageError);
    });
  });
}); 