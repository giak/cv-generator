/**
 * Service de validation pour les références professionnelles
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
 * Export validation keys for the reference validation service
 */
export const REFERENCE_VALIDATION_KEYS = {
  MISSING_NAME: 'resume.reference.validation.missingName',
  MISSING_REFERENCE: 'resume.reference.validation.missingReference',
  BRIEF_REFERENCE: 'resume.reference.validation.briefReference',
  MISSING_POSITION: 'resume.reference.validation.missingPosition',
  MISSING_COMPANY: 'resume.reference.validation.missingCompany'
};

/**
 * Interface pour une référence professionnelle
 */
export interface ReferenceInterface {
  name: string;
  reference: string;
  position?: string;
  company?: string;
}

/**
 * Service de validation pour les références professionnelles
 */
export class ReferenceValidationService extends BaseValidationService<ReferenceInterface> {
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
   * Valide une référence complète
   * @param reference Référence à valider
   * @returns Résultat de validation
   */
  public validate(reference: ReferenceInterface): ResultType<ReferenceInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom de la personne de référence
    if (!reference.name || reference.name.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.REFERENCE.MISSING_NAME,
        this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_NAME),
        "name",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_NAME
        }
      ));
    }
    
    // Validation du texte de référence
    if (!reference.reference || reference.reference.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.REFERENCE.MISSING_REFERENCE,
        this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_REFERENCE),
        "reference",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_REFERENCE
        }
      ));
    } else if (reference.reference.length < 20) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.REFERENCE.BRIEF_REFERENCE,
        this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.BRIEF_REFERENCE),
        "reference",
        ValidationLayerType.PRESENTATION,
        "warning",
        {
          i18nKey: REFERENCE_VALIDATION_KEYS.BRIEF_REFERENCE,
          suggestion: "Détaillez davantage cette référence pour la rendre plus crédible"
        }
      ));
    }
    
    // Validation du poste de la personne (optionnelle mais conseillée)
    if (!reference.position || reference.position.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.REFERENCE.MISSING_POSITION,
        this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_POSITION),
        "position",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_POSITION,
          suggestion: "Précisez le poste ou la fonction de cette personne de référence"
        }
      ));
    }
    
    // Validation de l'entreprise (optionnelle mais conseillée)
    if (!reference.company || reference.company.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.REFERENCE.MISSING_COMPANY,
        this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_COMPANY),
        "company",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_COMPANY,
          suggestion: "Précisez l'entreprise ou l'organisation de cette personne de référence"
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
        value: reference,
        warnings: errors
      } as any;
    }
    
    return createSuccess(reference);
  }
  
  /**
   * Valide un champ spécifique d'une référence
   * @param reference Référence
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof ReferenceInterface>(
    reference: ReferenceInterface, 
    fieldName: K
  ): ResultType<ReferenceInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!reference.name || reference.name.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.REFERENCE.MISSING_NAME,
            this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_NAME),
            "name",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_NAME
            }
          ));
        }
        break;
        
      case 'reference':
        if (!reference.reference || reference.reference.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.REFERENCE.MISSING_REFERENCE,
            this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_REFERENCE),
            "reference",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_REFERENCE
            }
          ));
        } else if (reference.reference.length < 20) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.REFERENCE.BRIEF_REFERENCE,
            this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.BRIEF_REFERENCE),
            "reference",
            ValidationLayerType.PRESENTATION,
            "warning",
            {
              i18nKey: REFERENCE_VALIDATION_KEYS.BRIEF_REFERENCE,
              suggestion: "Détaillez davantage cette référence pour la rendre plus crédible"
            }
          ));
        }
        break;
        
      case 'position':
        if (!reference.position || reference.position.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.REFERENCE.MISSING_POSITION,
            this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_POSITION),
            "position",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_POSITION,
              suggestion: "Précisez le poste ou la fonction de cette personne de référence"
            }
          ));
        }
        break;
        
      case 'company':
        if (!reference.company || reference.company.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.REFERENCE.MISSING_COMPANY,
            this.i18nAdapter.translate(REFERENCE_VALIDATION_KEYS.MISSING_COMPANY),
            "company",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: REFERENCE_VALIDATION_KEYS.MISSING_COMPANY,
              suggestion: "Précisez l'entreprise ou l'organisation de cette personne de référence"
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
        value: reference[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(reference[fieldName]);
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