/**
 * Service de validation pour les distinctions et récompenses
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
 * Export validation keys for the award validation service
 */
export const AWARD_VALIDATION_KEYS = {
  MISSING_TITLE: 'resume.award.validation.missingTitle',
  MISSING_DATE: 'resume.award.validation.missingDate',
  MISSING_AWARDER: 'resume.award.validation.missingAwarder',
  MISSING_SUMMARY: 'resume.award.validation.missingSummary',
  FUTURE_DATE: 'resume.award.validation.futureDate'
};

/**
 * Interface pour une distinction/récompense
 */
export interface AwardInterface {
  title: string;
  date: string;
  awarder: string;
  summary?: string;
}

/**
 * Service de validation pour les distinctions/récompenses
 */
export class AwardValidationService extends BaseValidationService<AwardInterface> {
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
   * Valide une distinction/récompense complète
   * @param award Distinction/récompense à valider
   * @returns Résultat de validation
   */
  public validate(award: AwardInterface): ResultType<AwardInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du titre
    if (!award.title || award.title.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.AWARD.MISSING_TITLE,
        this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_TITLE),
        "title",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: AWARD_VALIDATION_KEYS.MISSING_TITLE
        }
      ));
    }
    
    // Validation de la date
    if (!award.date || award.date.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.AWARD.MISSING_DATE,
        this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_DATE),
        "date",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: AWARD_VALIDATION_KEYS.MISSING_DATE
        }
      ));
    } else if (this.isFutureDate(award.date)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.AWARD.FUTURE_DATE,
        this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.FUTURE_DATE),
        "date",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: AWARD_VALIDATION_KEYS.FUTURE_DATE,
          suggestion: "Vérifiez la date, elle semble être dans le futur"
        }
      ));
    }
    
    // Validation de l'organisme décernant
    if (!award.awarder || award.awarder.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.AWARD.MISSING_AWARDER,
        this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_AWARDER),
        "awarder",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: AWARD_VALIDATION_KEYS.MISSING_AWARDER
        }
      ));
    }
    
    // Validation du résumé (optionnel mais conseillé)
    if (!award.summary || award.summary.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.AWARD.MISSING_SUMMARY,
        this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_SUMMARY),
        "summary",
        ValidationLayerType.APPLICATION,
        "info",
        {
          i18nKey: AWARD_VALIDATION_KEYS.MISSING_SUMMARY,
          suggestion: "Ajoutez un résumé pour expliquer l'importance de cette distinction"
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
        value: award,
        warnings: errors
      } as any;
    }
    
    return createSuccess(award);
  }
  
  /**
   * Valide un champ spécifique d'une distinction/récompense
   * @param award Distinction/récompense
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof AwardInterface>(
    award: AwardInterface, 
    fieldName: K
  ): ResultType<AwardInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'title':
        if (!award.title || award.title.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.AWARD.MISSING_TITLE,
            this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_TITLE),
            "title",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: AWARD_VALIDATION_KEYS.MISSING_TITLE
            }
          ));
        }
        break;
        
      case 'date':
        if (!award.date || award.date.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.AWARD.MISSING_DATE,
            this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_DATE),
            "date",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: AWARD_VALIDATION_KEYS.MISSING_DATE
            }
          ));
        } else if (this.isFutureDate(award.date)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.AWARD.FUTURE_DATE,
            this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.FUTURE_DATE),
            "date",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: AWARD_VALIDATION_KEYS.FUTURE_DATE,
              suggestion: "Vérifiez la date, elle semble être dans le futur"
            }
          ));
        }
        break;
        
      case 'awarder':
        if (!award.awarder || award.awarder.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.AWARD.MISSING_AWARDER,
            this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_AWARDER),
            "awarder",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: AWARD_VALIDATION_KEYS.MISSING_AWARDER
            }
          ));
        }
        break;
        
      case 'summary':
        if (!award.summary || award.summary.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.AWARD.MISSING_SUMMARY,
            this.i18nAdapter.translate(AWARD_VALIDATION_KEYS.MISSING_SUMMARY),
            "summary",
            ValidationLayerType.APPLICATION,
            "info",
            {
              i18nKey: AWARD_VALIDATION_KEYS.MISSING_SUMMARY,
              suggestion: "Ajoutez un résumé pour expliquer l'importance de cette distinction"
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
        value: award[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(award[fieldName]);
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