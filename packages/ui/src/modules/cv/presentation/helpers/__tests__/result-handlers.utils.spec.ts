/**
 * Tests unitaires pour les utilitaires result-handlers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';

// Import directly from our mock module instead of mocking the import
import {
  ResultType,
  ValidationErrorInterface,
  OptionType,
  FormValidationResultType,
  isSuccess,
  isFailure,
  createSuccess,
  createFailure
} from '../../composables/__tests__/__mocks__/shared';

// The import path is relative to the test file
vi.mock('@cv-generator/shared', () => {
  // Import the mock implementation directly
  return import('../../composables/__tests__/__mocks__/shared');
});

// Import after mock
import {
  watchResult,
  combineFieldResults,
  applyAsyncValidation,
  optionToResult,
  zodErrorToValidationErrors,
  validateRelatedFields
} from '../result-handlers.utils';

describe('result-handlers.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  describe('watchResult', () => {
    it('devrait appeler onSuccess lorsque le résultat est un succès', async () => {
      const resultRef = ref<ResultType<string>>({ success: true, value: 'test' });
      const onSuccess = vi.fn();
      const onFailure = vi.fn();
      const onComplete = vi.fn();
      
      watchResult(resultRef, { onSuccess, onFailure, onComplete });
      
      // Mettre à jour le résultat
      resultRef.value = { success: true, value: 'updated' };
      
      // Attendre le prochain cycle d'évènements pour que les watchers se déclenchent
      await vi.runAllTimers();
      
      expect(onSuccess).toHaveBeenCalledWith('updated');
      expect(onFailure).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
    
    it('devrait appeler onFailure lorsque le résultat est un échec', async () => {
      const resultRef = ref<ResultType<never, string>>({ success: false, error: 'error' });
      const onSuccess = vi.fn();
      const onFailure = vi.fn();
      const onComplete = vi.fn();
      
      watchResult(resultRef, { onSuccess, onFailure, onComplete });
      
      // Mettre à jour le résultat
      resultRef.value = { success: false, error: 'updated error' };
      
      // Attendre le prochain cycle d'évènements
      await vi.runAllTimers();
      
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledWith('updated error');
      expect(onComplete).toHaveBeenCalled();
    });
    
    it('ne devrait rien faire si le résultat est null', async () => {
      const resultRef = ref(null);
      const onSuccess = vi.fn();
      const onFailure = vi.fn();
      const onComplete = vi.fn();
      
      watchResult(resultRef, { onSuccess, onFailure, onComplete });
      
      // Attendre le prochain cycle d'évènements
      await vi.runAllTimers();
      
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });
  
  describe('combineFieldResults', () => {
    it('devrait combiner des résultats de succès en un seul résultat', () => {
      const field1 = ref({ success: true, value: 'value1' });
      const field2 = ref({ success: true, value: 'value2' });
      
      const result = combineFieldResults({ field1, field2 });
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ field1: 'value1', field2: 'value2' });
    });
    
    it('devrait créer un échec si un champ a une erreur', () => {
      const field1 = ref({ success: true, value: 'value1' });
      const field2 = ref({ 
        success: false, 
        error: [{ code: 'ERR', message: 'Error', field: 'field2', severity: 'error', layer: 'domain' }] 
      });
      
      const result = combineFieldResults({ field1, field2 });
      
      expect(result.success).toBe(false);
      expect(result.error).toHaveLength(1);
      expect(result.error[0].code).toBe('ERR');
    });
    
    it('devrait inclure les warnings dans le résultat de succès', () => {
      const field1 = ref({ 
        success: true, 
        value: 'value1',
        warnings: [{ code: 'WARN', message: 'Warning', field: 'field1', severity: 'warning', layer: 'domain' }]
      });
      const field2 = ref({ success: true, value: 'value2' });
      
      const result = combineFieldResults({ field1, field2 });
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({ field1: 'value1', field2: 'value2' });
      // Les warnings sont maintenant dans errors mais avec severity "warning"
      expect(result.error).toHaveLength(1);
      expect(result.error[0].code).toBe('WARN');
    });
    
    it('devrait gérer les champs non validés', () => {
      const field1 = ref({ success: true, value: 'value1' });
      const field2 = ref(null);
      
      const result = combineFieldResults({ field1, field2 });
      
      expect(result.success).toBe(false);
      expect(result.error).toHaveLength(1);
      expect(result.error[0].code).toBe('FIELD_NOT_VALIDATED');
      expect(result.error[0].field).toBe('field2');
    });
  });
  
  describe('applyAsyncValidation', () => {
    it('devrait appliquer la validation et mettre à jour le résultat en cas de succès', async () => {
      const validate = vi.fn().mockResolvedValue({ success: true, value: 'validated' });
      const resultRef = ref(null);
      const loadingRef = ref(false);
      
      await applyAsyncValidation(validate, resultRef, 'value', loadingRef);
      
      expect(validate).toHaveBeenCalledWith('value');
      expect(resultRef.value).toEqual({ success: true, value: 'validated' });
      expect(loadingRef.value).toBe(false);
    });
    
    it('devrait mettre à jour le résultat en cas d\'échec de validation', async () => {
      const errorData = [{ code: 'ERR', message: 'Error', field: 'field', severity: 'error', layer: 'domain' }];
      const validate = vi.fn().mockResolvedValue({ success: false, error: errorData });
      const resultRef = ref(null);
      const loadingRef = ref(false);
      
      await applyAsyncValidation(validate, resultRef, 'value', loadingRef);
      
      expect(validate).toHaveBeenCalledWith('value');
      expect(resultRef.value).toEqual({ success: false, error: errorData });
      expect(loadingRef.value).toBe(false);
    });
    
    it('devrait gérer les erreurs d\'exécution', async () => {
      const error = new Error('Validation failed');
      const validate = vi.fn().mockRejectedValue(error);
      const resultRef = ref<ResultType<unknown, ValidationErrorInterface[]> | null>(null);
      const loadingRef = ref(false);
      
      await applyAsyncValidation(validate, resultRef, 'value', loadingRef);
      
      expect(validate).toHaveBeenCalledWith('value');
      
      // Vérifier que le résultat est défini
      expect(resultRef.value).not.toBeNull();
      
      // Assertions typées correctement
      if (resultRef.value) {
        expect(resultRef.value.success).toBe(false);
        if (!resultRef.value.success) { // Type guard
          expect(resultRef.value.error[0].message).toBe('Validation failed');
        }
      }
      
      expect(loadingRef.value).toBe(false);
    });
  });
  
  describe('optionToResult', () => {
    it('devrait retourner un succès si l\'option a une valeur', () => {
      const option = 'value';
      const errorFactory = vi.fn();
      
      const result = optionToResult(option, errorFactory);
      
      expect(result.success).toBe(true);
      expect(result.value).toBe('value');
      expect(errorFactory).not.toHaveBeenCalled();
    });
    
    it('devrait retourner un échec si l\'option est undefined', () => {
      const option = undefined;
      const error = { code: 'ERR', message: 'Missing value', field: 'field', severity: 'error', layer: 'domain' };
      const errorFactory = vi.fn().mockReturnValue(error);
      
      const result = optionToResult(option, errorFactory);
      
      expect(result.success).toBe(false);
      expect(result.error).toEqual([error]);
      expect(errorFactory).toHaveBeenCalled();
    });
    
    it('devrait gérer un tableau d\'erreurs', () => {
      const option = undefined;
      const errors = [
        { code: 'ERR1', message: 'Error 1', field: 'field', severity: 'error', layer: 'domain' },
        { code: 'ERR2', message: 'Error 2', field: 'field', severity: 'error', layer: 'domain' }
      ];
      const errorFactory = vi.fn().mockReturnValue(errors);
      
      const result = optionToResult(option, errorFactory);
      
      expect(result.success).toBe(false);
      expect(result.error).toEqual(errors);
    });
  });
  
  describe('zodErrorToValidationErrors', () => {
    it('devrait convertir une erreur Zod en ValidationErrorInterface[]', () => {
      const zodError = {
        errors: [
          { path: ['name'], message: 'Required', code: 'invalid_type' },
          { path: ['email'], message: 'Invalid email', code: 'invalid_string' }
        ]
      };
      
      const errors = zodErrorToValidationErrors(zodError);
      
      expect(errors).toHaveLength(2);
      expect(errors[0]).toEqual({
        code: 'VALIDATION_INVALID_TYPE',
        message: 'Required',
        field: 'name',
        severity: 'error',
        layer: 'presentation'
      });
      expect(errors[1]).toEqual({
        code: 'VALIDATION_INVALID_STRING',
        message: 'Invalid email',
        field: 'email',
        severity: 'error',
        layer: 'presentation'
      });
    });
    
    it('devrait utiliser "global" comme champ par défaut si le chemin est vide', () => {
      const zodError = {
        errors: [
          { path: [], message: 'Invalid data', code: 'custom' }
        ]
      };
      
      const errors = zodErrorToValidationErrors(zodError);
      
      expect(errors[0].field).toBe('global');
    });
    
    it('devrait ajouter un préfixe aux champs si fourni', () => {
      const zodError = {
        errors: [
          { path: ['name'], message: 'Required', code: 'invalid_type' }
        ]
      };
      
      const errors = zodErrorToValidationErrors(zodError, 'user');
      
      expect(errors[0].field).toBe('user.name');
    });
  });
  
  describe('validateRelatedFields', () => {
    it('devrait retourner un tableau vide si la validation réussit', () => {
      const isInvalid = vi.fn().mockReturnValue(false);
      const fields = ['startDate', 'endDate'];
      const values = ['2023-01-01', '2023-01-31'];
      
      const errors = validateRelatedFields(fields, isInvalid, 'Invalid date range', values);
      
      expect(errors).toHaveLength(0);
      expect(isInvalid).toHaveBeenCalledWith('2023-01-01', '2023-01-31');
    });
    
    it('devrait retourner des erreurs pour tous les champs concernés si la validation échoue', () => {
      const isInvalid = vi.fn().mockReturnValue(true);
      const fields = ['startDate', 'endDate'];
      const values = ['2023-01-31', '2023-01-01'];
      
      const errors = validateRelatedFields(fields, isInvalid, 'Invalid date range', values);
      
      expect(errors).toHaveLength(2);
      expect(errors[0].field).toBe('startDate');
      expect(errors[1].field).toBe('endDate');
      expect(errors[0].message).toBe('Invalid date range');
      expect(errors[1].message).toBe('Invalid date range');
    });
    
    it('devrait utiliser une fonction pour générer le message d\'erreur', () => {
      const isInvalid = vi.fn().mockReturnValue(true);
      const fields = ['startDate', 'endDate'];
      const values = ['2023-01-31', '2023-01-01'];
      const errorMessageFn = (...fieldNames: string[]) => 
        `${fieldNames[0]} must be before ${fieldNames[1]}`;
      
      const errors = validateRelatedFields(fields, isInvalid, errorMessageFn, values);
      
      expect(errors).toHaveLength(2);
      expect(errors[0].message).toBe('startDate must be before endDate');
      expect(errors[1].message).toBe('startDate must be before endDate');
    });
  });
}); 