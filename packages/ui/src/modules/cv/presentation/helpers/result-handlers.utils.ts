/**
 * result-handlers.utils.ts
 * 
 * Utilitaires pour manipuler les résultats de validation dans le contexte de Vue.js.
 * Ces fonctions facilitent l'interaction entre le système de validation Result/Option
 * et l'interface utilisateur Vue.
 */

import { watch, WatchStopHandle, Ref } from 'vue';

// Using type imports to avoid runtime dependencies
import type {
  ResultType,
  FormValidationResultType,
  ValidationErrorInterface,
  OptionType
} from '@cv-generator/shared';

// Helper functions - these would normally be imported from shared
// but are defined here to avoid direct dependencies
function isSuccess<T, E>(result: { success: boolean; value?: T; error?: E }): boolean {
  return result.success === true;
}

function isFailure<T, E>(result: { success: boolean; value?: T; error?: E }): boolean {
  return result.success === false;
}

function createSuccess<T>(value: T): { success: true; value: T } {
  return { success: true, value };
}

function createFailure<E>(error: E): { success: false; error: E } {
  return { success: false, error };
}

/**
 * Options pour la fonction watchResult
 */
export interface WatchResultOptionsInterface<T, V> {
  /**
   * Fonction à exécuter en cas de succès
   */
  onSuccess?: (value: T) => void;
  
  /**
   * Fonction à exécuter en cas d'échec
   */
  onFailure?: (error: V) => void;
  
  /**
   * Fonction à exécuter dans tous les cas (succès ou échec)
   */
  onComplete?: () => void;
  
  /**
   * Si la surveillance doit démarrer immédiatement
   */
  immediate?: boolean;
}

/**
 * Surveille un Ref<ResultType> et exécute des actions selon le résultat
 * 
 * @param resultRef Référence Vue vers un ResultType
 * @param options Options de surveillance et callbacks
 * @returns Fonction pour arrêter la surveillance
 */
export function watchResult<T, V>(
  resultRef: Ref<ResultType<T, V> | null>,
  options: WatchResultOptionsInterface<T, V> = {}
): WatchStopHandle {
  const { 
    onSuccess,
    onFailure,
    onComplete,
    immediate = false 
  } = options;
  
  return watch(resultRef, (result) => {
    if (!result) return;
    
    if (isSuccess(result) && onSuccess) {
      onSuccess((result as any).value);
    } else if (isFailure(result) && onFailure) {
      onFailure((result as any).error);
    }
    
    if (onComplete) {
      onComplete();
    }
  }, { immediate });
}

/**
 * Convertit un objet de résultats Ref<ResultType> par champ en un seul ResultType combiné
 * 
 * @param fieldResults Objet avec des Ref<ResultType> par champ
 * @returns Un ResultType combiné
 */
export function combineFieldResults<T extends Record<string, unknown>>(
  fieldResults: Record<keyof T, Ref<FormValidationResultType<unknown> | null>>
): FormValidationResultType<T> {
  const values: Record<string, unknown> = {};
  const errors: ValidationErrorInterface[] = [];

  for (const [field, resultRef] of Object.entries(fieldResults)) {
    const result = resultRef.value;
    
    if (!result) {
      errors.push({
        code: 'FIELD_NOT_VALIDATED',
        message: `Le champ ${field} n'a pas été validé`,
        field: field,
        severity: 'error',
        layer: 'presentation'
      } as ValidationErrorInterface);
      continue;
    }
    
    if (isSuccess(result)) {
      values[field] = (result as any).value;
      // Ajouter les warnings si présents
      if ((result as any).warnings) {
        errors.push(...(result as any).warnings);
      }
    } else {
      errors.push(...(result as any).error);
    }
  }

  if (errors.some((e: any) => e.severity === 'error')) {
    return createFailure(errors) as FormValidationResultType<T>;
  }

  return createSuccess(values as T) as FormValidationResultType<T>;
}

/**
 * Applique une validation asynchrone et met à jour un Ref<ResultType>
 * 
 * @param validate Fonction de validation qui retourne une promesse de ResultType
 * @param resultRef Référence Vue vers un ResultType qui sera mise à jour
 * @param value Valeur à valider
 * @param loadingRef Référence Vue booléenne optionnelle pour l'état de chargement
 */
export async function applyAsyncValidation<T, V>(
  validate: (value: T) => Promise<ResultType<T, V>>,
  resultRef: Ref<ResultType<T, V> | null>,
  value: T,
  loadingRef?: Ref<boolean>
): Promise<void> {
  if (loadingRef) {
    loadingRef.value = true;
  }
  
  try {
    const result = await validate(value);
    resultRef.value = result;
  } catch (error) {

    resultRef.value = createFailure([{
      code: 'VALIDATION_ERROR',
      message: error instanceof Error ? error.message : 'Erreur de validation',
      field: 'global',
      severity: 'error',
      layer: 'presentation'
    }] as unknown as V) as ResultType<T, V>;
  } finally {
    if (loadingRef) {
      loadingRef.value = false;
    }
  }
}

/**
 * Convertit une valeur Option (potentiellement undefined) en ResultType
 * 
 * @param option Valeur optionnelle
 * @param errorFactory Fonction pour créer un message d'erreur si la valeur est undefined
 * @returns Un ResultType contenant la valeur ou une erreur
 */
export function optionToResult<T>(
  option: OptionType<T>,
  errorFactory: () => ValidationErrorInterface | ValidationErrorInterface[]
): FormValidationResultType<T> {
  if (option !== undefined) {
    return createSuccess(option) as FormValidationResultType<T>;
  }
  
  const error = errorFactory();
  return createFailure(Array.isArray(error) ? error : [error]) as FormValidationResultType<T>;
}

/**
 * Convertit une erreur Zod en ValidationErrorInterface[]
 * 
 * @param zodError Erreur Zod
 * @param fieldPrefix Préfixe à ajouter aux noms de champs
 * @returns Tableau d'erreurs de validation
 */
export function zodErrorToValidationErrors(
  zodError: { errors: Array<{ path: string[]; message: string; code: string }> },
  fieldPrefix = ''
): ValidationErrorInterface[] {
  return zodError.errors.map(err => {
    const fieldPath = err.path.length > 0 
      ? err.path.join('.')
      : 'global';
    
    const fullField = fieldPrefix 
      ? `${fieldPrefix}.${fieldPath}` 
      : fieldPath;
    
    return {
      code: `VALIDATION_${err.code.toUpperCase()}`,
      message: err.message,
      field: fullField,
      severity: 'error',
      layer: 'presentation'
    } as ValidationErrorInterface;
  });
}

/**
 * Définit un message d'erreur personnalisé pour plusieurs champs 
 * lorsqu'ils sont interdépendants
 * 
 * @param fields Liste des champs concernés
 * @param isInvalid Fonction qui détermine si les champs sont invalides
 * @param errorMessage Message d'erreur ou fonction qui génère le message
 * @returns ValidationErrorInterface[] ou tableau vide si valide
 */
export function validateRelatedFields(
  fields: string[],
  isInvalid: (...values: any[]) => boolean,
  errorMessage: string | ((...fields: string[]) => string),
  values: any[]
): ValidationErrorInterface[] {
  if (isInvalid(...values)) {
    const message = typeof errorMessage === 'function' 
      ? errorMessage(...fields) 
      : errorMessage;
    
    return fields.map(field => ({
      code: 'RELATED_FIELDS_VALIDATION',
      message,
      field,
      severity: 'error',
      layer: 'presentation'
    } as ValidationErrorInterface));
  }
  
  return [];
}
