import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useErrorStore, type ErrorInfo } from '../error';
import { v4 as uuidv4 } from 'uuid';

// Mock pour uuid
vi.mock('uuid', () => ({
  v4: () => '123-mock-id'
}));

// Mock pour vue inject
vi.mock('vue', () => ({
  inject: vi.fn().mockImplementation(() => undefined)
}));

describe('ErrorStore', () => {
  beforeEach(() => {
    // Créer une nouvelle instance de Pinia pour chaque test
    setActivePinia(createPinia());
    
    // Mock console.error pour éviter les logs de test
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('state', () => {
    it('should have initial state', () => {
      const store = useErrorStore();
      
      expect(store.errors).toEqual([]);
      expect(store.hasErrors).toBe(false);
      expect(store.lastError).toBeNull();
    });
  });

  describe('actions', () => {
    it('should add an error', () => {
      const store = useErrorStore();
      const mockError: ErrorInfo = {
        id: '123',
        message: 'Test error',
        timestamp: 1000,
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      };
      
      store.addError(mockError);
      
      expect(store.errors).toHaveLength(1);
      expect(store.errors[0]).toEqual(mockError);
      expect(store.hasErrors).toBe(true);
      expect(store.lastError).toEqual(mockError);
    });

    it('should dismiss an error', () => {
      const store = useErrorStore();
      const mockError: ErrorInfo = {
        id: '123',
        message: 'Test error',
        timestamp: 1000,
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      };
      
      store.addError(mockError);
      expect(store.hasErrors).toBe(true);
      
      store.dismissError('123');
      expect(store.errors[0].dismissed).toBe(true);
      expect(store.hasErrors).toBe(false);
    });

    it('should clear all errors', () => {
      const store = useErrorStore();
      const mockError1: ErrorInfo = {
        id: '123',
        message: 'Test error 1',
        timestamp: 1000,
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      };
      const mockError2: ErrorInfo = {
        id: '456',
        message: 'Test error 2',
        timestamp: 2000,
        severity: 'warning',
        source: 'application',
        dismissed: false
      };
      
      store.addError(mockError1);
      store.addError(mockError2);
      expect(store.errors).toHaveLength(2);
      
      store.clearErrors();
      expect(store.errors).toHaveLength(0);
      expect(store.hasErrors).toBe(false);
      expect(store.lastError).toBeNull();
    });

    it('should handle executeWithErrorHandling success case', async () => {
      const store = useErrorStore();
      const successOperation = vi.fn().mockResolvedValue('success');
      
      const result = await store.executeWithErrorHandling(successOperation);
      
      expect(result).toBe('success');
      expect(successOperation).toHaveBeenCalled();
      expect(store.errors).toHaveLength(0);
    });

    it('should handle executeWithErrorHandling error case with fallback', async () => {
      const store = useErrorStore();
      
      // Espionner la méthode addError
      const addErrorSpy = vi.spyOn(store, 'addError');
      
      // Créer une opération qui échoue
      const failOperation = vi.fn().mockRejectedValue(new Error('Test failure'));
      
      // Exécuter l'opération avec gestion d'erreur
      const result = await store.executeWithErrorHandling(failOperation);
      
      // Vérifier que l'opération a échoué
      expect(result).toBeUndefined();
      expect(failOperation).toHaveBeenCalled();
      
      // Vérifier que addError a été appelée
      expect(addErrorSpy).toHaveBeenCalled();
      
      // Vérifier qu'une erreur a été ajoutée
      expect(store.errors.length).toBeGreaterThan(0);
      expect(store.errors[0].message).toBe('Test failure');
      expect(store.errors[0].severity).toBe('error');
      expect(store.errors[0].source).toBe('application');
    });
  });

  describe('getters', () => {
    it('should get field errors', () => {
      const store = useErrorStore();
      const fieldError: ErrorInfo = {
        id: '123',
        message: 'Invalid email',
        timestamp: 1000,
        severity: 'error',
        source: 'infrastructure',
        field: 'basics.email',
        dismissed: false
      };
      const otherError: ErrorInfo = {
        id: '456',
        message: 'Other error',
        timestamp: 2000,
        severity: 'warning',
        source: 'application',
        dismissed: false
      };
      
      store.addError(fieldError);
      store.addError(otherError);
      
      expect(store.getFieldError('basics.email')).toEqual(fieldError);
      expect(store.getFieldError('non.existent')).toBeUndefined();
      expect(store.hasFieldError('basics.email')).toBe(true);
      expect(store.hasFieldError('non.existent')).toBe(false);
    });

    it('should not return dismissed errors when getting field errors', () => {
      const store = useErrorStore();
      const fieldError: ErrorInfo = {
        id: '123',
        message: 'Invalid email',
        timestamp: 1000,
        severity: 'error',
        source: 'infrastructure',
        field: 'basics.email',
        dismissed: false
      };
      
      store.addError(fieldError);
      expect(store.getFieldError('basics.email')).toEqual(fieldError);
      
      store.dismissError('123');
      expect(store.getFieldError('basics.email')).toBeUndefined();
    });
  });
}); 