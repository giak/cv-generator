/**
 * Service de validation principal
 * Fournit les méthodes de base pour valider les différentes entités du CV
 */

import { 
  ResultType, 
  ValidationErrorInterface,
  ValidationLayerType
} from '@cv-generator/shared';


/**
 * Interface de base pour tous les services de validation
 * Tous les validateurs doivent implémenter cette interface
 */
export interface ValidationServiceInterface<T> {
  /**
   * Valide une entité complète et retourne un résultat
   * @param entity Entité à valider
   * @returns Résultat de validation, succès avec l'entité ou échec avec erreurs
   */
  validate(entity: T): ResultType<T>;
  
  /**
   * Valide une propriété spécifique d'une entité
   * @param entity Entité contenant la propriété
   * @param fieldName Nom de la propriété à valider
   * @returns Résultat de validation pour cette propriété
   */
  validateField<K extends keyof T>(entity: T, fieldName: K): ResultType<T[K]>;
}

/**
 * Classe abstraite de base pour tous les services de validation
 * Fournit des utilitaires communs et la structure de base pour les validateurs
 */
export abstract class BaseValidationService<T> implements ValidationServiceInterface<T> {
  /**
   * Valide une entité complète et retourne un résultat
   * @param entity Entité à valider
   * @returns Résultat de validation, succès avec l'entité ou échec avec erreurs
   */
  abstract validate(entity: T): ResultType<T>;
  
  /**
   * Valide une propriété spécifique d'une entité
   * @param entity Entité contenant la propriété
   * @param fieldName Nom de la propriété à valider
   * @returns Résultat de validation pour cette propriété
   */
  abstract validateField<K extends keyof T>(entity: T, fieldName: K): ResultType<T[K]>;
  
  /**
   * Crée une erreur de validation uniformisée
   * @param code Code d'erreur unique
   * @param message Message d'erreur lisible
   * @param field Champ concerné par l'erreur
   * @param layer Couche architecturale (Domain, Application, Presentation)
   * @param severity Niveau de sévérité
   * @param options Options supplémentaires
   * @returns Objet d'erreur de validation
   */
  protected createError(
    code: string,
    message: string,
    field: string,
    layer: ValidationLayerType,
    severity: 'error' | 'warning' | 'info' = 'error',
    options?: {
      suggestion?: string;
      additionalInfo?: Record<string, unknown>;
    }
  ): ValidationErrorInterface {
    return {
      code,
      message,
      field,
      layer,
      severity,
      ...options
    };
  }
  
  /**
   * Vérifie si une valeur est définie (non null et non undefined)
   * @param value Valeur à vérifier
   * @returns True si la valeur est définie
   */
  protected isDefined<V>(value: V | null | undefined): value is V {
    return value !== null && value !== undefined;
  }
  
  /**
   * Vérifie si une chaîne est vide ou composée uniquement d'espaces
   * @param value Chaîne à vérifier
   * @returns True si la chaîne est vide ou ne contient que des espaces
   */
  protected isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim() === '';
  }
  
  /**
   * Vérifie si une chaîne est suffisamment longue
   * @param value Chaîne à vérifier
   * @param minLength Longueur minimale requise
   * @returns True si la chaîne a une longueur suffisante
   */
  protected hasMinLength(value: string, minLength: number): boolean {
    return !this.isEmpty(value) && value.trim().length >= minLength;
  }
} 