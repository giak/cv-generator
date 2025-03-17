/**
 * Service de validation pour les publications
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
 * Export validation keys for the publication validation service
 */
export const PUBLICATION_VALIDATION_KEYS = {
  MISSING_NAME: 'resume.publication.validation.missingName',
  MISSING_PUBLISHER: 'resume.publication.validation.missingPublisher',
  MISSING_RELEASE_DATE: 'resume.publication.validation.missingReleaseDate',
  FUTURE_DATE: 'resume.publication.validation.futureDate',
  MISSING_URL: 'resume.publication.validation.missingUrl',
  MISSING_SUMMARY: 'resume.publication.validation.missingSummary'
};

/**
 * Interface pour une publication
 */
export interface PublicationInterface {
  name: string;
  publisher: string;
  releaseDate: string;
  url?: string;
  summary?: string;
}

/**
 * Service de validation pour les publications
 */
export class PublicationValidationService extends BaseValidationService<PublicationInterface> {
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
   * Valide une publication complète
   * @param publication Publication à valider
   * @returns Résultat de validation
   */
  public validate(publication: PublicationInterface): ResultType<PublicationInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom de la publication
    if (!publication.name || publication.name.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.MISSING_NAME,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_NAME),
        "name",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_NAME
        }
      ));
    }
    
    // Validation de l'éditeur
    if (!publication.publisher || publication.publisher.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.MISSING_PUBLISHER,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_PUBLISHER),
        "publisher",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_PUBLISHER
        }
      ));
    }
    
    // Validation de la date de publication
    if (!publication.releaseDate || publication.releaseDate.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.MISSING_RELEASE_DATE,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_RELEASE_DATE),
        "releaseDate",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_RELEASE_DATE
        }
      ));
    } else if (this.isFutureDate(publication.releaseDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.FUTURE_DATE,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.FUTURE_DATE),
        "releaseDate",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.FUTURE_DATE,
          suggestion: "Vérifiez la date, elle semble être dans le futur"
        }
      ));
    }
    
    // Validation de l'URL (optionnelle mais conseillée)
    if (!publication.url || publication.url.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.MISSING_URL,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_URL),
        "url",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_URL,
          suggestion: "Ajoutez un lien vers cette publication pour plus de crédibilité"
        }
      ));
    }
    
    // Validation du résumé (optionnel mais conseillé)
    if (!publication.summary || publication.summary.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PUBLICATION.MISSING_SUMMARY,
        this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_SUMMARY),
        "summary",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_SUMMARY,
          suggestion: "Ajoutez un résumé pour expliquer le contenu de cette publication"
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
        value: publication,
        warnings: errors
      } as any;
    }
    
    return createSuccess(publication);
  }
  
  /**
   * Valide un champ spécifique d'une publication
   * @param publication Publication
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof PublicationInterface>(
    publication: PublicationInterface, 
    fieldName: K
  ): ResultType<PublicationInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!publication.name || publication.name.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.MISSING_NAME,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_NAME),
            "name",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_NAME
            }
          ));
        }
        break;
        
      case 'publisher':
        if (!publication.publisher || publication.publisher.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.MISSING_PUBLISHER,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_PUBLISHER),
            "publisher",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_PUBLISHER
            }
          ));
        }
        break;
        
      case 'releaseDate':
        if (!publication.releaseDate || publication.releaseDate.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.MISSING_RELEASE_DATE,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_RELEASE_DATE),
            "releaseDate",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_RELEASE_DATE
            }
          ));
        } else if (this.isFutureDate(publication.releaseDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.FUTURE_DATE,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.FUTURE_DATE),
            "releaseDate",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.FUTURE_DATE,
              suggestion: "Vérifiez la date, elle semble être dans le futur"
            }
          ));
        }
        break;
        
      case 'url':
        if (!publication.url || publication.url.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.MISSING_URL,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_URL),
            "url",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_URL,
              suggestion: "Ajoutez un lien vers cette publication pour plus de crédibilité"
            }
          ));
        }
        break;
        
      case 'summary':
        if (!publication.summary || publication.summary.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PUBLICATION.MISSING_SUMMARY,
            this.i18nAdapter.translate(PUBLICATION_VALIDATION_KEYS.MISSING_SUMMARY),
            "summary",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: PUBLICATION_VALIDATION_KEYS.MISSING_SUMMARY,
              suggestion: "Ajoutez un résumé pour expliquer le contenu de cette publication"
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
        value: publication[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(publication[fieldName]);
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