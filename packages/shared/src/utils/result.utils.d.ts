/**
 * Utilitaires pour manipuler les types Result/Option
 * Implémentation basée sur le document result-pattern-impl.md
 */
import type { ResultType, SuccessType, FailureType, FormValidationResultType } from '../types/result.type';
import type { ValidationErrorInterface } from '../types/validation.interface';
/**
 * Crée un résultat de succès
 * @param value La valeur encapsulée dans le succès
 * @returns Un objet ResultType représentant un succès
 */
export declare function createSuccess<T, E = ValidationErrorInterface[]>(value: T): ResultType<T, E>;
/**
 * Crée un résultat de succès avec des avertissements
 * @param value La valeur encapsulée dans le succès
 * @param warnings Liste des avertissements
 * @returns Un objet ResultType représentant un succès avec des avertissements
 */
export declare function createSuccessWithWarnings<T>(value: T, warnings: ValidationErrorInterface[]): ResultType<T, ValidationErrorInterface[]>;
/**
 * Crée un résultat d'échec
 * @param error L'erreur encapsulée dans l'échec
 * @returns Un objet ResultType représentant un échec
 */
export declare function createFailure<T = unknown, E = ValidationErrorInterface[]>(error: E): ResultType<T, E>;
/**
 * Vérifie si un résultat est un succès
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un succès, false sinon
 */
export declare function isSuccess<T, E>(result: ResultType<T, E>): result is SuccessType<T>;
/**
 * Vérifie si un résultat est un échec
 * @param result Le résultat à vérifier
 * @returns True si le résultat est un échec, false sinon
 */
export declare function isFailure<T, E>(result: ResultType<T, E>): result is FailureType<E>;
/**
 * Exécute une fonction sur le résultat s'il s'agit d'un succès
 * @param result Le résultat à traiter
 * @param fn La fonction à exécuter sur la valeur en cas de succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export declare function map<T, U, E>(result: ResultType<T, E>, fn: (value: T) => U): ResultType<U, E>;
/**
 * Chaîne deux fonctions de validation
 * @param result Le résultat initial
 * @param fn La fonction à exécuter sur la valeur si le résultat est un succès
 * @returns Le résultat de la fonction ou l'échec original
 */
export declare function flatMap<T, U, E>(result: ResultType<T, E>, fn: (value: T) => ResultType<U, E>): ResultType<U, E>;
/**
 * Extrait les erreurs concernant un champ spécifique
 * @param result Le résultat de validation
 * @param fieldName Le nom du champ
 * @returns Un tableau d'erreurs concernant le champ spécifié
 */
export declare function getErrorsForField(result: FormValidationResultType<unknown>, fieldName: string): ValidationErrorInterface[];
/**
 * Combine plusieurs résultats de validation en un seul
 * @param results Objet contenant les résultats par clé
 * @returns Un résultat combiné
 */
export declare function combineValidationResults<T extends Record<string, unknown>>(results: Record<keyof T, FormValidationResultType<unknown>>): FormValidationResultType<T>;
