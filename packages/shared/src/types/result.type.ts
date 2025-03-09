/**
 * Types de base pour le pattern Result/Option
 * Implémentation basée sur le document result-pattern-impl.md v1.1.0
 */

// Import relatif avec le bon chemin
import type { ValidationErrorInterface } from './validation.interface';

/**
 * Type représentant un succès avec une valeur
 */
export type SuccessType<T> = {
  success: true;
  value: T;
  warnings?: ValidationErrorInterface[];
};

/**
 * Type représentant un échec avec une erreur
 */
export type FailureType<E> = {
  success: false;
  error: E;
};

/**
 * Type Result combinant succès ou échec
 * Le type d'erreur par défaut est un tableau de ValidationErrorInterface
 */
export type ResultType<T, E = ValidationErrorInterface[]> = SuccessType<T> | FailureType<E>;

/**
 * Type Option pour les valeurs potentiellement absentes
 */
export type OptionType<T> = T | undefined;

/**
 * Type pour les résultats de validation de formulaire
 * Spécialisation de ResultType avec ValidationErrorInterface[] comme type d'erreur
 */
export type FormValidationResultType<T> = ResultType<T, ValidationErrorInterface[]>; 