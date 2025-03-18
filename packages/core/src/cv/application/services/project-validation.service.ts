/**
 * Service de validation pour les projets
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
 * Export validation keys for the project validation service
 */
export const PROJECT_VALIDATION_KEYS = {
  MISSING_NAME: 'resume.projects.validation.missingName',
  MISSING_DESCRIPTION: 'resume.projects.validation.missingDescription',
  VAGUE_DESCRIPTION: 'resume.projects.validation.vagueDescription',
  MISSING_ROLE: 'resume.projects.validation.missingRole',
  MISSING_HIGHLIGHTS: 'resume.projects.validation.missingHighlights',
  MISSING_KEYWORDS: 'resume.projects.validation.missingKeywords',
  MISSING_START_DATE: 'resume.projects.validation.missingStartDate',
  INVALID_DATE_FORMAT: 'resume.projects.validation.invalidDateFormat',
  MISSING_URL: 'resume.projects.validation.missingUrl',
  INVALID_URL: 'resume.projects.validation.invalidUrl'
} as const;

/**
 * Interface pour un projet
 */
export interface ProjectInterface {
  name: string;
  description: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}


/**
 * Service de validation pour les projets
 */
export class ProjectValidationService extends BaseValidationService<ProjectInterface> {
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

  /**
   * Valide un projet complet
   * @param project Projet à valider
   * @returns Résultat de validation
   */
  public validate(project: ProjectInterface): ResultType<ProjectInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom (erreur critique)
    if (!project.name || project.name.trim() === '') {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
        PROJECT_VALIDATION_KEYS.MISSING_NAME,
        'name',
        ValidationLayerType.DOMAIN,
        'error'
      ));
    }
    
    // Validation de la description (erreur critique)
    if (!project.description || project.description.trim() === '') {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
        PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION,
        'description',
        ValidationLayerType.DOMAIN,
        'error'
      ));
    }
    
    // Validation des dates (erreur critique)
    if (project.startDate !== undefined) {
      if (project.startDate.trim() === '') {
        errors.push(this.createValidationError(
          ERROR_CODES.RESUME.PROJECT.MISSING_START_DATE,
          PROJECT_VALIDATION_KEYS.MISSING_START_DATE,
          'startDate',
          ValidationLayerType.APPLICATION,
          'warning'
        ));
      } else if (!this.isValidDateFormat(project.startDate)) {
        errors.push(this.createValidationError(
          ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
          PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
          'startDate',
          ValidationLayerType.DOMAIN,
          'error',
          { suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM" }
        ));
      }
    }
    
    if (project.endDate !== undefined && project.endDate.trim() !== '' && !this.isValidDateFormat(project.endDate)) {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
        PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
        'endDate',
        ValidationLayerType.DOMAIN,
        'error',
        { suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM" }
      ));
    }
    
    // Validation de la description (warning)
    if (project.description && project.description.length < 50) {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
        PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION,
        'description',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Ajoutez plus de détails sur le projet, ses objectifs et votre contribution" }
      ));
    }
    
    // Validation des rôles (warning)
    if (!project.roles || project.roles.length === 0) {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.MISSING_ROLE,
        PROJECT_VALIDATION_KEYS.MISSING_ROLE,
        'roles',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Précisez votre rôle dans ce projet (ex: 'Développeur principal', 'Chef de projet')" }
      ));
    }
    
    // Validation des points forts (warning)
    if (!project.highlights || project.highlights.length === 0) {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.MISSING_HIGHLIGHTS,
        PROJECT_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
        'highlights',
        ValidationLayerType.APPLICATION,
        'warning',
        { suggestion: "Ajoutez des points forts pour mettre en valeur vos réalisations" }
      ));
    }
    
    // Validation des mots-clés (info)
    if (!project.keywords || project.keywords.length === 0) {
      errors.push(this.createValidationError(
        ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
        PROJECT_VALIDATION_KEYS.MISSING_KEYWORDS,
        'keywords',
        ValidationLayerType.PRESENTATION,
        'info',
        { suggestion: "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi" }
      ));
    }
    
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    return createSuccess(project);
  }
  
  /**
   * Valide un champ spécifique d'un projet
   * @param project Projet
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof ProjectInterface>(
    project: ProjectInterface, 
    fieldName: K
  ): ResultType<ProjectInterface[K]> {
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!project.name || project.name.trim() === '') {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
            PROJECT_VALIDATION_KEYS.MISSING_NAME,
            'name',
            ValidationLayerType.DOMAIN,
            'error'
          ));
        }
        break;
        
      case 'description':
        if (!project.description || project.description.trim() === '') {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
            PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION,
            'description',
            ValidationLayerType.DOMAIN,
            'error'
          ));
        } else if (project.description.length < 50) {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
            PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION,
            'description',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Ajoutez plus de détails sur le projet, ses objectifs et votre contribution" }
          ));
        }
        break;
        
      case 'roles':
        if (!project.roles || project.roles.length === 0) {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.MISSING_ROLE,
            PROJECT_VALIDATION_KEYS.MISSING_ROLE,
            'roles',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Précisez votre rôle dans ce projet (ex: 'Développeur principal', 'Chef de projet')" }
          ));
        }
        break;
        
      case 'highlights':
        if (!project.highlights || project.highlights.length === 0) {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.MISSING_HIGHLIGHTS,
            PROJECT_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
            'highlights',
            ValidationLayerType.APPLICATION,
            'warning',
            { suggestion: "Ajoutez des points forts pour mettre en valeur vos réalisations" }
          ));
        }
        break;
        
      case 'keywords':
        if (!project.keywords || project.keywords.length === 0) {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
            PROJECT_VALIDATION_KEYS.MISSING_KEYWORDS,
            'keywords',
            ValidationLayerType.PRESENTATION,
            'info',
            { suggestion: "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi" }
          ));
        }
        break;
        
      case 'startDate':
        if (project.startDate !== undefined) {
          if (project.startDate.trim() === '') {
            errors.push(this.createValidationError(
              ERROR_CODES.RESUME.PROJECT.MISSING_START_DATE,
              PROJECT_VALIDATION_KEYS.MISSING_START_DATE,
              'startDate',
              ValidationLayerType.APPLICATION,
              'warning'
            ));
          } else if (!this.isValidDateFormat(project.startDate)) {
            errors.push(this.createValidationError(
              ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
              PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
              'startDate',
              ValidationLayerType.DOMAIN,
              'error',
              { suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM" }
            ));
          }
        }
        break;
        
      case 'endDate':
        if (project.endDate !== undefined && project.endDate.trim() !== '' && !this.isValidDateFormat(project.endDate)) {
          errors.push(this.createValidationError(
            ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
            PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
            'endDate',
            ValidationLayerType.DOMAIN,
            'error',
            { suggestion: "Utilisez le format YYYY-MM-DD ou YYYY-MM" }
          ));
        }
        break;
    }
    
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    return createSuccess(project[fieldName]);
  }

  /**
   * Vérifie si une date est au format valide (YYYY-MM-DD ou YYYY-MM)
   * @param date Date à vérifier
   * @returns True si le format est valide
   */
  private isValidDateFormat(date: string): boolean {
    // Accepte les formats YYYY-MM-DD et YYYY-MM
    return /^\d{4}-\d{2}(-\d{2})?$/.test(date);
  }
} 