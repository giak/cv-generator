/**
 * Types et interfaces pour le pattern ResultType standardisé
 * Implémentation basée sur le document result-pattern-impl.md v2.0.0
 */

// Import relatif avec le bon chemin
import type { ValidationErrorInterface } from './validation.interface';

/**
 * Interface standard pour ResultType
 * Définit un contrat commun pour tous les résultats d'opérations
 */
export interface ResultTypeInterface<T> {
  /**
   * Propriété pour rétrocompatibilité
   */
  success: boolean;
  
  /**
   * Propriété optionnelle pour rétrocompatibilité (uniquement sur success=true)
   */
  value?: T;
  
  /**
   * Propriété optionnelle pour rétrocompatibilité (uniquement sur success=false)
   */
  error?: ValidationErrorInterface[];
  
  /**
   * Propriété optionnelle pour rétrocompatibilité (uniquement sur success=true avec warnings)
   */
  warnings?: ValidationErrorInterface[];
  
  /**
   * Vérifie si le résultat est un succès
   * @returns true si le résultat est un succès, false sinon
   */
  isSuccess(): boolean;
  
  /**
   * Vérifie si le résultat est un échec
   * @returns true si le résultat est un échec, false sinon
   */
  isFailure(): boolean;
  
  /**
   * Obtient la valeur en cas de succès
   * @throws Error si appelé sur un résultat d'échec
   * @returns La valeur encapsulée dans le résultat
   */
  getValue(): T;
  
  /**
   * Obtient les erreurs en cas d'échec
   * @returns Un tableau d'erreurs de validation, vide en cas de succès
   */
  getErrors(): ValidationErrorInterface[];
  
  /**
   * Obtient les avertissements, même en cas de succès
   * @returns Un tableau d'avertissements, vide s'il n'y en a pas
   */
  getWarnings(): ValidationErrorInterface[];
  
  /**
   * Vérifie si le résultat contient des avertissements
   * @returns true si le résultat contient des avertissements, false sinon
   */
  hasWarnings(): boolean;
}

/**
 * Type représentant un succès avec une valeur (maintenu pour compatibilité)
 * @deprecated Utilisez l'interface ResultTypeInterface à la place
 */
export type SuccessType<T> = {
  success: true;
  value: T;
  warnings?: ValidationErrorInterface[];
};

/**
 * Type représentant un échec avec une erreur (maintenu pour compatibilité)
 * @deprecated Utilisez l'interface ResultTypeInterface à la place
 */
export type FailureType<E> = {
  success: false;
  error: E;
};

/**
 * Type Result combinant succès ou échec (maintenu pour compatibilité)
 * @deprecated Utilisez l'interface ResultTypeInterface à la place
 */
export type LegacyResultType<T, E = ValidationErrorInterface[]> = SuccessType<T> | FailureType<E>;

/**
 * Type pour assurer la rétrocompatibilité avec le code existant
 * @deprecated Utilisez ResultTypeInterface à la place
 */
export type ResultType<T> = ResultTypeInterface<T>;

/**
 * Type Option pour les valeurs potentiellement absentes
 */
export type OptionType<T> = T | undefined;

/**
 * Type pour les résultats de validation de formulaire (maintenu pour compatibilité)
 * @deprecated Utilisez l'interface ResultTypeInterface à la place
 */
export type FormValidationResultType<T> = LegacyResultType<T, ValidationErrorInterface[]>;

/**
 * Implémentation concrète d'un résultat de succès
 * @internal Ne pas utiliser directement, préférer les fonctions helpers
 */
export class Success<T> implements ResultTypeInterface<T> {
  /**
   * Propriété pour rétrocompatibilité
   */
  readonly success: boolean = true;
  
  /**
   * Propriété pour rétrocompatibilité
   */
  readonly value: T;
  
  /**
   * Constructeur pour un résultat de succès
   * @param value La valeur encapsulée dans le succès
   */
  constructor(protected readonly _value: T) {
    this.value = _value;
  }

  /**
   * @inheritdoc
   */
  isSuccess(): boolean {
    return true;
  }

  /**
   * @inheritdoc
   */
  isFailure(): boolean {
    return false;
  }

  /**
   * @inheritdoc
   */
  getValue(): T {
    return this._value;
  }

  /**
   * @inheritdoc
   */
  getErrors(): ValidationErrorInterface[] {
    return [];
  }

  /**
   * @inheritdoc
   */
  getWarnings(): ValidationErrorInterface[] {
    return [];
  }

  /**
   * @inheritdoc
   */
  hasWarnings(): boolean {
    return false;
  }
}

/**
 * Implémentation concrète d'un résultat d'échec
 * @internal Ne pas utiliser directement, préférer les fonctions helpers
 */
export class Failure<T> implements ResultTypeInterface<T> {
  /**
   * Propriété pour rétrocompatibilité
   */
  readonly success: boolean = false;
  
  /**
   * Propriété pour rétrocompatibilité
   */
  readonly error: ValidationErrorInterface[];
  
  /**
   * Constructeur pour un résultat d'échec
   * @param errors Liste des erreurs de validation
   */
  constructor(protected readonly _errors: ValidationErrorInterface[]) {
    this.error = _errors;
  }

  /**
   * @inheritdoc
   */
  isSuccess(): boolean {
    return false;
  }

  /**
   * @inheritdoc
   */
  isFailure(): boolean {
    return true;
  }

  /**
   * @inheritdoc
   */
  getValue(): T {
    throw new Error("Cannot get value from a failure result");
  }

  /**
   * @inheritdoc
   */
  getErrors(): ValidationErrorInterface[] {
    return [...this._errors];
  }

  /**
   * @inheritdoc
   */
  getWarnings(): ValidationErrorInterface[] {
    return [];
  }

  /**
   * @inheritdoc
   */
  hasWarnings(): boolean {
    return false;
  }
}

/**
 * Implémentation concrète d'un résultat de succès avec avertissements
 * @internal Ne pas utiliser directement, préférer les fonctions helpers
 */
export class SuccessWithWarnings<T> extends Success<T> {
  /**
   * Propriété pour rétrocompatibilité
   */
  readonly warnings: ValidationErrorInterface[];
  
  /**
   * Constructeur pour un résultat de succès avec avertissements
   * @param value La valeur encapsulée dans le succès
   * @param warnings Liste des avertissements
   */
  constructor(
    value: T,
    protected readonly _warnings: ValidationErrorInterface[]
  ) {
    super(value);
    this.warnings = _warnings;
  }

  /**
   * @inheritdoc
   */
  getWarnings(): ValidationErrorInterface[] {
    return [...this._warnings];
  }

  /**
   * @inheritdoc
   */
  hasWarnings(): boolean {
    return this._warnings.length > 0;
  }
} 