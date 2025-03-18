/**
 * Service de validation pour les expériences professionnelles
 */

import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createSuccessWithWarnings,
  createFailure,
  isFailure
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DateRange } from '../../domain/value-objects/date-range.value-object';
import { type DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Export validation keys for the work validation service
export const WORK_VALIDATION_KEYS = {
  MISSING_COMPANY: 'work.validation.missing_company',
  MISSING_POSITION: 'work.validation.missing_position',
  VAGUE_POSITION: 'work.validation.vague_position',
  MISSING_SUMMARY: 'work.validation.missing_summary',
  BRIEF_DESCRIPTION: 'work.validation.brief_description',
  MISSING_HIGHLIGHTS: 'work.validation.missing_highlights',
  VAGUE_HIGHLIGHTS: 'work.validation.vague_highlights'
} as const;

/**
 * Interface pour une expérience professionnelle
 */
export interface WorkInterface {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
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
    const warnings: ValidationErrorInterface[] = [];
    
    // Validation du nom de l'entreprise (erreur critique)
    if (!work.company || work.company.trim() === '') {
      errors.push(this.createValidationError(
        'MISSING_COMPANY',
        WORK_VALIDATION_KEYS.MISSING_COMPANY,
        'company',
        ValidationLayerType.DOMAIN,
        'error'
      ));
    }
    
    // Validation du poste (erreur critique)
    if (!work.position || work.position.trim() === '') {
      errors.push(this.createValidationError(
        'MISSING_POSITION',
        WORK_VALIDATION_KEYS.MISSING_POSITION,
        'position',
        ValidationLayerType.DOMAIN,
        'error'
      ));
    } else if (work.position.length < 5) {
      warnings.push(this.createValidationError(
        'VAGUE_POSITION',
        WORK_VALIDATION_KEYS.VAGUE_POSITION,
        'position',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Utilisez un titre de poste plus descriptif" }
      ));
    }
    
    // Validation des dates
    if (work.startDate || work.endDate) {
      const dateRangeResult = DateRange.create(
        work.startDate || '',
        work.endDate || '',
        'work',
        this.i18nAdapter
      );
      
      if (isFailure(dateRangeResult)) {
        errors.push(...dateRangeResult.error);
      }
    }
    
    // Validation de la description (warning)
    if (!work.summary || work.summary.trim() === '') {
      errors.push(this.createValidationError(
        'MISSING_SUMMARY',
        WORK_VALIDATION_KEYS.MISSING_SUMMARY,
        'summary',
        ValidationLayerType.DOMAIN,
        'error'
      ));
    } else if (work.summary.length < 50) {
      warnings.push(this.createValidationError(
        'BRIEF_DESCRIPTION',
        WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION,
        'summary',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Ajoutez plus de détails sur vos responsabilités et réalisations" }
      ));
    }
    
    // Validation des points forts (warning)
    if (!work.highlights || work.highlights.length === 0) {
      warnings.push(this.createValidationError(
        'MISSING_HIGHLIGHTS',
        WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
        'highlights',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Ajoutez des points forts pour mettre en valeur vos réalisations" }
      ));
    } else {
      const vagueHighlights = work.highlights.filter(h => h.length < 20);
      if (vagueHighlights.length > 0) {
        warnings.push(this.createValidationError(
          'VAGUE_HIGHLIGHTS',
          WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS,
          'highlights',
          ValidationLayerType.APPLICATION,
          'warning',
          { suggestion: "Détaillez davantage vos réalisations" }
        ));
      }
    }
    
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    return warnings.length > 0 ? createSuccessWithWarnings(work, warnings) : createSuccess(work);
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
    const warnings: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'company':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(this.createValidationError(
            'MISSING_COMPANY',
            WORK_VALIDATION_KEYS.MISSING_COMPANY,
            'company',
            ValidationLayerType.DOMAIN,
            'error'
          ));
        }
        break;
        
      case 'position':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(this.createValidationError(
            'MISSING_POSITION',
            WORK_VALIDATION_KEYS.MISSING_POSITION,
            'position',
            ValidationLayerType.DOMAIN,
            'error'
          ));
        } else if (typeof value === 'string' && value.length < 5) {
          warnings.push(this.createValidationError(
            'VAGUE_POSITION',
            WORK_VALIDATION_KEYS.VAGUE_POSITION,
            'position',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Utilisez un titre de poste plus descriptif" }
          ));
        }
        break;
        
      case 'startDate':
      case 'endDate':
        const dateRangeResult = DateRange.create(
          work.startDate || '',
          work.endDate || '',
          'work',
          this.i18nAdapter
        );
        
        if (isFailure(dateRangeResult)) {
          errors.push(...dateRangeResult.error.filter(e => e.field === fieldName));
        }
        break;
        
      case 'summary':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(this.createValidationError(
            'MISSING_SUMMARY',
            WORK_VALIDATION_KEYS.MISSING_SUMMARY,
            'summary',
            ValidationLayerType.DOMAIN,
            'error'
          ));
        } else if (typeof value === 'string' && value.length < 50) {
          warnings.push(this.createValidationError(
            'BRIEF_DESCRIPTION',
            WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION,
            'summary',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Ajoutez plus de détails sur vos responsabilités et réalisations" }
          ));
        }
        break;
        
      case 'highlights':
        const highlights = value as string[] | undefined;
        if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
          warnings.push(this.createValidationError(
            'MISSING_HIGHLIGHTS',
            WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
            'highlights',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Ajoutez des points forts pour mettre en valeur vos réalisations" }
          ));
        } else {
          const vagueHighlights = highlights.filter(h => h.length < 20);
          if (vagueHighlights.length > 0) {
            warnings.push(this.createValidationError(
              'VAGUE_HIGHLIGHTS',
              WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS,
              'highlights',
              ValidationLayerType.APPLICATION,
              'warning',
              { suggestion: "Détaillez davantage vos réalisations" }
            ));
          }
        }
        break;
    }
    
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    return warnings.length > 0 ? createSuccessWithWarnings(value as WorkInterface[K], warnings) : createSuccess(value as WorkInterface[K]);
  }
  
  /**
   * Helper pour créer une erreur i18n avec tous les champs nécessaires
   */
  protected createValidationError(
    code: string,
    i18nKey: string,
    field: string,
    layer: ValidationLayerType,
    severity: 'error' | 'warning' | 'info' = 'error',
    options?: {
      suggestion?: string;
      additionalInfo?: Record<string, unknown>;
    }
  ): ValidationErrorInterface {
    return {
      code,
      message: this.i18nAdapter.translate(i18nKey),
      field,
      layer,
      severity,
      i18nKey,
      ...options
    };
  }
} 