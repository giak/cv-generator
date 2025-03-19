import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useValidationResult } from '../useValidationResult';
import type {
    FormValidationResultType
} from '@cv-generator/shared';
import { ValidationLayerType } from '@cv-generator/shared';

describe('useValidationResult', () => {
  // Mock de la fonction de traduction
  const mockTranslate = (key: string, params?: Record<string, any>): string => {
    if (key === 'validation.email.invalid') {
      return 'Email invalide';
    }
    if (key === 'validation.name.required') {
      return 'Le nom est requis';
    }
    if (key === 'validation.with.params') {
      return `Valeur ${params?.value} invalide`;
    }
    return key;
  };
  
  // Mock des options i18n
  const createMockI18n = () => {
    const locale = ref('fr');
    return {
      t: mockTranslate,
      locale
    };
  };

  describe('avec i18n', () => {
    it('devrait traduire les messages d\'erreur avec des clés i18n', () => {
      const i18n = createMockI18n();
      
      // Création d'un résultat d'échec avec des erreurs ayant des clés i18n
      const failureResult: FormValidationResultType<any> = {
        success: false,
        error: [
          {
            field: 'email',
            message: 'Invalid email',
            code: 'EMAIL_INVALID',
            severity: 'error',
            i18nKey: 'validation.email.invalid',
            layer: ValidationLayerType.PRESENTATION
          },
          {
            field: 'name',
            message: 'Name is required',
            code: 'NAME_REQUIRED',
            severity: 'error',
            i18nKey: 'validation.name.required',
            layer: ValidationLayerType.PRESENTATION
          }
        ]
      };
      
      const { allErrors, setResult } = useValidationResult(null, { i18n });
      
      // Mise à jour du résultat
      setResult(failureResult);
      
      // Vérification que les messages sont traduits
      expect(allErrors.value.length).toBe(2);
      expect(allErrors.value[0].message).toBe('Email invalide');
      expect(allErrors.value[1].message).toBe('Le nom est requis');
    });
    
    it('devrait traduire les messages avec interpolation de paramètres', () => {
      const i18n = createMockI18n();
      
      // Création d'un résultat d'échec avec des erreurs ayant des paramètres
      const failureResult: FormValidationResultType<any> = {
        success: false,
        error: [
          {
            field: 'age',
            message: 'Value 17 is invalid',
            code: 'AGE_INVALID',
            severity: 'error',
            i18nKey: 'validation.with.params',
            i18nParams: { value: 17 },
            layer: ValidationLayerType.PRESENTATION
          }
        ]
      };
      
      const { allErrors, setResult } = useValidationResult(null, { i18n });
      
      // Mise à jour du résultat
      setResult(failureResult);
      
      // Vérification que les messages sont traduits avec les paramètres
      expect(allErrors.value.length).toBe(1);
      expect(allErrors.value[0].message).toBe('Valeur 17 invalide');
    });
    
    it('devrait réagir aux changements de locale', async () => {
      const i18n = createMockI18n();
      
      // Création d'un résultat d'échec avec des erreurs ayant des clés i18n
      const failureResult: FormValidationResultType<any> = {
        success: false,
        error: [
          {
            field: 'email',
            message: 'Invalid email',
            code: 'EMAIL_INVALID',
            severity: 'error',
            i18nKey: 'validation.email.invalid',
            layer: ValidationLayerType.PRESENTATION
          }
        ]
      };
      
      const { allErrors, setResult } = useValidationResult(null, { i18n });
      
      // Mise à jour du résultat
      setResult(failureResult);
      
      // Vérification initiale
      expect(allErrors.value[0].message).toBe('Email invalide');
      
      // Modification de la fonction de traduction pour simuler un changement de locale
      i18n.t = (key: string) => {
        if (key === 'validation.email.invalid') {
          return 'Invalid email';
        }
        return key;
      };
      
      // Déclencher le changement de locale
      i18n.locale.value = 'en';
      
      // Attendre que le watcher soit déclenché
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Vérification après changement de locale
      expect(allErrors.value[0].message).toBe('Invalid email');
    });
  });
  
  describe('sans i18n', () => {
    it('devrait utiliser les messages bruts sans traduction', () => {
      // Création d'un résultat d'échec avec des erreurs ayant des clés i18n
      const failureResult: FormValidationResultType<any> = {
        success: false,
        error: [
          {
            field: 'email',
            message: 'Invalid email',
            code: 'EMAIL_INVALID',
            severity: 'error',
            i18nKey: 'validation.email.invalid',
            layer: ValidationLayerType.PRESENTATION
          }
        ]
      };
      
      const { allErrors, setResult } = useValidationResult();
      
      // Mise à jour du résultat
      setResult(failureResult);
      
      // Vérification que les messages ne sont pas traduits
      expect(allErrors.value.length).toBe(1);
      expect(allErrors.value[0].message).toBe('Invalid email');
    });
  });
  
  describe('getFieldState', () => {
    it('devrait retourner un état de champ avec des messages traduits', () => {
      const i18n = createMockI18n();
      
      // Création d'un résultat d'échec avec des erreurs ayant des clés i18n
      const failureResult: FormValidationResultType<any> = {
        success: false,
        error: [
          {
            field: 'email',
            message: 'Invalid email',
            code: 'EMAIL_INVALID',
            severity: 'error',
            i18nKey: 'validation.email.invalid',
            layer: ValidationLayerType.PRESENTATION
          }
        ]
      };
      
      const { getFieldState, setResult } = useValidationResult(null, { i18n });
      
      // Mise à jour du résultat
      setResult(failureResult);
      
      // Obtention de l'état du champ
      const emailState = getFieldState('email');
      
      // Vérification que les messages sont traduits
      expect(emailState.errors.value.length).toBe(1);
      expect(emailState.firstErrorMessage.value).toBe('Email invalide');
    });
  });
}); 