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
  INVALID_DATE_FORMAT: 'resume.projects.validation.invalidDateFormat'
};

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

  /**
   * Valide un projet complet
   * @param project Projet à valider
   * @returns Résultat de validation
   */
  public validate(project: ProjectInterface): ResultType<ProjectInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom
    if (!project.name || project.name.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
        PROJECT_VALIDATION_KEYS.MISSING_NAME,
        'name',
        'error',
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation de la description
    if (!project.description || project.description.trim() === '') {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
        PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION,
        'description',
        'error',
        ValidationLayerType.DOMAIN
      ));
    } else if (project.description.length < 50) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
        PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION,
        'description',
        'warning',
        ValidationLayerType.APPLICATION,
        "Ajoutez plus de détails sur le projet, ses objectifs et votre contribution"
      ));
    }
    
    // Validation des rôles
    if (!project.roles || project.roles.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_ROLE,
        PROJECT_VALIDATION_KEYS.MISSING_ROLE,
        'roles',
        'warning',
        ValidationLayerType.APPLICATION,
        "Précisez votre rôle dans ce projet (ex: 'Développeur principal', 'Chef de projet')"
      ));
    }
    
    // Validation des points forts
    if (!project.highlights || project.highlights.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_HIGHLIGHTS,
        PROJECT_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
        'highlights',
        'warning',
        ValidationLayerType.APPLICATION,
        "Ajoutez des points forts pour mettre en valeur vos réalisations"
      ));
    }
    
    // Validation des mots-clés
    if (!project.keywords || project.keywords.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
        PROJECT_VALIDATION_KEYS.MISSING_KEYWORDS,
        'keywords',
        'info',
        ValidationLayerType.PRESENTATION,
        "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi"
      ));
    }
    
    // Validation de la date de début
    if (project.startDate !== undefined) {
      if (project.startDate.trim() === '') {
        errors.push(this.createError(
          ERROR_CODES.RESUME.PROJECT.MISSING_START_DATE,
          PROJECT_VALIDATION_KEYS.MISSING_START_DATE,
          'startDate',
          'warning',
          ValidationLayerType.APPLICATION
        ));
      } else if (!this.isValidDateFormat(project.startDate)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
          PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
          'startDate',
          'error',
          ValidationLayerType.DOMAIN,
          "Utilisez le format YYYY-MM-DD ou YYYY-MM"
        ));
      }
    }
    
    // Validation de la date de fin
    if (project.endDate !== undefined && project.endDate.trim() !== '' && !this.isValidDateFormat(project.endDate)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
        PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
        'endDate',
        'error',
        ValidationLayerType.DOMAIN,
        "Utilisez le format YYYY-MM-DD ou YYYY-MM"
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
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
            PROJECT_VALIDATION_KEYS.MISSING_NAME,
            'name',
            'error',
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'description':
        if (!project.description || project.description.trim() === '') {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
            PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION,
            'description',
            'error',
            ValidationLayerType.DOMAIN
          ));
        } else if (project.description.length < 50) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
            PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION,
            'description',
            'warning',
            ValidationLayerType.APPLICATION,
            "Ajoutez plus de détails sur le projet, ses objectifs et votre contribution"
          ));
        }
        break;
        
      case 'roles':
        if (!project.roles || project.roles.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_ROLE,
            PROJECT_VALIDATION_KEYS.MISSING_ROLE,
            'roles',
            'warning',
            ValidationLayerType.APPLICATION,
            "Précisez votre rôle dans ce projet (ex: 'Développeur principal', 'Chef de projet')"
          ));
        }
        break;
        
      case 'highlights':
        if (!project.highlights || project.highlights.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_HIGHLIGHTS,
            PROJECT_VALIDATION_KEYS.MISSING_HIGHLIGHTS,
            'highlights',
            'warning',
            ValidationLayerType.APPLICATION,
            "Ajoutez des points forts pour mettre en valeur vos réalisations"
          ));
        }
        break;
        
      case 'keywords':
        if (!project.keywords || project.keywords.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
            PROJECT_VALIDATION_KEYS.MISSING_KEYWORDS,
            'keywords',
            'info',
            ValidationLayerType.PRESENTATION,
            "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi"
          ));
        }
        break;
        
      case 'startDate':
        if (project.startDate !== undefined) {
          if (project.startDate.trim() === '') {
            errors.push(this.createError(
              ERROR_CODES.RESUME.PROJECT.MISSING_START_DATE,
              PROJECT_VALIDATION_KEYS.MISSING_START_DATE,
              'startDate',
              'warning',
              ValidationLayerType.APPLICATION
            ));
          } else if (!this.isValidDateFormat(project.startDate)) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
              PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
              'startDate',
              'error',
              ValidationLayerType.DOMAIN,
              "Utilisez le format YYYY-MM-DD ou YYYY-MM"
            ));
          }
        }
        break;
        
      case 'endDate':
        if (project.endDate !== undefined && project.endDate.trim() !== '' && !this.isValidDateFormat(project.endDate)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT,
            PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT,
            'endDate',
            'error',
            ValidationLayerType.DOMAIN,
            "Utilisez le format YYYY-MM-DD ou YYYY-MM"
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
   * Crée une erreur de validation avec les paramètres spécifiés
   * @param code Code d'erreur
   * @param i18nKey Clé de traduction
   * @param field Champ concerné
   * @param severity Sévérité de l'erreur
   * @param layer Couche de validation
   * @param suggestion Suggestion optionnelle
   * @returns Erreur de validation
   */
  private createError(
    code: string,
    i18nKey: string,
    field: string,
    severity: 'error' | 'warning' | 'info',
    layer: ValidationLayerType,
    suggestion?: string
  ): ValidationErrorInterface {
    return {
      code,
      message: this.i18nAdapter.translate(i18nKey),
      field,
      i18nKey,
      severity,
      layer,
      suggestion
    };
  }

  /**
   * Vérifie si une date est au format valide (YYYY-MM-DD ou YYYY-MM)
   * @param date Date à vérifier
   * @returns True si le format est valide
   */
  private isValidDateFormat(date: string): boolean {
    // Format YYYY-MM-DD
    const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Format YYYY-MM
    const yearMonthRegex = /^\d{4}-\d{2}$/;
    
    return fullDateRegex.test(date) || yearMonthRegex.test(date);
  }
} 