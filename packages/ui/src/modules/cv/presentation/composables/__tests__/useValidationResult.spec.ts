/**
 * Tests unitaires pour le composable useValidationResult
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

// Import from our mock module
import {
  ValidationErrorInterface,
  createSuccess,
  createFailure
} from './__mocks__/shared';

// Mock the module before importing the component that uses it
vi.mock('@cv-generator/shared', () => {
  // Import the mock implementation
  return import('./__mocks__/shared');
});

// Import after mocking
import { useValidationResult } from '../validation/useValidationResult';

describe('useValidationResult', () => {
  // Créer des données de test
  const validationErrors: ValidationErrorInterface[] = [
    { code: 'ERR1', message: 'Erreur 1', field: 'field1', severity: 'error', layer: 'domain' },
    { code: 'ERR2', message: 'Erreur 2', field: 'field2', severity: 'error', layer: 'domain' },
    { code: 'WARN1', message: 'Warning 1', field: 'field1', severity: 'warning', layer: 'domain' }
  ];
  
  const successResult = createSuccess({ id: 1, name: 'Test' });
  const failureResult = createFailure(validationErrors);
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('devrait initialiser avec un résultat null par défaut', () => {
    const { result } = useValidationResult();
    expect(result.value).toBeNull();
  });
  
  it('devrait initialiser avec le résultat fourni', () => {
    const { result } = useValidationResult(successResult);
    expect(result.value).toStrictEqual(successResult);
  });
  
  it('devrait permettre de mettre à jour le résultat', () => {
    const { result, setResult } = useValidationResult();
    
    expect(result.value).toBeNull();
    
    setResult(successResult);
    expect(result.value).toStrictEqual(successResult);
    
    setResult(failureResult);
    expect(result.value).toStrictEqual(failureResult);
  });
  
  it('devrait fournir isSuccess et isFailure réactifs', () => {
    const { isSuccess, isFailure, setResult } = useValidationResult();
    
    // Initial
    expect(isSuccess.value).toBe(false);
    expect(isFailure.value).toBe(false);
    
    // Succès
    setResult(successResult);
    expect(isSuccess.value).toBe(true);
    expect(isFailure.value).toBe(false);
    
    // Échec
    setResult(failureResult);
    expect(isSuccess.value).toBe(false);
    expect(isFailure.value).toBe(true);
  });
  
  it('devrait extraire correctement les erreurs et warnings', () => {
    const { allErrors, allWarnings, setResult } = useValidationResult();
    
    setResult(failureResult);
    
    expect(allErrors.value).toHaveLength(2); // 2 erreurs
    expect(allWarnings.value).toHaveLength(1); // 1 warning
    
    expect(allErrors.value[0].code).toBe('ERR1');
    expect(allErrors.value[1].code).toBe('ERR2');
    expect(allWarnings.value[0].code).toBe('WARN1');
  });
  
  it('devrait gérer correctement l\'état des champs', () => {
    const { getFieldState, setResult } = useValidationResult();
    
    setResult(failureResult);
    
    const field1State = getFieldState('field1');
    const field2State = getFieldState('field2');
    const field3State = getFieldState('field3'); // Champ sans erreur
    
    // field1 a une erreur et un warning
    expect(field1State.errors.value).toHaveLength(2);
    expect(field1State.hasError.value).toBe(true);
    expect(field1State.hasWarning.value).toBe(true);
    expect(field1State.highestSeverity.value).toBe('error');
    expect(field1State.firstErrorMessage.value).toBe('Erreur 1');
    
    // field2 a une erreur
    expect(field2State.errors.value).toHaveLength(1);
    expect(field2State.hasError.value).toBe(true);
    expect(field2State.hasWarning.value).toBe(false);
    
    // field3 n'a pas d'erreur
    expect(field3State.errors.value).toHaveLength(0);
    expect(field3State.hasError.value).toBe(false);
    expect(field3State.hasWarning.value).toBe(false);
    expect(field3State.highestSeverity.value).toBeNull();
    expect(field3State.firstErrorMessage.value).toBe('');
  });
  
  it('devrait garder les mêmes références pour les états de champs', () => {
    const { getFieldState } = useValidationResult(failureResult);
    
    const field1State1 = getFieldState('field1');
    const field1State2 = getFieldState('field1');
    
    expect(field1State1).toBe(field1State2); // Même référence
  });
  
  it('devrait lister les champs avec erreurs et warnings', () => {
    const { fieldsWithErrors, fieldsWithWarnings, setResult } = useValidationResult();
    
    setResult(failureResult);
    
    expect(fieldsWithErrors.value).toEqual(['field1', 'field2']);
    expect(fieldsWithWarnings.value).toEqual(['field1']);
  });
  
  it('devrait réinitialiser correctement le résultat', () => {
    const { result, resetResult, isSuccess, isFailure } = useValidationResult(failureResult);
    
    expect(result.value).not.toBeNull();
    expect(isFailure.value).toBe(true);
    
    resetResult();
    
    expect(result.value).toBeNull();
    expect(isSuccess.value).toBe(false);
    expect(isFailure.value).toBe(false);
  });
  
  it('devrait gérer les flags isDirty des champs', () => {
    const { getFieldState } = useValidationResult(failureResult);
    
    const field1State = getFieldState('field1');
    
    expect(field1State.isDirty.value).toBe(false);
    
    field1State.markDirty();
    expect(field1State.isDirty.value).toBe(true);
    
    field1State.reset();
    expect(field1State.isDirty.value).toBe(false);
  });
  
  it('devrait compter correctement le total des problèmes', () => {
    const { totalIssues, setResult } = useValidationResult();
    
    expect(totalIssues.value).toBe(0);
    
    setResult(failureResult);
    expect(totalIssues.value).toBe(3); // 2 erreurs + 1 warning
  });
}); 