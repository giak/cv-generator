import { Result } from '../../../modules/cv/domain/shared/Result'

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
   * Crée une instance validée de WorkDate
   * @param dateStr La date au format YYYY-MM-DD
   * @returns Result contenant soit l'instance validée, soit un message d'erreur
   */
  static create(dateStr: string): Result<WorkDate> {
    // Validation du format YYYY-MM-DD
    if (!dateStr) {
      return Result.fail('La date est requise')
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr)) {
      return Result.fail('La date doit être au format YYYY-MM-DD')
    }

    // Validation de la date elle-même
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return Result.fail('Date invalide')
    }

    return Result.ok(new WorkDate(dateStr, date))
  }

  /**
   * Obtient la valeur de la date au format string YYYY-MM-DD
   * @returns La date au format YYYY-MM-DD
   */
  getValue(): string {
    return this.value
  }

  /**
   * Obtient l'objet Date JavaScript
   * @returns L'objet Date
   */
  getDate(): Date {
    return new Date(this.date)
  }

  /**
   * Vérifie si cette date est antérieure à une autre date
   * @param other L'autre date à comparer
   * @returns true si cette date est antérieure à l'autre date
   */
  isBefore(other: WorkDate): boolean {
    return this.date < other.date
  }

  /**
   * Vérifie si cette date est postérieure à une autre date
   * @param other L'autre date à comparer
   * @returns true si cette date est postérieure à l'autre date
   */
  isAfter(other: WorkDate): boolean {
    return this.date > other.date
  }

  /**
   * Vérifie si cette date est égale à une autre date
   * @param other L'autre date à comparer
   * @returns true si les dates sont égales
   */
  equals(other: WorkDate): boolean {
    return this.value === other.value
  }

  /**
   * Formate la date au format local (ex: 01/01/2020)
   * @returns La date au format local
   */
  toLocaleDateString(locale: string = 'fr-FR'): string {
    return this.date.toLocaleDateString(locale)
  }

  /**
   * Formate la date en format long (ex: janvier 2020)
   * @returns La date au format long
   */
  toMonthYearString(locale: string = 'fr-FR'): string {
    return this.date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  /**
   * Calcule la durée en mois entre cette date et une autre date
   * @param other La date de fin (si non fournie, utilise la date actuelle)
   * @returns Le nombre de mois entre les deux dates
   */
  monthsUntil(other?: WorkDate): number {
    const endDate = other ? other.date : new Date()
    const startYear = this.date.getFullYear()
    const startMonth = this.date.getMonth()
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth()
    
    return (endYear - startYear) * 12 + (endMonth - startMonth)
  }
} 