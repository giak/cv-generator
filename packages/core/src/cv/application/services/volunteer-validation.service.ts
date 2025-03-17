/**
 * Service de validation pour les activités bénévoles
 */

import {
    ResultType,
    ValidationErrorInterface,
    ValidationLayerType,
    createSuccess,
    createFailure,
    ERROR_CODES
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

/**
 * Export validation keys for the volunteer validation service
 */
export const VOLUNTEER_VALIDATION_KEYS = {
  MISSING_ORGANIZATION: 'resume.volunteer.validation.missingOrganization',
  MISSING_POSITION: 'resume.volunteer.validation.missingPosition',
  MISSING_START_DATE: 'resume.volunteer.validation.missingStartDate',
  MISSING_SUMMARY: 'resume.volunteer.validation.missingSummary',
  BRIEF_SUMMARY: 'resume.volunteer.validation.briefSummary',
  MISSING_HIGHLIGHTS: 'resume.volunteer.validation.missingHighlights',
  INVALID_DATE_FORMAT: 'resume.volunteer.validation.invalidDateFormat',
  FUTURE_DATE: 'resume.volunteer.validation.futureDate'
};

/**
 * Interface pour une activité bénévole
 */
export interface VolunteerInterface {
  organization: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  summary: string;
  highlights?: string[];
  url?: string;
}

/**
 * Service de validation pour les activités bénévoles
 */
export class VolunteerValidationService extends BaseValidationService<VolunteerInterface> {
  private i18nAdapter: DomainI18nPortInterface;

  /**
   * Constructeur qui initialise le service avec un adaptateur i18n
   * @param i18nAdapter Adaptateur d'internationalisation
   */
  constructor(i18nAdapter?: DomainI18nPortInterface) {
    super();
    this.i18nAdapter = i18nAdapter || this.getDefaultI18nAdapter();
  }

  /**
   * Récupère l'adaptateur i18n par défaut
   * @private
   */
  private getDefaultI18nAdapter(): DomainI18nPortInterface {
    return {
      translate: (key: string) => key,
      exists: () => true
    };
  }

  /**
   * Valide une activité bénévole complète
   * @param volunteer Activité bénévole à valider
   * @returns Résultat de validation
   */
  public validate(volunteer: VolunteerInterface): ResultType<VolunteerInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation de l'organisation
    if (!volunteer.organization || volunteer.organization.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_ORGANIZATION,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_ORGANIZATION),
        "organization",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_ORGANIZATION
        }
      ));
    }
    
    // Validation du poste
    if (!volunteer.position || volunteer.position.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_POSITION,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_POSITION),
        "position",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_POSITION
        }
      ));
    }
    
    // Validation de la date de début
    if (!volunteer.startDate || volunteer.startDate.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_START_DATE),
        "startDate",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_START_DATE
        }
      ));
    } else if (!this.isValidDateFormat(volunteer.startDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT),
        "startDate",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT,
          suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
        }
      ));
    } else if (this.isFutureDate(volunteer.startDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE),
        "startDate",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE,
          suggestion: "Vérifiez la date, elle semble être dans le futur"
        }
      ));
    }
    
    // Validation de la date de fin (si présente)
    if (volunteer.endDate && volunteer.endDate.trim() !== '' && !this.isValidDateFormat(volunteer.endDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT),
        "endDate",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT,
          suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
        }
      ));
    } else if (volunteer.endDate && volunteer.endDate.trim() !== '' && this.isFutureDate(volunteer.endDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE),
        "endDate",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE,
          suggestion: "Vérifiez la date, elle semble être dans le futur"
        }
      ));
    }
    
    // Validation du résumé
    if (!volunteer.summary || volunteer.summary.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_SUMMARY,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_SUMMARY),
        "summary",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_SUMMARY
        }
      ));
    } else if (volunteer.summary.length < 50) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_SUMMARY,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.BRIEF_SUMMARY),
        "summary",
        ValidationLayerType.PRESENTATION,
        "warning",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.BRIEF_SUMMARY,
          suggestion: "Détaillez davantage votre activité bénévole pour montrer votre engagement"
        }
      ));
    }
    
    // Validation des highlights (optionnels mais conseillés)
    if (!volunteer.highlights || volunteer.highlights.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.VOLUNTEER.MISSING_HIGHLIGHTS,
        this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_HIGHLIGHTS),
        "highlights",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
          suggestion: "Ajoutez des points forts pour mettre en valeur vos accomplissements"
        }
      ));
    }
    
    // Si des erreurs de niveau "error" sont présentes, on retourne un échec
    if (errors.some(err => err.severity === 'error')) {
      return createFailure(errors);
    }
    
    // Si seulement des warnings/infos, on retourne un succès avec les warnings
    if (errors.length > 0) {
      return {
        success: true,
        value: volunteer,
        warnings: errors
      } as any;
    }
    
    return createSuccess(volunteer);
  }
  
  /**
   * Valide un champ spécifique d'une activité bénévole
   * @param volunteer Activité bénévole
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof VolunteerInterface>(
    volunteer: VolunteerInterface, 
    fieldName: K
  ): ResultType<VolunteerInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'organization':
        if (!volunteer.organization || volunteer.organization.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_ORGANIZATION,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_ORGANIZATION),
            "organization",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_ORGANIZATION
            }
          ));
        }
        break;
        
      case 'position':
        if (!volunteer.position || volunteer.position.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_POSITION,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_POSITION),
            "position",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_POSITION
            }
          ));
        }
        break;
        
      case 'startDate':
        if (!volunteer.startDate || volunteer.startDate.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_START_DATE),
            "startDate",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_START_DATE
            }
          ));
        } else if (!this.isValidDateFormat(volunteer.startDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT),
            "startDate",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT,
              suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
            }
          ));
        } else if (this.isFutureDate(volunteer.startDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE),
            "startDate",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE,
              suggestion: "Vérifiez la date, elle semble être dans le futur"
            }
          ));
        }
        break;
        
      case 'endDate':
        if (volunteer.endDate && volunteer.endDate.trim() !== '' && !this.isValidDateFormat(volunteer.endDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT),
            "endDate",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.INVALID_DATE_FORMAT,
              suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
            }
          ));
        } else if (volunteer.endDate && volunteer.endDate.trim() !== '' && this.isFutureDate(volunteer.endDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_START_DATE,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE),
            "endDate",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.FUTURE_DATE,
              suggestion: "Vérifiez la date, elle semble être dans le futur"
            }
          ));
        }
        break;
        
      case 'summary':
        if (!volunteer.summary || volunteer.summary.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_SUMMARY,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_SUMMARY),
            "summary",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_SUMMARY
            }
          ));
        } else if (volunteer.summary.length < 50) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_SUMMARY,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.BRIEF_SUMMARY),
            "summary",
            ValidationLayerType.PRESENTATION,
            "warning",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.BRIEF_SUMMARY,
              suggestion: "Détaillez davantage votre activité bénévole pour montrer votre engagement"
            }
          ));
        }
        break;
        
      case 'highlights':
        if (!volunteer.highlights || volunteer.highlights.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.VOLUNTEER.MISSING_HIGHLIGHTS,
            this.i18nAdapter.translate(VOLUNTEER_VALIDATION_KEYS.MISSING_HIGHLIGHTS),
            "highlights",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: VOLUNTEER_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
              suggestion: "Ajoutez des points forts pour mettre en valeur vos accomplissements"
            }
          ));
        }
        break;
    }
    
    // Si des erreurs de niveau "error" sont présentes, on retourne un échec
    if (errors.some(err => err.severity === 'error')) {
      return createFailure(errors);
    }
    
    // Si seulement des warnings/infos, on retourne un succès avec les warnings
    if (errors.length > 0) {
      return {
        success: true,
        value: volunteer[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(volunteer[fieldName]);
  }
  
  /**
   * Helper pour créer une erreur i18n avec tous les champs nécessaires
   */
  protected createError(
    code: string,
    message: string,
    field: string,
    layer: ValidationLayerType,
    severity: 'error' | 'warning' | 'info' = 'error',
    options?: {
      i18nKey?: string;
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
      ...(options || {}),
    };
  }
  
  /**
   * Vérifie si une date est dans un format valide
   * @param date Date à vérifier
   * @returns true si le format est valide
   */
  private isValidDateFormat(date: string): boolean {
    // Format ISO (YYYY-MM-DD) ou format année-mois (YYYY-MM)
    const regex = /^\d{4}-\d{2}(-\d{2})?$/;
    return regex.test(date);
  }
  
  /**
   * Vérifie si une date est dans le futur
   * @param dateStr Date au format YYYY-MM-DD ou YYYY-MM
   * @returns true si la date est dans le futur
   */
  private isFutureDate(dateStr: string): boolean {
    // Normalisation de la date
    const normalizedDate = dateStr.includes('-') 
      ? dateStr
      : `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    
    const date = new Date(normalizedDate);
    const today = new Date();
    
    // Vérifier si la date est valide avant de comparer
    return !isNaN(date.getTime()) && date > today;
  }
} 