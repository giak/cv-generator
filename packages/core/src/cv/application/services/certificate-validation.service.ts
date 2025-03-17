/**
 * Service de validation pour les certificats et formations
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
 * Export validation keys for the certificate validation service
 */
export const CERTIFICATE_VALIDATION_KEYS = {
  MISSING_NAME: 'resume.certificate.validation.missingName',
  MISSING_ISSUER: 'resume.certificate.validation.missingIssuer',
  MISSING_DATE: 'resume.certificate.validation.missingDate',
  FUTURE_DATE: 'resume.certificate.validation.futureDate',
  MISSING_URL: 'resume.certificate.validation.missingUrl',
  EXPIRED_CERTIFICATION: 'resume.certificate.validation.expiredCertification',
  INVALID_DATE_FORMAT: 'resume.certificate.validation.invalidDateFormat'
};

/**
 * Interface pour un certificat
 */
export interface CertificateInterface {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  expirationDate?: string;
}

/**
 * Service de validation pour les certificats
 */
export class CertificateValidationService extends BaseValidationService<CertificateInterface> {
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
   * Valide un certificat complet
   * @param certificate Certificat à valider
   * @returns Résultat de validation
   */
  public validate(certificate: CertificateInterface): ResultType<CertificateInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom du certificat
    if (!certificate.name || certificate.name.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.MISSING_NAME,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_NAME),
        "name",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_NAME
        }
      ));
    }
    
    // Validation de l'organisme d'émission
    if (!certificate.issuer || certificate.issuer.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.MISSING_ISSUER,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_ISSUER),
        "issuer",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_ISSUER
        }
      ));
    }
    
    // Validation de la date d'obtention
    if (!certificate.date || certificate.date.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_DATE),
        "date",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_DATE
        }
      ));
    } else if (!this.isValidDateFormat(certificate.date)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
        "date",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT,
          suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
        }
      ));
    } else if (this.isFutureDate(certificate.date)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.FUTURE_DATE,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.FUTURE_DATE),
        "date",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.FUTURE_DATE,
          suggestion: "Vérifiez la date, elle semble être dans le futur"
        }
      ));
    }
    
    // Validation de la date d'expiration (si présente)
    if (certificate.expirationDate && certificate.expirationDate.trim() !== '') {
      if (!this.isValidDateFormat(certificate.expirationDate)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
          this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
          "expirationDate",
          ValidationLayerType.DOMAIN,
          "error",
          {
            i18nKey: CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT,
            suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
          }
        ));
      } else if (this.isExpired(certificate.expirationDate)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.CERTIFICATE.EXPIRED_CERTIFICATION,
          this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.EXPIRED_CERTIFICATION),
          "expirationDate",
          ValidationLayerType.DOMAIN,
          "warning",
          {
            i18nKey: CERTIFICATE_VALIDATION_KEYS.EXPIRED_CERTIFICATION,
            suggestion: "Ce certificat est expiré, vérifiez si une mise à jour est nécessaire"
          }
        ));
      }
    }
    
    // Validation de l'URL (optionnelle mais conseillée)
    if (!certificate.url || certificate.url.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.CERTIFICATE.MISSING_URL,
        this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_URL),
        "url",
        ValidationLayerType.PRESENTATION,
        "info",
        {
          i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_URL,
          suggestion: "Ajoutez un lien pour vérifier ce certificat"
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
        value: certificate,
        warnings: errors
      } as any;
    }
    
    return createSuccess(certificate);
  }
  
  /**
   * Valide un champ spécifique d'un certificat
   * @param certificate Certificat
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof CertificateInterface>(
    certificate: CertificateInterface, 
    fieldName: K
  ): ResultType<CertificateInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!certificate.name || certificate.name.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.MISSING_NAME,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_NAME),
            "name",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_NAME
            }
          ));
        }
        break;
        
      case 'issuer':
        if (!certificate.issuer || certificate.issuer.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.MISSING_ISSUER,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_ISSUER),
            "issuer",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_ISSUER
            }
          ));
        }
        break;
        
      case 'date':
        if (!certificate.date || certificate.date.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_DATE),
            "date",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_DATE
            }
          ));
        } else if (!this.isValidDateFormat(certificate.date)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
            "date",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT,
              suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
            }
          ));
        } else if (this.isFutureDate(certificate.date)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.FUTURE_DATE,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.FUTURE_DATE),
            "date",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.FUTURE_DATE,
              suggestion: "Vérifiez la date, elle semble être dans le futur"
            }
          ));
        }
        break;
        
      case 'expirationDate':
        if (certificate.expirationDate && certificate.expirationDate.trim() !== '') {
          if (!this.isValidDateFormat(certificate.expirationDate)) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.CERTIFICATE.MISSING_DATE,
              this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT),
              "expirationDate",
              ValidationLayerType.DOMAIN,
              "error",
              {
                i18nKey: CERTIFICATE_VALIDATION_KEYS.INVALID_DATE_FORMAT,
                suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM"
              }
            ));
          } else if (this.isExpired(certificate.expirationDate)) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.CERTIFICATE.EXPIRED_CERTIFICATION,
              this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.EXPIRED_CERTIFICATION),
              "expirationDate",
              ValidationLayerType.DOMAIN,
              "warning",
              {
                i18nKey: CERTIFICATE_VALIDATION_KEYS.EXPIRED_CERTIFICATION,
                suggestion: "Ce certificat est expiré, vérifiez si une mise à jour est nécessaire"
              }
            ));
          }
        }
        break;
        
      case 'url':
        if (!certificate.url || certificate.url.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.CERTIFICATE.MISSING_URL,
            this.i18nAdapter.translate(CERTIFICATE_VALIDATION_KEYS.MISSING_URL),
            "url",
            ValidationLayerType.PRESENTATION,
            "info",
            {
              i18nKey: CERTIFICATE_VALIDATION_KEYS.MISSING_URL,
              suggestion: "Ajoutez un lien pour vérifier ce certificat"
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
        value: certificate[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(certificate[fieldName]);
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
  
  /**
   * Vérifie si un certificat est expiré
   * @param dateStr Date d'expiration au format YYYY-MM-DD ou YYYY-MM
   * @returns true si le certificat est expiré
   */
  private isExpired(dateStr: string): boolean {
    // Normalisation de la date
    const normalizedDate = dateStr.includes('-') 
      ? dateStr
      : `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    
    const date = new Date(normalizedDate);
    const today = new Date();
    
    // Vérifier si la date est valide avant de comparer
    return !isNaN(date.getTime()) && date < today;
  }
} 