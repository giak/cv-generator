/**
 * Value Object pour les dates d'expérience professionnelle
 * Implémentation utilisant le pattern ResultType standardisé
 */

import {
    ResultType,
    ValidationLayerType,
    createSuccess,
    createFailure,
    ERROR_CODES
} from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Définition des clés de traduction spécifiques pour les dates
// À migrer vers TRANSLATION_KEYS dans @cv-generator/shared quand possible
const DATE_VALIDATION_KEYS = {
  MISSING_DATE: "resume.common.validation.missingDate",
  INVALID_DATE_FORMAT: "resume.common.validation.invalidDateFormat",
  INVALID_DATE: "resume.common.validation.invalidDate"
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 * Retourne simplement la clé ou le message en dur prédéfini
 */
class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    // Messages par défaut pour maintenir la compatibilité avec le code existant
    const defaultMessages: Record<string, string> = {
      [DATE_VALIDATION_KEYS.MISSING_DATE]: "La date est requise",
      [DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT]: "La date doit être au format YYYY-MM-DD",
      [DATE_VALIDATION_KEYS.INVALID_DATE]: "Date invalide"
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Réponse optimiste pour éviter les erreurs
  }
}

// Instance singleton pour réutilisation
const defaultI18nAdapter = new DefaultI18nAdapter();

/**
 * Type de retour adapté pour les tests existants
 * Utilisé uniquement pour maintenir la compatibilité
 */
type LegacyDateResult = {
  isSuccess: boolean;
  isFailure: boolean;
  getValue?: () => WorkDate;
  error?: string;
};

/**
 * Value Object pour les dates d'expérience professionnelle
 * Encapsule la logique de validation et comparaison des dates
 */
export class WorkDate {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode factory create()
   * @param value Valeur de la date au format YYYY-MM-DD
   * @param date Objet Date JavaScript correspondant
   * @param i18n Interface pour l'internationalisation des messages
   */
  private constructor(
    private readonly value: string, 
    private readonly date: Date,
    private readonly i18n: DomainI18nPortInterface
  ) {}

  /**
   * Méthode factory compatible avec l'ancien pattern Result
   * Maintenue pour la compatibilité avec les tests existants
   * @param dateStr La date au format YYYY-MM-DD
   * @param i18n Interface pour l'internationalisation des messages (optionnel)
   * @returns Objet au format legacy (isSuccess, isFailure, etc.)
   */
  public static create(
    dateStr: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): LegacyDateResult {
    // Validation du format YYYY-MM-DD
    if (!dateStr) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(DATE_VALIDATION_KEYS.MISSING_DATE)
      };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT)
      };
    }

    // Validation de la date elle-même
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE)
      };
    }

    // Si toutes les validations passent, créer l'objet
    const workDateInstance = new WorkDate(dateStr, date, i18n);
    return {
      isSuccess: true,
      isFailure: false,
      getValue: () => workDateInstance,
      error: undefined
    };
  }
  
  /**
   * Méthode factory standard pour créer une instance WorkDate avec ResultType
   * Applique les règles de validation du domaine
   * @param dateStr La date au format YYYY-MM-DD
   * @param i18n Interface pour l'internationalisation des messages (optionnel)
   * @returns ResultType contenant soit l'objet WorkDate en cas de succès, soit les erreurs
   */
  public static createWithResultType(
    dateStr: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultType<WorkDate> {
    // Validation du format YYYY-MM-DD
    if (!dateStr) {
      return createFailure([{
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: i18n.translate(DATE_VALIDATION_KEYS.MISSING_DATE),
        i18nKey: DATE_VALIDATION_KEYS.MISSING_DATE,
        field: "date",
        severity: "error",
        layer: ValidationLayerType.DOMAIN
      }]);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return createFailure([{
        code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
        message: i18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
        i18nKey: DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT,
        field: "date",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Utilisez le format YYYY-MM-DD, par exemple 2020-01-31"
      }]);
    }

    // Validation de la date elle-même
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return createFailure([{
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: i18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE),
        i18nKey: DATE_VALIDATION_KEYS.INVALID_DATE,
        field: "date",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Vérifiez que le jour et le mois sont valides"
      }]);
    }

    return createSuccess(new WorkDate(dateStr, date, i18n));
  }

  /**
   * Obtient la valeur de la date au format string YYYY-MM-DD
   * @returns La date au format YYYY-MM-DD
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Obtient l'objet Date JavaScript
   * @returns L'objet Date
   */
  public getDate(): Date {
    return new Date(this.date);
  }

  /**
   * Vérifie si cette date est antérieure à une autre date
   * @param other L'autre date à comparer
   * @returns true si cette date est antérieure à l'autre date
   */
  public isBefore(other: WorkDate): boolean {
    return this.date < other.date;
  }

  /**
   * Vérifie si cette date est postérieure à une autre date
   * @param other L'autre date à comparer
   * @returns true si cette date est postérieure à l'autre date
   */
  public isAfter(other: WorkDate): boolean {
    return this.date > other.date;
  }

  /**
   * Vérifie si cette date est égale à une autre date
   * @param other L'autre date à comparer
   * @returns true si les dates sont égales
   */
  public equals(other: WorkDate): boolean {
    return this.value === other.value;
  }

  /**
   * Formate la date au format local (ex: 01/01/2020)
   * @returns La date au format local
   */
  public toLocaleDateString(locale: string = 'fr-FR'): string {
    return this.date.toLocaleDateString(locale);
  }

  /**
   * Formate la date en format long (ex: janvier 2020)
   * @returns La date au format long
   */
  public toMonthYearString(locale: string = 'fr-FR'): string {
    return this.date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long' 
    });
  }

  /**
   * Calcule la durée en mois entre cette date et une autre date
   * @param other La date de fin (si non fournie, utilise la date actuelle)
   * @returns Le nombre de mois entre les deux dates
   */
  public monthsUntil(other?: WorkDate): number {
    const endDate = other ? other.date : new Date();
    const startYear = this.date.getFullYear();
    const startMonth = this.date.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    
    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }
} 