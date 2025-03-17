/**
 * Service de validation pour les expériences professionnelles
 */

import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  isFailure,
  ERROR_CODES
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DateRange } from '../../domain/value-objects/date-range.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Export validation keys for the work validation service
export const WORK_VALIDATION_KEYS = {
  MISSING_COMPANY: 'resume.work.validation.missingCompany',
  MISSING_POSITION: 'resume.work.validation.missingPosition',
  VAGUE_POSITION: 'resume.work.validation.vaguePosition',
  MISSING_SUMMARY: 'resume.work.validation.missingSummary',
  BRIEF_DESCRIPTION: 'resume.work.validation.briefDescription',
  MISSING_HIGHLIGHTS: 'resume.work.validation.missingHighlights',
  VAGUE_HIGHLIGHTS: 'resume.work.validation.vagueHighlights'
};

/**
 * Interface pour une expérience professionnelle
 */
export interface WorkInterface {
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  summary: string;
  highlights?: string[];
  website?: string;
}

/**
 * Service de validation pour les expériences professionnelles
 */
export class WorkValidationService extends BaseValidationService<WorkInterface> {
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
   * Valide une expérience professionnelle complète
   * @param work Expérience professionnelle à valider
   * @returns Résultat de validation
   */
  public validate(work: WorkInterface): ResultType<WorkInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du champ company
    if (this.isEmpty(work.company)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_COMPANY,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_COMPANY),
        "company",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: WORK_VALIDATION_KEYS.MISSING_COMPANY
        }
      ));
    }
    
    // Validation du champ position
    if (this.isEmpty(work.position)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_POSITION,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_POSITION),
        "position",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: WORK_VALIDATION_KEYS.MISSING_POSITION
        }
      ));
    } else if (this.hasMinLength(work.position, 2) && work.position.length < 5) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.VAGUE_POSITION,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.VAGUE_POSITION),
        "position",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          i18nKey: WORK_VALIDATION_KEYS.VAGUE_POSITION,
          suggestion: "Utilisez un titre de poste précis qui reflète votre niveau de responsabilité"
        }
      ));
    }
    
    // Validation des dates avec le Value Object DateRange
    const dateRangeResult = DateRange.create(work.startDate, work.endDate, 'work', this.i18nAdapter);
    if (isFailure(dateRangeResult)) {
      errors.push(...dateRangeResult.error);
    }
    
    // Validation du résumé
    if (this.isEmpty(work.summary)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_SUMMARY,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_SUMMARY),
        "summary",
        ValidationLayerType.APPLICATION,
        "error",
        {
          i18nKey: WORK_VALIDATION_KEYS.MISSING_SUMMARY
        }
      ));
    } else if (work.summary.length < 100) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.BRIEF_DESCRIPTION,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION),
        "summary",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          i18nKey: WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION,
          suggestion: "Ajoutez plus de détails pour valoriser cette expérience (au moins 200 caractères recommandés)"
        }
      ));
    }
    
    // Validation des points forts (highlights)
    if (!work.highlights || work.highlights.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_HIGHLIGHTS,
        this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS),
        "highlights",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          i18nKey: WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
          suggestion: "Incluez 2-3 réalisations quantifiables pour valoriser cette expérience"
        }
      ));
    } else {
      const hasVagueHighlight = work.highlights.some(h => h.length < 30);
      if (hasVagueHighlight) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.WORK.VAGUE_HIGHLIGHTS,
          this.i18nAdapter.translate(WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS),
          "highlights",
          ValidationLayerType.PRESENTATION,
          "info",
          {
            i18nKey: WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS,
            suggestion: "Quantifiez vos réalisations (%, chiffres, impact) pour plus d'impact"
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
      // Note: Extension du pattern Result comme dans les Value Objects
      return {
        success: true,
        value: work,
        warnings: errors
      } as any;
    }
    
    return createSuccess(work);
  }
  
  /**
   * Valide un champ spécifique d'une expérience professionnelle
   * @param work Expérience professionnelle
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof WorkInterface>(
    work: WorkInterface, 
    fieldName: K
  ): ResultType<WorkInterface[K]> {
    const value = work[fieldName];
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'company':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_COMPANY,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_COMPANY),
            "company",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: WORK_VALIDATION_KEYS.MISSING_COMPANY
            }
          ));
        }
        break;
        
      case 'position':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_POSITION,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_POSITION),
            "position",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: WORK_VALIDATION_KEYS.MISSING_POSITION
            }
          ));
        } else if (this.hasMinLength(value as string, 2) && (value as string).length < 5) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.VAGUE_POSITION,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.VAGUE_POSITION),
            "position",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              i18nKey: WORK_VALIDATION_KEYS.VAGUE_POSITION,
              suggestion: "Utilisez un titre de poste précis qui reflète votre niveau de responsabilité"
            }
          ));
        }
        break;
        
      case 'startDate':
      case 'endDate':
        // Pour ces champs, on utilise directement le Value Object DateRange
        // On le fait ensemble car les dates sont liées
        const dateRangeResult = DateRange.create(
          work.startDate, 
          work.endDate, 
          'work',
          this.i18nAdapter
        );
        
        if (isFailure(dateRangeResult)) {
          // On filtre les erreurs pour ne garder que celles du champ spécifié
          const fieldErrors = dateRangeResult.error.filter(
            err => err.field === fieldName
          );
          
          if (fieldErrors.length > 0) {
            errors.push(...fieldErrors);
          }
        }
        break;
        
      case 'summary':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_SUMMARY,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_SUMMARY),
            "summary",
            ValidationLayerType.APPLICATION,
            "error",
            {
              i18nKey: WORK_VALIDATION_KEYS.MISSING_SUMMARY
            }
          ));
        } else if ((value as string).length < 100) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.BRIEF_DESCRIPTION,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION),
            "summary",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              i18nKey: WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION,
              suggestion: "Ajoutez plus de détails pour valoriser cette expérience (au moins 200 caractères recommandés)"
            }
          ));
        }
        break;
        
      case 'highlights':
        const highlights = value as string[] | undefined;
        if (!highlights || highlights.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_HIGHLIGHTS,
            this.i18nAdapter.translate(WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS),
            "highlights",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              i18nKey: WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
              suggestion: "Incluez 2-3 réalisations quantifiables pour valoriser cette expérience"
            }
          ));
        } else {
          const hasVagueHighlight = highlights.some(h => h.length < 30);
          if (hasVagueHighlight) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.WORK.VAGUE_HIGHLIGHTS,
              this.i18nAdapter.translate(WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS),
              "highlights",
              ValidationLayerType.PRESENTATION,
              "info",
              {
                i18nKey: WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS,
                suggestion: "Quantifiez vos réalisations (%, chiffres, impact) pour plus d'impact"
              }
            ));
          }
        }
        break;
    }
    
    if (errors.some(err => err.severity === 'error')) {
      return createFailure(errors);
    }
    
    if (errors.length > 0) {
      // Extension du pattern Result
      return {
        success: true,
        value: value as WorkInterface[K],
        warnings: errors
      } as any;
    }
    
    return createSuccess(value as WorkInterface[K]);
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