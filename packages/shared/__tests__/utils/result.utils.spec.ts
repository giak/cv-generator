/**
 * Tests unitaires pour les utilitaires Result/Option
 */
import { describe, it, expect } from 'vitest';
import {
    createSuccess,
    createFailure,
    createSuccessWithWarnings,
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
      
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe('test value');
      expect(isSuccess(result)).toBe(true);
      expect(isFailure(result)).toBe(false);
      expect(result.hasWarnings()).toBe(false);
    });
    
    it('should handle complex objects', () => {
      const complexValue = { name: 'John', age: 30, info: { hobby: 'coding' } };
      const result = createSuccess(complexValue);
      
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual(complexValue);
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
      
      expect(result.isFailure()).toBe(true);
      expect(result.getErrors()).toEqual(error);
      expect(isFailure(result)).toBe(true);
      expect(isSuccess(result)).toBe(false);
    });
  });
  
  // Tests pour createSuccessWithWarnings
  describe('createSuccessWithWarnings', () => {
    it('should create a success result with warnings', () => {
      const warning = [{ 
        code: 'test_warning', 
        message: 'Test warning message', 
        field: 'testField',
        severity: 'warning' as const,
        layer: ValidationLayerType.DOMAIN
      }];
      
      const result = createSuccessWithWarnings('test value', warning);
      
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe('test value');
      expect(result.hasWarnings()).toBe(true);
      expect(result.getWarnings()).toEqual(warning);
    });
  });
  
  // Tests pour map
  describe('map', () => {
    it('should transform a success value', () => {
      const result = createSuccess('test');
      const mapped = map(result, value => value.toUpperCase());
      
      expect(mapped.isSuccess()).toBe(true);
      expect(mapped.getValue()).toBe('TEST');
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
      
      expect(mapped.isFailure()).toBe(true);
      expect(mapped.getErrors()).toEqual(error);
    });
  });
  
  // Tests pour flatMap
  describe('flatMap', () => {
    it('should chain successes', () => {
      const result = createSuccess(5);
      const chained = flatMap(result, value => 
        createSuccess(value * 2)
      );
      
      expect(chained.isSuccess()).toBe(true);
      expect(chained.getValue()).toBe(10);
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
      
      expect(chained.isFailure()).toBe(true);
      expect(chained.getErrors()).toEqual(error);
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
      
      expect(chained.isFailure()).toBe(true);
      expect(chained.getErrors()).toEqual(error);
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
    it('should combine multiple results and return success if all succeed', () => {
      const nameResult = createSuccess('John');
      const ageResult = createSuccess(30);
      
      const combined = combineValidationResults({
        name: nameResult,
        age: ageResult
      });
      
      expect(combined.isSuccess()).toBe(true);
      if (combined.isSuccess()) {
        expect(combined.getValue()).toEqual({
          name: 'John',
          age: 30
        });
      }
    });
    
    it('should return failure with all errors if any result fails', () => {
      const nameResult = createSuccess('John');
      const ageError = { 
        code: 'test_error', 
        message: 'Age must be positive', 
        field: 'age',
        severity: 'error' as const,
        layer: ValidationLayerType.DOMAIN
      };
      const ageResult = createFailure([ageError]);
      
      const combined = combineValidationResults({
        name: nameResult,
        age: ageResult
      });
      
      expect(combined.isFailure()).toBe(true);
      expect(combined.getErrors()).toHaveLength(1);
      expect(combined.getErrors()[0]).toEqual(ageError);
    });
  });
}); 