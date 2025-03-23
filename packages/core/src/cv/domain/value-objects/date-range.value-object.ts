/**
 * Value Object pour les plages de dates
 * Utilisé pour les expériences professionnelles, études, etc.
 */

import { z } from 'zod';
import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  ERROR_CODES, createSuccessWithWarnings,
  ValidationSeverityType,
  TRANSLATION_KEYS
} from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Définition des clés de validation pour DateRange
export const DATE_RANGE_VALIDATION_KEYS = {
  MISSING_START_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.MISSING_START_DATE,
  INVALID_DATE_FORMAT: TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE_FORMAT,
  END_BEFORE_START: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.END_BEFORE_START,
  FUTURE_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.FUTURE_DATE,
  INVALID_START_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_START_DATE,
  INVALID_END_DATE: TRANSLATION_KEYS.RESUME.WORK.VALIDATION.INVALID_END_DATE
};

// Adaptateur i18n par défaut pour la rétrocompatibilité
export class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    const messages: Record<string, string> = {
      [DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE]: 'La date de début est requise',
      [DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT]: 'Format de date invalide',
      [DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START]: 'La date de fin doit être postérieure à la date de début',
      [DATE_RANGE_VALIDATION_KEYS.FUTURE_DATE]: 'La date indiquée est dans le futur',
      [DATE_RANGE_VALIDATION_KEYS.INVALID_START_DATE]: 'Date de début invalide',
      [DATE_RANGE_VALIDATION_KEYS.INVALID_END_DATE]: 'Date de fin invalide'
    };

    return messages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Réponse optimiste pour éviter les erreurs
  }
}

/**
 * Value Object encapsulant une plage de dates (date de début et date de fin optionnelle)
 */
export class DateRange {
  // Instance de l'adaptateur i18n par défaut
  private static defaultI18n = new DefaultI18nAdapter();

  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param startDate Date de début
   * @param endDate Date de fin optionnelle (null si expérience en cours)
   */
  private constructor(
    private readonly startDate: Date,
    private readonly endDate: Date | null
  ) {}

  /**
   * Accesseur pour la date de début
   */
  public getStartDate(): Date {
    return this.startDate;
  }

  /**
   * Accesseur pour la date de fin
   */
  public getEndDate(): Date | null {
    return this.endDate;
  }

  /**
   * Vérifie si l'expérience est en cours (sans date de fin)
   */
  public isOngoing(): boolean {
    return this.endDate === null;
  }

  /**
   * Calcule la durée en mois
   * @returns Nombre de mois entre la date de début et la date de fin (ou aujourd'hui si en cours)
   */
  public getDurationInMonths(): number {
    const end = this.endDate || new Date();
    const diffInMonths = (end.getFullYear() - this.startDate.getFullYear()) * 12 + 
                         (end.getMonth() - this.startDate.getMonth());
    return Math.max(0, diffInMonths);
  }

  // Schéma Zod pour valider les dates
  private static dateSchema(_context: 'work' | 'education' = 'work', i18n: DomainI18nPortInterface) {
    
    const now = new Date();
    
    return z.object({
      startDate: z.string({
        required_error: i18n.translate(DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE)
      })
      .min(1, {
        message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE)
      })
      .refine(
        (date) => !isNaN(new Date(date).getTime()), 
        { 
          message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT), 
          path: ["startDate"]
        }
      )
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return parsedDate <= now;
        },
        {
          message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.FUTURE_DATE),
          path: ["startDate"]
        }
      ),
      
      endDate: z.string()
        .nullable()
        .optional()
        .refine(
          (date) => !date || !isNaN(new Date(date).getTime()),
          {
            message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
            path: ["endDate"]
          }
        )
        .refine(
          (date) => {
            if (!date) return true;
            const parsedDate = new Date(date);
            return parsedDate <= now;
          },
          {
            message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.FUTURE_DATE),
            path: ["endDate"]
          }
        )
    }).superRefine((data, ctx) => {
      // Vérification que la date de fin est après la date de début
      if (data.endDate && data.startDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        if (endDate < startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: i18n.translate(DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START),
            path: ["endDate"]
          });
        }
      }
    });
  }

  /**
   * Méthode factory pour créer une instance de DateRange
   * @param startDateStr Chaîne représentant la date de début (format YYYY-MM-DD)
   * @param endDateStr Chaîne représentant la date de fin (format YYYY-MM-DD), null pour une expérience en cours
   * @param context Contexte pour les messages d'erreur (ex: "work" ou "education")
   * @param i18n Interface d'internationalisation pour les messages d'erreur
   * @returns ResultType contenant soit l'objet DateRange, soit les erreurs
   */
  public static create(
    startDateStr: string,
    endDateStr: string | null | undefined,
    context: 'work' | 'education' = 'work',
    i18n: DomainI18nPortInterface = DateRange.defaultI18n
  ): ResultType<DateRange> {
    // Validation avec Zod
    const validationResult = this.dateSchema(context, i18n).safeParse({ 
      startDate: startDateStr, 
      endDate: endDateStr 
    });
    
    if (!validationResult.success) {
      // Convertir les erreurs Zod en format ValidationErrorInterface
      const errors: ValidationErrorInterface[] = validationResult.error.errors.map(err => {
        // Déterminer le champ concerné par l'erreur
        let field: string;
        // On vérifie explicitement le chemin indiqué dans l'erreur
        if (err.path.includes('startDate')) {
          field = 'startDate';
        } else if (err.path.includes('endDate')) {
          field = 'endDate';
        } else {
          // Par défaut, on utilise le premier élément du chemin
          field = String(err.path[0] || 'startDate');
        }
        
        let code = '';
        let i18nKey = '';
        let severity: ValidationSeverityType = 'error';
        
        // Déterminer le code d'erreur approprié selon le message
        if (err.message.includes(i18n.translate(DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE))) {
          code = field === "startDate" 
            ? ERROR_CODES.RESUME.WORK.MISSING_START_DATE 
            : 'missing_end_date';
          i18nKey = DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE;
        } else if (err.message.includes(i18n.translate(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT))) {
          code = 'invalid_date_format';
          i18nKey = DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT;
        } else if (err.message.includes(i18n.translate(DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START))) {
          code = ERROR_CODES.RESUME.WORK.END_BEFORE_START;
          i18nKey = DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START;
        } else if (err.message.includes(i18n.translate(DATE_RANGE_VALIDATION_KEYS.FUTURE_DATE))) {
          code = ERROR_CODES.RESUME.WORK.FUTURE_DATE;
          i18nKey = DATE_RANGE_VALIDATION_KEYS.FUTURE_DATE;
          severity = 'warning'; // Convertir en avertissement
        } else {
          code = `invalid_${field}`;
          i18nKey = field === "startDate" 
            ? DATE_RANGE_VALIDATION_KEYS.INVALID_START_DATE
            : DATE_RANGE_VALIDATION_KEYS.INVALID_END_DATE;
        }
        
        return {
          code,
          message: err.message,
          field,
          severity,
          layer: ValidationLayerType.DOMAIN,
          i18nKey,
          suggestion: field === "startDate" 
            ? "Utilisez le format YYYY-MM-DD, par exemple 2020-01-31"
            : "Pour une expérience en cours, laissez la date de fin vide"
        };
      });
      
      // Séparer les erreurs des avertissements
      const actualErrors = errors.filter(err => err.severity === 'error');
      const warnings = errors.filter(err => err.severity === 'warning' || err.severity === 'info');
      
      // S'il y a des erreurs bloquantes, retourner un échec
      if (actualErrors.length > 0) {
        return createFailure(actualErrors);
      }
      
      // S'il n'y a que des avertissements, créer l'objet avec des avertissements
      const startDate = new Date(startDateStr);
      const endDate = endDateStr ? new Date(endDateStr) : null;
      const dateRange = new DateRange(startDate, endDate);
      
      return createSuccessWithWarnings(dateRange, warnings);
    }
    
    // Création de l'objet DateRange
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : null;
    
    return createSuccess(new DateRange(startDate, endDate));
  }
} 