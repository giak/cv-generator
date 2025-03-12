/**
 * useValidationResult.ts
 * 
 * Composable Vue pour manipuler les résultats de validation basés sur le pattern Result/Option.
 * Ce composable facilite l'intégration des objets ResultType dans les composants Vue.
 */

import {
  ref,
  computed,
  reactive,
  watch,
  Ref,
  ComputedRef,
  UnwrapRef,
} from 'vue';

// Using type imports to avoid runtime dependencies
import type {
  ResultType,
  ValidationErrorInterface,
  ValidationSeverityType,
  FormValidationResultType,
  SuccessType,
  FailureType
} from '@cv-generator/shared';

// Import de l'enum ValidationLayerType pour l'utiliser
import { ValidationLayerType } from '@cv-generator/shared';

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

/**
 * ValidationFieldState contient l'état de validation pour un champ spécifique
 */
export interface ValidationFieldState {
  /** Liste des erreurs et avertissements pour ce champ */
  errors: Ref<ValidationErrorInterface[]>
  /** Indique si le champ a au moins une erreur */
  hasError: ComputedRef<boolean>
  /** Indique si le champ a au moins un avertissement */
  hasWarning: ComputedRef<boolean>
  /** Indique si le champ a au moins une information */
  hasInfo: ComputedRef<boolean>
  /** Sévérité la plus élevée des problèmes (error > warning > info) */
  highestSeverity: ComputedRef<'error' | 'warning' | 'info' | null>
  /** Premier message d'erreur (pour affichage simple) */
  firstErrorMessage: ComputedRef<string>
  /** Indique si le champ a été modifié par l'utilisateur */
  isDirty: Ref<boolean>
  /** Marque le champ comme modifié */
  markDirty: () => void
  /** Réinitialise l'état du champ */
  reset: () => void
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
  getFieldState: (fieldName: string) => ValidationFieldState;
  
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
 * useValidationResult - Composable pour gérer les résultats de validation
 * 
 * Ce composable permet de:
 * - Stocker et mettre à jour un résultat de validation (ResultType)
 * - Extraire les erreurs et avertissements du résultat
 * - Gérer l'état de validation par champ (dirty, errors, warnings)
 * - Vérifier la validité globale du résultat
 * 
 * @param initialResult Résultat initial de validation (optionnel)
 * @returns Méthodes et propriétés pour gérer le résultat de validation
 */
export function useValidationResult<T>(
  initialResult: FormValidationResultType<T> | null = null,
  options: ValidationResultOptionsInterface = {}
): UseValidationResultReturnInterface<T> {
  const { debug = false, dirtyAfterMs = 500 } = options;
  
  // État principal - le résultat de validation
  const result = ref<FormValidationResultType<T> | null>(initialResult) as Ref<FormValidationResultType<T> | null>;
  
  // État des champs
  const dirtyFields = ref<Set<string>>(new Set());
  
  // Compteurs pour les métriques de performance
  let validationCount = 0;
  let validationTime = 0;
  
  // Map des états de champs pour le suivi
  const fieldStates = new Map<string, ValidationFieldState>();
  
  // Mise à jour du résultat de validation
  const setResult = (newResult: FormValidationResultType<T>): void => {
    if (debug) {
      console.group('ValidationResult: setResult');
      console.log('Previous:', result.value);
      console.log('New:', newResult);
      console.groupEnd();
    }
    
    // Conversion explicite pour assurer la compatibilité des types
    result.value = newResult as FormValidationResultType<T>;
  };
  
  // Réinitialisation du résultat
  const resetResult = (): void => {
    if (debug) {
      console.log('ValidationResult: resetResult');
    }
    
    result.value = null;
    dirtyFields.value.clear();
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
    if (!result.value) return [];
    
    if (isSuccess(result.value)) {
      // Pour les résultats de succès, récupérer les warnings du champ warnings
      const successResult = result.value as SuccessType<T>;
      return successResult.warnings || [];
    } else {
      // Pour les résultats d'échec, filtrer les erreurs avec severity === 'warning'
      const failureResult = result.value as FailureType<ValidationErrorInterface[]>;
      const errors = failureResult.error || [];
      return errors.filter((e: any) => e.severity === 'warning');
    }
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
  const getFieldState = (fieldName: string): ValidationFieldState => {
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
    const state: ValidationFieldState = {
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