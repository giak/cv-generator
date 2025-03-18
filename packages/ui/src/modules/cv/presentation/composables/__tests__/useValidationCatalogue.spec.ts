/**
 * Tests unitaires pour le composable useValidationCatalogue
 */

import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { useValidationCatalogue } from '../validation/useValidationCatalogue';
import { ValidationLayerType } from '@cv-generator/shared';
import type {
  ValidationErrorInterface,
  ValidationSeverityType,
  HelpMessageInterface
} from '@cv-generator/shared';

describe('useValidationCatalogue', () => {
  // Données de test
  const errorMessages: ValidationErrorInterface[] = [
    { 
      code: 'ERR1',
      message: 'Erreur 1',
      i18nKey: 'errors.test.error1',
      field: 'field1',
      severity: 'error' as ValidationSeverityType,
      layer: ValidationLayerType.DOMAIN
    },
    { 
      code: 'ERR2',
      message: 'Erreur 2',
      i18nKey: 'errors.test.error2',
      field: 'field2',
      severity: 'error' as ValidationSeverityType,
      layer: ValidationLayerType.DOMAIN
    },
    { 
      code: 'ERR3',
      message: 'Erreur 3',
      i18nKey: 'errors.test.error3',
      field: 'field1',
      severity: 'warning' as ValidationSeverityType,
      layer: ValidationLayerType.PRESENTATION
    }
  ];
  
  const helpMessages: HelpMessageInterface[] = [
    {
      id: 'HELP1',
      title: 'Aide 1',
      content: 'Contenu d\'aide 1',
      field: 'field1',
      autoShow: true
    },
    {
      id: 'HELP2',
      title: 'Aide 2',
      content: 'Contenu d\'aide 2',
      field: 'field2',
      autoShow: false
    }
  ];
  
  describe('i18n support', () => {
    it('should translate error messages using i18n', () => {
      const mockI18n = {
        t: vi.fn((key) => `translated-${key}`),
        locale: ref('fr')
      };
      
      const { addErrorMessage, getErrorMessage } = useValidationCatalogue({
        i18n: mockI18n
      });
      
      const testError: ValidationErrorInterface = {
        code: 'ERR1',
        message: 'Field is required',
        i18nKey: 'errors.required',
        field: 'name',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.PRESENTATION
      };
      
      addErrorMessage(testError);
      
      const error = getErrorMessage('ERR1');
      expect(error?.message).toBe('translated-errors.required');
    });

    it('should use fallback when translation fails', () => {
      const mockI18n = {
        t: vi.fn().mockImplementation(() => ''),
        locale: ref('fr')
      };
      
      const { addErrorMessage, getErrorMessage } = useValidationCatalogue({
        i18n: mockI18n
      });
      
      const testError: ValidationErrorInterface = {
        code: 'ERR1',
        message: 'Invalid field',
        i18nKey: 'errors.invalid',
        field: 'email',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.PRESENTATION
      };
      
      addErrorMessage(testError);
      
      const error = getErrorMessage('ERR1');
      expect(error?.message).toBe('Invalid field');
    });

    it('should update messages when locale changes', async () => {
      const locale = ref('fr');
      const mockI18n = {
        t: vi.fn((key) => `${locale.value}-${key}`),
        locale
      };
      
      const { addErrorMessage, getErrorMessage } = useValidationCatalogue({
        i18n: mockI18n
      });
      
      const testError: ValidationErrorInterface = {
        code: 'ERR1',
        message: 'Field is required',
        i18nKey: 'errors.required',
        field: 'name',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.PRESENTATION
      };
      
      addErrorMessage(testError);
      
      expect(getErrorMessage('ERR1')?.message).toBe('fr-errors.required');
      
      locale.value = 'en';
      await nextTick();
      
      expect(getErrorMessage('ERR1')?.message).toBe('en-errors.required');
    });
  });
  
  it('should initialize with empty catalogues by default', () => {
    const { getErrorMessage, getHelpMessage } = useValidationCatalogue();
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getHelpMessage('HELP1')).toBeUndefined();
  });
  
  it('should initialize with provided messages', () => {
    const { addErrorMessages, addHelpMessages, getErrorMessage, getHelpMessage } = useValidationCatalogue();
    
    addErrorMessages(errorMessages);
    addHelpMessages(helpMessages);
    
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
  });
  
  it('should allow adding error messages', () => {
    const { addErrorMessage, getErrorMessage } = useValidationCatalogue();
    
    addErrorMessage(errorMessages[0]);
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
  });
  
  it('should allow adding multiple error messages', () => {
    const { addErrorMessages, getErrorMessage } = useValidationCatalogue();
    
    addErrorMessages(errorMessages);
    
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
    expect(getErrorMessage('ERR2')).toEqual(errorMessages[1]);
  });
  
  it('should allow adding help messages', () => {
    const { addHelpMessage, getHelpMessage } = useValidationCatalogue();
    
    addHelpMessage(helpMessages[0]);
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
  });
  
  it('should allow adding multiple help messages', () => {
    const { addHelpMessages, getHelpMessage } = useValidationCatalogue();
    
    addHelpMessages(helpMessages);
    
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
    expect(getHelpMessage('HELP2')).toEqual(helpMessages[1]);
  });
  
  it('should get errors for a specific field', () => {
    const { addErrorMessages, getErrorsForField } = useValidationCatalogue();
    
    addErrorMessages(errorMessages);
    
    const field1Errors = getErrorsForField('field1');
    const field2Errors = getErrorsForField('field2');
    const field3Errors = getErrorsForField('field3');
    
    expect(field1Errors).toHaveLength(2);
    expect(field1Errors[0].code).toBe('ERR1');
    expect(field1Errors[1].code).toBe('ERR3');
    
    expect(field2Errors).toHaveLength(1);
    expect(field2Errors[0].code).toBe('ERR2');
    
    expect(field3Errors).toHaveLength(0);
  });
  
  it('should get help messages for a specific field', () => {
    const { addHelpMessages, getHelpForField } = useValidationCatalogue();
    
    addHelpMessages(helpMessages);
    
    const field1Help = getHelpForField('field1');
    const field2Help = getHelpForField('field2');
    const field3Help = getHelpForField('field3');
    
    expect(field1Help).toHaveLength(1);
    expect(field1Help[0].id).toBe('HELP1');
    
    expect(field2Help).toHaveLength(1);
    expect(field2Help[0].id).toBe('HELP2');
    
    expect(field3Help).toHaveLength(0);
  });
  
  it('should filter help messages to show automatically', () => {
    const { addHelpMessages, autoShowHelp } = useValidationCatalogue();
    
    addHelpMessages(helpMessages);
    
    expect(autoShowHelp.value).toHaveLength(1);
    expect(autoShowHelp.value[0].id).toBe('HELP1');
  });
  
  it('should replace error catalogue', () => {
    const { addErrorMessages, setErrorCatalogue, getErrorMessage } = useValidationCatalogue();
    
    addErrorMessages([errorMessages[0]]);
    expect(getErrorMessage('ERR1')).toBeDefined();
    expect(getErrorMessage('ERR2')).toBeUndefined();
    
    setErrorCatalogue([errorMessages[1]]);
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getErrorMessage('ERR2')).toBeDefined();
  });
  
  it('should reset catalogue', () => {
    const { addErrorMessages, addHelpMessages, resetCatalogue, getErrorMessage, getHelpMessage } = useValidationCatalogue();
    
    addErrorMessages(errorMessages);
    addHelpMessages(helpMessages);
    
    expect(getErrorMessage('ERR1')).toBeDefined();
    expect(getHelpMessage('HELP1')).toBeDefined();
    
    resetCatalogue();
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getHelpMessage('HELP1')).toBeUndefined();
  });
  
  it('devrait utiliser le cache correctement', () => {
    const { getErrorsForField } = useValidationCatalogue({ enableCache: true });
    
    // Premier appel (remplit le cache)
    const field1Errors1 = getErrorsForField('field1');
    expect(field1Errors1).toHaveLength(2);
    
    // Deuxième appel (doit utiliser le cache)
    const field1Errors2 = getErrorsForField('field1');
    expect(field1Errors2).toBe(field1Errors1); // Même référence grâce au cache
  });
  
  it('devrait désactiver le cache si demandé', () => {
    const { getErrorsForField } = useValidationCatalogue({ enableCache: false });
    
    // Premier appel
    const field1Errors1 = getErrorsForField('field1');
    expect(field1Errors1).toHaveLength(2);
    
    // Deuxième appel (ne doit pas utiliser le cache)
    const field1Errors2 = getErrorsForField('field1');
    expect(field1Errors2).not.toBe(field1Errors1); // Référence différente car pas de cache
    expect(field1Errors2).toHaveLength(2); // Mais même contenu
  });
  
  it('should replace help catalogue', () => {
    const { addHelpMessages, setHelpCatalogue, getHelpMessage } = useValidationCatalogue();
    
    addHelpMessages([helpMessages[0]]);
    expect(getHelpMessage('HELP1')).toBeDefined();
    expect(getHelpMessage('HELP2')).toBeUndefined();
    
    setHelpCatalogue([helpMessages[1]]);
    
    expect(getHelpMessage('HELP1')).toBeUndefined();
    expect(getHelpMessage('HELP2')).toBeDefined();
  });
}); 