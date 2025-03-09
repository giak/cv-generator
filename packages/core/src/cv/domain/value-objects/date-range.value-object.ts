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
  ERROR_CODES,
  zodToResult,
  createSuccessWithWarnings,
  ValidationSeverityType
} from '@cv-generator/shared';

/**
 * Value Object encapsulant une plage de dates (date de début et date de fin optionnelle)
 */
export class DateRange {
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
  private static dateSchema(context: 'work' | 'education' = 'work') {
    const contextMap = {
      work: ERROR_CODES.RESUME.WORK,
      education: ERROR_CODES.RESUME.EDUCATION
    };
    
    const currentErrorCodes = contextMap[context];
    const now = new Date();
    
    return z.object({
      startDate: z.string({
        required_error: "La date de début est requise"
      })
      .min(1, {
        message: "La date de début est requise"
      })
      .refine(
        (date) => !isNaN(new Date(date).getTime()), 
        { 
          message: "Format de date invalide", 
          path: ["startDate"]
        }
      )
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return parsedDate <= now;
        },
        {
          message: "La date indiquée est dans le futur",
          path: ["startDate"]
        }
      ),
      
      endDate: z.string()
        .nullable()
        .optional()
        .refine(
          (date) => !date || !isNaN(new Date(date).getTime()),
          {
            message: "Format de date invalide",
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
            message: "La date indiquée est dans le futur",
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
            message: "La date de fin doit être postérieure à la date de début",
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
   * @returns ResultType contenant soit l'objet DateRange, soit les erreurs
   */
  public static create(
    startDateStr: string,
    endDateStr: string | null | undefined,
    context: 'work' | 'education' = 'work'
  ): ResultType<DateRange> {
    // Validation avec Zod
    const validationResult = this.dateSchema(context).safeParse({ 
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
        let severity: ValidationSeverityType = 'error';
        
        // Déterminer le code d'erreur approprié selon le message
        if (err.message.includes("requise")) {
          code = field === "startDate" 
            ? ERROR_CODES.RESUME.WORK.MISSING_START_DATE 
            : 'missing_end_date';
        } else if (err.message.includes("Format de date")) {
          code = 'invalid_date_format';
        } else if (err.message.includes("postérieure")) {
          code = ERROR_CODES.RESUME.WORK.END_BEFORE_START;
        } else if (err.message.includes("futur")) {
          code = ERROR_CODES.RESUME.WORK.FUTURE_DATE;
          severity = 'warning'; // Convertir en avertissement
        } else {
          code = `invalid_${field}`;
        }
        
        return {
          code,
          message: err.message,
          field,
          severity,
          layer: ValidationLayerType.DOMAIN,
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