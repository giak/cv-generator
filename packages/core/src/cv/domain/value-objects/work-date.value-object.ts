/**
 * Value Object pour les dates d'expérience professionnelle
 * Implémentation utilisant le pattern ResultType standardisé
 */

import { 
  ResultType, 
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  ERROR_CODES,
  isSuccess
} from '@cv-generator/shared';


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
   */
  private constructor(private readonly value: string, private readonly date: Date) {}

  /**
   * Méthode factory compatible avec l'ancien pattern Result
   * Maintenue pour la compatibilité avec les tests existants
   * @param dateStr La date au format YYYY-MM-DD
   * @returns Objet au format legacy (isSuccess, isFailure, etc.)
   */
  public static create(dateStr: string): LegacyDateResult {
    // Validation du format YYYY-MM-DD
    if (!dateStr) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'La date est requise'
      };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'La date doit être au format YYYY-MM-DD'
      };
    }

    // Validation de la date elle-même
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'Date invalide'
      };
    }

    // Si toutes les validations passent, créer l'objet
    const workDateInstance = new WorkDate(dateStr, date);
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
   * @returns ResultType contenant soit l'objet WorkDate en cas de succès, soit les erreurs
   */
  public static createWithResultType(dateStr: string): ResultType<WorkDate> {
    // Validation du format YYYY-MM-DD
    if (!dateStr) {
      return createFailure([{
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: "La date est requise",
        field: "date",
        severity: "error",
        layer: ValidationLayerType.DOMAIN
      }]);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return createFailure([{
        code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
        message: "La date doit être au format YYYY-MM-DD",
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
        message: "Date invalide",
        field: "date",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Vérifiez que le jour et le mois sont valides"
      }]);
    }

    return createSuccess(new WorkDate(dateStr, date));
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