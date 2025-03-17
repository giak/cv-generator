/**
 * Service de validation pour les centres d'intérêt
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
 * Export validation keys for the interest validation service
 */
export const INTEREST_VALIDATION_KEYS = {
  MISSING_NAME: 'resume.interest.validation.missingName',
  BRIEF_NAME: 'resume.interest.validation.briefName',
  MISSING_KEYWORDS: 'resume.interest.validation.missingKeywords'
};

/**
 * Interface pour un centre d'intérêt
 */
export interface InterestInterface {
  name: string;
  keywords?: string[];
}

/**
 * Service de validation pour les centres d'intérêt
 */
export class InterestValidationService extends BaseValidationService<InterestInterface> {
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
   * Valide un centre d'intérêt complet
   * @param interest Centre d'intérêt à valider
   * @returns Résultat de validation
   */
  public validate(interest: InterestInterface): ResultType<InterestInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom du centre d'intérêt
    if (!interest.name || interest.name.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.INTEREST.MISSING_NAME,
        this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.MISSING_NAME),
        "name",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: INTEREST_VALIDATION_KEYS.MISSING_NAME
        }
      ));
    } else if (interest.name.length < 3) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.INTEREST.BRIEF_NAME,
        this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.BRIEF_NAME),
        "name",
        ValidationLayerType.PRESENTATION,
        "warning",
        {
          i18nKey: INTEREST_VALIDATION_KEYS.BRIEF_NAME,
          suggestion: "Détaillez davantage ce centre d'intérêt pour le rendre plus descriptif"
        }
      ));
    }
    
    // Validation des mots-clés (conseillé mais pas obligatoire)
    if (!interest.keywords || interest.keywords.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.INTEREST.MISSING_KEYWORDS,
        this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.MISSING_KEYWORDS),
        "keywords",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: INTEREST_VALIDATION_KEYS.MISSING_KEYWORDS,
          suggestion: "Ajoutez des mots-clés pour détailler ce centre d'intérêt"
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
        value: interest,
        warnings: errors
      } as any;
    }
    
    return createSuccess(interest);
  }
  
  /**
   * Valide un champ spécifique d'un centre d'intérêt
   * @param interest Centre d'intérêt
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof InterestInterface>(
    interest: InterestInterface, 
    fieldName: K
  ): ResultType<InterestInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!interest.name || interest.name.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.INTEREST.MISSING_NAME,
            this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.MISSING_NAME),
            "name",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: INTEREST_VALIDATION_KEYS.MISSING_NAME
            }
          ));
        } else if (interest.name.length < 3) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.INTEREST.BRIEF_NAME,
            this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.BRIEF_NAME),
            "name",
            ValidationLayerType.PRESENTATION,
            "warning",
            {
              i18nKey: INTEREST_VALIDATION_KEYS.BRIEF_NAME,
              suggestion: "Détaillez davantage ce centre d'intérêt pour le rendre plus descriptif"
            }
          ));
        }
        break;
        
      case 'keywords':
        if (!interest.keywords || interest.keywords.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.INTEREST.MISSING_KEYWORDS,
            this.i18nAdapter.translate(INTEREST_VALIDATION_KEYS.MISSING_KEYWORDS),
            "keywords",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: INTEREST_VALIDATION_KEYS.MISSING_KEYWORDS,
              suggestion: "Ajoutez des mots-clés pour détailler ce centre d'intérêt"
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
        value: interest[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(interest[fieldName]);
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
} 