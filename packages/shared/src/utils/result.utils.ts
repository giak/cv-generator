/**
 * Utilitaires pour manipuler les types Result/Option
 * Implémentation basée sur le document result-pattern-impl.md
 */

import type { 
  ResultType, 
  SuccessType, 
  FailureType, 
  OptionType,
  FormValidationResultType 
} from '../types/result.type';
import type { ValidationErrorInterface } from '../types/validation.interface';

/**
 * Crée un résultat de succès
 * @param value La valeur encapsulée dans le succès
 * @returns Un objet ResultType représentant un succès
 */
export function createSuccess<T, E = ValidationErrorInterface[]>(value: T): ResultType<T, E> {
  return { success: true, value };
}

/**
 * Crée un résultat de succès avec des avertissements
 * @param value La valeur encapsulée dans le succès
 * @param warnings Liste des avertissements
 * @returns Un objet ResultType représentant un succès avec des avertissements
 */
export function createSuccessWithWarnings<T>(
  value: T, 
  warnings: ValidationErrorInterface[]
): ResultType<T, ValidationErrorInterface[]> {
  return { success: true, value, warnings };
}

/**
 * Crée un résultat d'échec
 * @param error L'erreur encapsulée dans l'échec
 * @returns Un objet ResultType représentant un échec
 */
export function createFailure<T = unknown, E = ValidationErrorInterface[]>(error: E): ResultType<T, E> {
  return { success: false, error };
}

/**
 * Vérifie si un résultat est un succès
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un succès, false sinon
 */
export function isSuccess<T, E>(result: ResultType<T, E>): result is SuccessType<T> {
  return result.success === true;
}

/**
 * Vérifie si un résultat est un échec
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un échec, false sinon
 */
export function isFailure<T, E>(result: ResultType<T, E>): result is FailureType<E> {
  return result.success === false;
}

/**
 * Exécute une fonction sur le résultat s'il s'agit d'un succès
 * @param result Le résultat à traiter
 * @param fn La fonction à exécuter sur la valeur en cas de succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export function map<T, U, E>(
  result: ResultType<T, E>, 
  fn: (value: T) => U
): ResultType<U, E> {
  return isSuccess(result) 
    ? createSuccess(fn(result.value)) 
    : result as FailureType<E>;
}

/**
 * Chaîne deux fonctions de validation
 * @param result Le résultat initial
 * @param fn La fonction à exécuter sur la valeur si le résultat est un succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export function flatMap<T, U, E>(
  result: ResultType<T, E>, 
  fn: (value: T) => ResultType<U, E>
): ResultType<U, E> {
  return isSuccess(result) 
    ? fn(result.value) 
    : result as FailureType<E>;
}

/**
 * Extrait les erreurs concernant un champ spécifique
 * @param result Le résultat de validation
 * @param fieldName Le nom du champ
 * @returns Un tableau d'erreurs concernant le champ spécifié
 */
export function getErrorsForField(
  result: FormValidationResultType<unknown>,
  fieldName: string
): ValidationErrorInterface[] {
  if (isSuccess(result)) return [];
  return result.error.filter(err => err.field === fieldName);
}

/**
 * Combine plusieurs résultats de validation en un seul
 * @param results Objet contenant les résultats par clé
 * @returns Un résultat combiné
 */
export function combineValidationResults<T extends Record<string, unknown>>(
  results: Record<keyof T, FormValidationResultType<unknown>>
): FormValidationResultType<T> {
  const entries = Object.entries(results);
  const errors: ValidationErrorInterface[] = [];
  const values: Record<string, unknown> = {};

  for (const [key, result] of entries) {
    if (isSuccess(result)) {
      values[key] = result.value;
    } else {
      errors.push(...result.error);
    }
  }

  if (errors.length > 0) {
    return createFailure(errors);
  }

  return createSuccess(values as T);
} 