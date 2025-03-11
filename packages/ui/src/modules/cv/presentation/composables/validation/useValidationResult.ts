/**
 * useValidationResult.ts
 * 
 * Composable Vue pour manipuler les résultats de validation basés sur le pattern Result/Option.
 * Ce composable facilite l'intégration des objets ResultType dans les composants Vue.
 */

import { ref, computed, Ref, ComputedRef, UnwrapRef } from 'vue';

// Using type imports to avoid runtime dependencies
import type {
  ResultType,
  ValidationErrorInterface,
  ValidationSeverityType,
  FormValidationResultType
} from '@cv-generator/shared';

// Import de l'enum ValidationLayerType pour l'utiliser
import { ValidationLayerType as LayerType } from '@cv-generator/shared';

// These utility functions will be provided by consumers of this composable
// This avoids direct runtime dependencies
const isSuccess = <T, E>(result: { success: boolean, value?: T, error?: E }): boolean => {
  return result.success === true;
};

const isFailure = <T, E>(result: { success: boolean, value?: T, error?: E }): boolean => {
  return result.success === false;
};

const getErrorsForField = (
  result: { success: boolean, error?: any[] },
  fieldName: string
): any[] => {
  if (result.success) return [];
  
  // Utiliser une assertion de type sécurisée
  const errors = (result as { success: false, error: any[] }).error || [];
  return errors.filter(err => err.field === fieldName);
};

export interface ValidationResultOptionsInterface {
  /**
   * Activation du mode debug (logs supplémentaires)
   */
  debug?: boolean;
  
  /**
   * Temps en ms avant de considérer qu'un champ a été modifié et 
   * peut afficher des erreurs de validation
   */
  dirtyAfterMs?: number;
}

export interface FieldValidationStateInterface {
  /**
   * Les erreurs pour ce champ
   */
  errors: Ref<ValidationErrorInterface[]>;
  
  /**
   * Premier message d'erreur (pour affichage simplifié)
   */
  firstErrorMessage: ComputedRef<string>;
  
  /**
   * Niveau de sévérité le plus élevé parmi toutes les erreurs
   */
  highestSeverity: ComputedRef<ValidationSeverityType | null>;
  
  /**
   * Si au moins une erreur existe pour ce champ 
   */
  hasError: ComputedRef<boolean>;
  
  /**
   * Si au moins un warning existe pour ce champ
   */
  hasWarning: ComputedRef<boolean>;
  
  /**
   * Si au moins une information existe pour ce champ
   */
  hasInfo: ComputedRef<boolean>;
  
  /**
   * Si le champ a déjà été modifié/interagi avec
   */
  isDirty: Ref<boolean>;
  
  /**
   * Marquer le champ comme modifié
   */
  markDirty: () => void;
  
  /**
   * Réinitialiser l'état du champ
   */
  reset: () => void;
}

export interface UseValidationResultReturnInterface<T> {
  /**
   * Le résultat actuel de validation
   */
  result: Ref<FormValidationResultType<T> | null>;
  
  /**
   * Mettre à jour le résultat de validation
   */
  setResult: (newResult: FormValidationResultType<T>) => void;
  
  /**
   * Réinitialiser le résultat à null
   */
  resetResult: () => void;
  
  /**
   * Toutes les erreurs
   */
  allErrors: ComputedRef<ValidationErrorInterface[]>;
  
  /**
   * Tous les warnings
   */
  allWarnings: ComputedRef<ValidationErrorInterface[]>;
  
  /**
   * Si le résultat est un succès
   */
  isSuccess: ComputedRef<boolean>;
  
  /**
   * Si le résultat est un échec
   */
  isFailure: ComputedRef<boolean>;
  
  /**
   * Obtenir un objet d'état de validation pour un champ spécifique
   */
  getFieldState: (fieldName: string) => FieldValidationStateInterface;
  
  /**
   * Liste des champs avec erreurs
   */
  fieldsWithErrors: ComputedRef<string[]>;
  
  /**
   * Liste des champs avec warnings
   */
  fieldsWithWarnings: ComputedRef<string[]>;
  
  /**
   * Le nombre total d'erreurs et warnings
   */
  totalIssues: ComputedRef<number>;
  
  /**
   * Métriques de performance (si le logging est activé)
   */
  perfMetrics?: {
    validationCount: number;
    validationTime: number;
  };
}

/**
 * Composable pour gérer les résultats de validation dans Vue
 * Facilite l'intégration des types Result dans les composants
 * 
 * @param initialResult Résultat initial
 * @param options Options de configuration
 * @returns Interface pour interagir avec les résultats de validation
 */
export function useValidationResult<T>(
  initialResult: FormValidationResultType<T> | null = null,
  options: ValidationResultOptionsInterface = {}
): UseValidationResultReturnInterface<T> {
  const { debug = false, dirtyAfterMs = 500 } = options;
  
  // État du résultat
  const result = ref<FormValidationResultType<T> | null>(initialResult);
  
  // Map des états de champs pour le suivi
  const fieldStates = new Map<string, FieldValidationStateInterface>();
  
  // Mettre à jour le résultat
  const setResult = (newResult: FormValidationResultType<T>): void => {
    if (debug) {
      console.debug('[useValidationResult] Setting new result:', newResult);
    }
    result.value = newResult;
  };
  
  // Réinitialiser le résultat
  const resetResult = (): void => {
    if (debug) {
      console.debug('[useValidationResult] Resetting result');
    }
    result.value = null;
    // Réinitialiser tous les états de champs
    fieldStates.forEach(state => state.reset());
  };
  
  // Computed: toutes les erreurs
  const allErrors = computed<ValidationErrorInterface[]>(() => {
    if (!result.value || isSuccess(result.value)) return [];
    
    // Utiliser une assertion de type sécurisée
    const failureResult = result.value as { success: false, error: ValidationErrorInterface[] };
    const errors = failureResult.error || [];
    return errors.filter((e: any) => e.severity === 'error');
  });
  
  // Computed: tous les warnings
  const allWarnings = computed<ValidationErrorInterface[]>(() => {
    if (!result.value || isSuccess(result.value)) return [];
    
    // Utiliser une assertion de type sécurisée
    const failureResult = result.value as { success: false, error: ValidationErrorInterface[] };
    const errors = failureResult.error || [];
    return errors.filter((e: any) => e.severity === 'warning');
  });
  
  // Computed: est-ce un succès
  const isSuccessResult = computed<boolean>(() => {
    return !!result.value && isSuccess(result.value);
  });
  
  // Computed: est-ce un échec
  const isFailureResult = computed<boolean>(() => {
    return !!result.value && isFailure(result.value);
  });
  
  // Computed: champs avec erreurs
  const fieldsWithErrors = computed(() => {
    if (!result.value || isSuccess(result.value)) return [] as string[];
    
    // Utiliser une assertion de type sécurisée
    const failureResult = result.value as { success: false, error: ValidationErrorInterface[] };
    const errors = failureResult.error || [];
    return [...new Set(
      errors
        .filter((e: any) => e.severity === 'error')
        .map((e: any) => e.field)
    )] as string[];
  });
  
  // Computed: champs avec warnings
  const fieldsWithWarnings = computed(() => {
    if (!result.value || isSuccess(result.value)) return [] as string[];
    
    // Utiliser une assertion de type sécurisée
    const failureResult = result.value as { success: false, error: ValidationErrorInterface[] };
    const errors = failureResult.error || [];
    return [...new Set(
      errors
        .filter((e: any) => e.severity === 'warning')
        .map((e: any) => e.field)
    )] as string[];
  });
  
  // Computed: total des problèmes (erreurs + warnings)
  const totalIssues = computed<number>(() => {
    return allErrors.value.length + allWarnings.value.length;
  });
  
  // Obtenir l'état de validation d'un champ spécifique
  const getFieldState = (fieldName: string): FieldValidationStateInterface => {
    // Vérifier si on a déjà créé cet état
    if (fieldStates.has(fieldName)) {
      return fieldStates.get(fieldName)!;
    }
    
    // Créer un nouvel état pour ce champ
    const isDirty = ref(false);
    const errors = computed<ValidationErrorInterface[]>(() => {
      if (!result.value || isSuccess(result.value)) return [];
      return getErrorsForField(result.value, fieldName) as ValidationErrorInterface[];
    });
    
    const firstErrorMessage = computed<string>(() => {
      return errors.value.length > 0 ? errors.value[0].message : '';
    });
    
    const highestSeverity = computed<ValidationSeverityType | null>(() => {
      if (errors.value.some((e: any) => e.severity === 'error')) return 'error';
      if (errors.value.some((e: any) => e.severity === 'warning')) return 'warning';
      if (errors.value.some((e: any) => e.severity === 'info')) return 'info';
      return null;
    });
    
    const hasError = computed<boolean>(() => {
      return errors.value.some((e: any) => e.severity === 'error');
    });
    
    const hasWarning = computed<boolean>(() => {
      return errors.value.some((e: any) => e.severity === 'warning');
    });
    
    const hasInfo = computed<boolean>(() => {
      return errors.value.some((e: any) => e.severity === 'info');
    });
    
    const markDirty = (): void => {
      isDirty.value = true;
    };
    
    const reset = (): void => {
      isDirty.value = false;
    };
    
    // Créer l'objet d'état
    const state: FieldValidationStateInterface = {
      errors,
      firstErrorMessage,
      highestSeverity,
      hasError,
      hasWarning,
      hasInfo,
      isDirty,
      markDirty,
      reset
    };
    
    // Sauvegarder l'état
    fieldStates.set(fieldName, state);
    
    return state;
  };
  
  // Création des métriques de performance
  const perfMetrics = {
    validationCount: 0,
    validationTime: 0
  };
  
  return {
    result,
    setResult,
    resetResult,
    allErrors,
    allWarnings,
    isSuccess: isSuccessResult,
    isFailure: isFailureResult,
    getFieldState,
    fieldsWithErrors,
    fieldsWithWarnings,
    totalIssues,
    perfMetrics
  };
} 