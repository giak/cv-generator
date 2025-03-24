/**
 * Utilitaires pour manipuler les types Result/Option
 * Implémentation standardisée basée sur le document result-pattern-impl.md v2.0.0
 */

import {
    ResultTypeInterface,
    SuccessType,
    FailureType,
    Success,
    Failure,
    SuccessWithWarnings
} from '../types/result.type';
import type { ValidationErrorInterface } from '../types/validation.interface';

/**
 * Crée un résultat de succès
 * @param value La valeur encapsulée dans le succès
 * @returns Un objet ResultTypeInterface représentant un succès
 */
export function createSuccess<T>(value: T): ResultTypeInterface<T> {
  return new Success<T>(value);
}

/**
 * Crée un résultat de succès avec des avertissements
 * @param value La valeur encapsulée dans le succès
 * @param warnings Liste des avertissements
 * @returns Un objet ResultTypeInterface représentant un succès avec des avertissements
 */
export function createSuccessWithWarnings<T>(
  value: T, 
  warnings: ValidationErrorInterface[]
): ResultTypeInterface<T> {
  return new SuccessWithWarnings<T>(value, warnings);
}

/**
 * Crée un résultat d'échec
 * @param errors Liste des erreurs de validation
 * @returns Un objet ResultTypeInterface représentant un échec
 */
export function createFailure<T>(
  errors: ValidationErrorInterface[]
): ResultTypeInterface<T> {
  return new Failure<T>(errors);
}

/**
 * Vérifie si un résultat est un succès
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un succès, false sinon
 */
export function isSuccess<T>(result: ResultTypeInterface<T>): boolean {
  // Handle both old and new ResultType patterns
  if (typeof result.isSuccess === 'function') {
    return result.isSuccess();
  }
  // Legacy compatibility: check 'success' property directly
  return result.success === true;
}

/**
 * Vérifie si un résultat est un échec
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un échec, false sinon
 */
export function isFailure<T>(result: ResultTypeInterface<T>): boolean {
  // Handle both old and new ResultType patterns
  if (typeof result.isFailure === 'function') {
    return result.isFailure();
  }
  // Legacy compatibility: check 'success' property directly
  return result.success === false;
}

/**
 * Exécute une fonction sur le résultat s'il s'agit d'un succès
 * @param result Le résultat à traiter
 * @param fn La fonction à exécuter sur la valeur en cas de succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export function map<T, U>(
  result: ResultTypeInterface<T>, 
  fn: (value: T) => U
): ResultTypeInterface<U> {
  if (isSuccess(result)) {
    return createSuccess(fn(result.getValue()));
  } else {
    return createFailure(result.getErrors()) as ResultTypeInterface<U>;
  }
}

/**
 * Chaîne deux fonctions de validation
 * @param result Le résultat initial
 * @param fn La fonction à exécuter sur la valeur si le résultat est un succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export function flatMap<T, U>(
  result: ResultTypeInterface<T>,
  fn: (value: T) => ResultTypeInterface<U>
): ResultTypeInterface<U> {
  if (isSuccess(result)) {
    return fn(result.getValue());
  } else {
    return createFailure(result.getErrors()) as ResultTypeInterface<U>;
  }
}

/**
 * Extrait les erreurs concernant un champ spécifique
 * @param result Le résultat de validation
 * @param fieldName Le nom du champ
 * @returns Un tableau d'erreurs concernant le champ spécifié
 */
export function getErrorsForField<T>(
  result: ResultTypeInterface<T>,
  fieldName: string
): ValidationErrorInterface[] {
  if (result.isSuccess()) return [];
  return result.getErrors().filter(err => err.field === fieldName);
}

/**
 * Combine plusieurs résultats de validation en un seul
 * @param results Objet contenant les résultats par clé
 * @returns Un résultat combiné
 */
export function combineValidationResults<T extends Record<string, unknown>>(
  results: Record<keyof T, ResultTypeInterface<unknown>>
): ResultTypeInterface<T> {
  const entries = Object.entries(results);
  const errors: ValidationErrorInterface[] = [];
  const values: Record<string, unknown> = {};

  for (const [key, result] of entries) {
    if (result.isSuccess()) {
      values[key] = result.getValue();
    } else {
      errors.push(...result.getErrors());
    }
  }

  if (errors.length > 0) {
    return createFailure<T>(errors);
  }

  return createSuccess(values as T);
}

// Fonctions de compatibilité pour le code existant

/**
 * Fonction pour convertir un ancien type ResultType en nouveau ResultTypeInterface
 * @param legacyResult Ancien format de résultat
 * @returns Résultat au nouveau format
 * @deprecated Utilisé pour la migration, à supprimer une fois la migration terminée
 */
export function convertLegacyResult<T>(
  legacyResult: SuccessType<T> | FailureType<ValidationErrorInterface[]>
): ResultTypeInterface<T> {
  if (legacyResult.success) {
    return legacyResult.warnings && legacyResult.warnings.length > 0
      ? createSuccessWithWarnings(legacyResult.value, legacyResult.warnings)
      : createSuccess(legacyResult.value);
  } else {
    return createFailure<T>(legacyResult.error);
  }
}

/**
 * Fonction pour convertir un nouveau ResultTypeInterface en ancien format
 * @param result Résultat au nouveau format
 * @returns Résultat à l'ancien format
 * @deprecated Utilisé pour la migration, à supprimer une fois la migration terminée
 */
export function convertToLegacyResult<T>(
  result: ResultTypeInterface<T>
): SuccessType<T> | FailureType<ValidationErrorInterface[]> {
  if (result.isSuccess()) {
    const warnings = result.getWarnings();
    return {
      success: true,
      value: result.getValue(),
      ...(warnings.length > 0 ? { warnings } : {})
    };
  } else {
    return {
      success: false,
      error: result.getErrors()
    };
  }
}

/**
 * Récupère les erreurs d'un résultat
 * @param result Le résultat dont on veut récupérer les erreurs
 * @returns Les erreurs du résultat
 */
export function getErrors<T>(result: ResultTypeInterface<T>): ValidationErrorInterface[] {
  // Handle both old and new ResultType patterns
  if (typeof result.getErrors === 'function') {
    return result.getErrors();
  }
  // Legacy compatibility: for old ResultType, return the error property directly
  return 'error' in result ? (result.error as ValidationErrorInterface[]) : [];
}

/**
 * Récupère les warnings d'un résultat
 * @param result Le résultat dont on veut récupérer les warnings
 * @returns Les warnings du résultat ou un tableau vide s'il n'y en a pas
 */
export function getWarnings<T>(result: ResultTypeInterface<T>): ValidationErrorInterface[] {
  // Handle both old and new ResultType patterns
  if (typeof result.getWarnings === 'function') {
    return result.getWarnings();
  }
  // Legacy compatibility: return warnings property directly if it exists
  return 'warnings' in result ? (result.warnings as ValidationErrorInterface[]) : [];
}

/**
 * Vérifie si un résultat contient des warnings
 * @param result Le résultat à vérifier
 * @returns True si le résultat contient des warnings, false sinon
 */
export function hasWarnings<T>(result: ResultTypeInterface<T>): boolean {
  const warnings = getWarnings(result);
  return Array.isArray(warnings) && warnings.length > 0;
} 