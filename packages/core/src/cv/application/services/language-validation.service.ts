/**
 * Service de validation des langues pour le CV
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
 * Export validation keys for the language validation service
 */
export const LANGUAGE_VALIDATION_KEYS = {
  MISSING_LANGUAGE: 'validation.language.missing_language',
  MISSING_FLUENCY: 'validation.language.missing_fluency',
  UNDEFINED_FLUENCY: 'validation.language.undefined_fluency',
  REDUNDANT_LANGUAGE: 'validation.language.redundant_language'
};

/**
 * Interface pour une langue
 */
export interface LanguageInterface {
  language: string;
  fluency?: string;
}

/**
 * Service de validation pour les langues
 */
export class LanguageValidationService extends BaseValidationService<LanguageInterface> {
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
   * Valide une langue complète
   * @param language Langue à valider
   * @returns Résultat de validation
   */
  public validate(language: LanguageInterface): ResultType<LanguageInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom de la langue
    if (!language.language || language.language.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.LANGUAGE.MISSING_LANGUAGE,
        this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE),
        "language",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE
        }
      ));
    }
    
    // Validation du niveau de maîtrise (conseillé mais pas obligatoire)
    if (!language.fluency || language.fluency.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.LANGUAGE.MISSING_FLUENCY,
        this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY),
        "fluency",
        ValidationLayerType.DOMAIN,
        "warning",
        {
          i18nKey: LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY
        }
      ));
    } else {
      // Vérifier si le niveau de maîtrise est reconnu
      const validFluencyLevels = ['elementary', 'limited_working', 'professional_working', 'full_professional', 'native', 'bilingual', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
      if (!validFluencyLevels.includes(language.fluency.toLowerCase())) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.LANGUAGE.UNDEFINED_FLUENCY,
          this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY),
          "fluency",
          ValidationLayerType.DOMAIN,
          "info",
          {
            i18nKey: LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY
          }
        ));
      }
    }
    
    // Si des erreurs de niveau "error" sont présentes, on retourne un échec
    if (errors.some(err => err.severity === 'error')) {
      return createFailure(errors);
    }
    
    // Si seulement des warnings/infos, on retourne un succès avec les warnings
    if (errors.length > 0) {
      return {
        success: true,
        value: language,
        warnings: errors
      } as any;
    }
    
    return createSuccess(language);
  }
  
  /**
   * Valide un champ spécifique d'une langue
   * @param language Langue
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof LanguageInterface>(
    language: LanguageInterface, 
    fieldName: K
  ): ResultType<LanguageInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'language':
        if (!language.language || language.language.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.LANGUAGE.MISSING_LANGUAGE,
            this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE),
            "language",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE
            }
          ));
        }
        break;
        
      case 'fluency':
        if (!language.fluency || language.fluency.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.LANGUAGE.MISSING_FLUENCY,
            this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY),
            "fluency",
            ValidationLayerType.DOMAIN,
            "warning",
            {
              i18nKey: LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY
            }
          ));
        } else {
          // Vérifier si le niveau de maîtrise est reconnu
          const validFluencyLevels = ['elementary', 'limited_working', 'professional_working', 'full_professional', 'native', 'bilingual', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
          if (!validFluencyLevels.includes(language.fluency.toLowerCase())) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.LANGUAGE.UNDEFINED_FLUENCY,
              this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY),
              "fluency",
              ValidationLayerType.DOMAIN,
              "info",
              {
                i18nKey: LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY
              }
            ));
          }
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
        value: language[fieldName],
        warnings: errors
      } as any;
    }
    
    return createSuccess(language[fieldName]);
  }
  
  /**
   * Validate if there are redundant languages in the languages array
   * @param languages Array of languages to check for redundancy
   * @returns Validation result with warnings if redundant languages are found
   */
  public validateRedundantLanguages(
    languages: LanguageInterface[]
  ): ResultType<LanguageInterface[]> {
    const errors: ValidationErrorInterface[] = [];
    const languagesLower: string[] = [];

    languages.forEach((lang, index) => {
      const languageLower = lang.language.toLowerCase();
      if (languagesLower.includes(languageLower)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.LANGUAGE.REDUNDANT_LANGUAGE,
          this.i18nAdapter.translate(LANGUAGE_VALIDATION_KEYS.REDUNDANT_LANGUAGE),
          `languages[${index}].language`,
          ValidationLayerType.DOMAIN,
          "warning",
          {
            i18nKey: LANGUAGE_VALIDATION_KEYS.REDUNDANT_LANGUAGE
          }
        ));
      } else {
        languagesLower.push(languageLower);
      }
    });
    
    // Si des warnings ont été trouvés, on retourne un succès avec warnings
    if (errors.length > 0) {
      return {
        success: true,
        value: languages,
        warnings: errors
      } as any;
    }
    
    return createSuccess(languages);
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