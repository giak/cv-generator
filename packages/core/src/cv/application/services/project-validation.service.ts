/**
 * Service de validation pour les projets
 */

import { 
  ResultType, 
  ValidationErrorInterface,
  ValidationLayerType, 
  createSuccess, 
  createFailure,
  isSuccess,
  isFailure,
  ERROR_CODES
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DateRange } from '../../domain/value-objects/date-range.value-object';

/**
 * Interface pour un projet
 */
export interface ProjectInterface {
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  url?: string;
  keywords?: string[];
  roles?: string[];
}

/**
 * Regex pour la validation des URLs
 */
const URL_REGEX = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Service de validation pour les projets
 */
export class ProjectValidationService extends BaseValidationService<ProjectInterface> {
  /**
   * Valide un projet complet
   * @param project Projet à valider
   * @returns Résultat de validation
   */
  public validate(project: ProjectInterface): ResultType<ProjectInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom du projet
    if (this.isEmpty(project.name)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
        "Le nom du projet est requis",
        "name",
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation de la description
    if (this.isEmpty(project.description)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
        "La description du projet est requise",
        "description",
        ValidationLayerType.DOMAIN
      ));
    } else if (project.description.length < 100) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
        "Description trop succincte",
        "description",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          suggestion: "Développez davantage la description de ce projet (min. 200 caractères recommandés)"
        }
      ));
    }
    
    // Validation des dates avec le Value Object DateRange
    const dateRangeResult = DateRange.create(project.startDate, project.endDate, 'work');
    if (isFailure(dateRangeResult)) {
      errors.push(...dateRangeResult.error);
    }
    
    // Validation des mots-clés (technologies)
    if (!project.keywords || project.keywords.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
        "Aucune technologie mentionnée",
        "keywords",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          suggestion: "Précisez les technologies, langages ou outils utilisés"
        }
      ));
    }
    
    // Validation de l'URL (si présente)
    if (project.url !== undefined) {
      if (this.isEmpty(project.url)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.PROJECT.MISSING_URL,
          "Lien vers le projet manquant",
          "url",
          ValidationLayerType.PRESENTATION,
          "info",
          {
            suggestion: "Ajoutez un lien pour que le recruteur puisse voir votre travail"
          }
        ));
      } else if (!URL_REGEX.test(project.url)) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.PROJECT.INVALID_URL,
          "Format d'URL invalide",
          "url",
          ValidationLayerType.DOMAIN,
          "warning",
          {
            suggestion: "Vérifiez que l'URL commence par http:// ou https://"
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
      // Extension du pattern Result comme dans les autres services
      return {
        success: true,
        value: project,
        warnings: errors
      } as any;
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
    const value = project[fieldName];
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME,
            "Le nom du projet est requis",
            "name",
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'description':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION,
            "La description du projet est requise",
            "description",
            ValidationLayerType.DOMAIN
          ));
        } else if ((value as string).length < 100) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION,
            "Description trop succincte",
            "description",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              suggestion: "Développez davantage la description de ce projet (min. 200 caractères recommandés)"
            }
          ));
        }
        break;
        
      case 'startDate':
      case 'endDate':
        // Pour ces champs, on utilise directement le Value Object DateRange
        const dateRangeResult = DateRange.create(
          project.startDate, 
          project.endDate, 
          'work'
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
        
      case 'keywords':
        const keywords = value as string[] | undefined;
        if (!keywords || keywords.length === 0) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.PROJECT.MISSING_KEYWORDS,
            "Aucune technologie mentionnée",
            "keywords",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              suggestion: "Précisez les technologies, langages ou outils utilisés"
            }
          ));
        }
        break;
        
      case 'url':
        const url = value as string | undefined;
        if (url !== undefined) {
          if (this.isEmpty(url)) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.PROJECT.MISSING_URL,
              "Lien vers le projet manquant",
              "url",
              ValidationLayerType.PRESENTATION,
              "info",
              {
                suggestion: "Ajoutez un lien pour que le recruteur puisse voir votre travail"
              }
            ));
          } else if (!URL_REGEX.test(url)) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.PROJECT.INVALID_URL,
              "Format d'URL invalide",
              "url",
              ValidationLayerType.DOMAIN,
              "warning",
              {
                suggestion: "Vérifiez que l'URL commence par http:// ou https://"
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
        value,
        warnings: errors
      } as any;
    }
    
    return createSuccess(value as ProjectInterface[K]);
  }
} 