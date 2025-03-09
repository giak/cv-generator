/**
 * Service de validation pour les expériences professionnelles
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
        "Le nom de l'entreprise est requis",
        "company",
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation du champ position
    if (this.isEmpty(work.position)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_POSITION,
        "L'intitulé du poste est requis",
        "position",
        ValidationLayerType.DOMAIN
      ));
    } else if (this.hasMinLength(work.position, 2) && work.position.length < 5) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.VAGUE_POSITION,
        "L'intitulé du poste est trop vague",
        "position",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          suggestion: "Utilisez un titre de poste précis qui reflète votre niveau de responsabilité"
        }
      ));
    }
    
    // Validation des dates avec le Value Object DateRange
    const dateRangeResult = DateRange.create(work.startDate, work.endDate, 'work');
    if (isFailure(dateRangeResult)) {
      errors.push(...dateRangeResult.error);
    }
    
    // Validation du résumé
    if (this.isEmpty(work.summary)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_SUMMARY,
        "La description du poste est requise",
        "summary",
        ValidationLayerType.APPLICATION
      ));
    } else if (work.summary.length < 100) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.BRIEF_DESCRIPTION,
        "Description trop succincte",
        "summary",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          suggestion: "Ajoutez plus de détails pour valoriser cette expérience (au moins 200 caractères recommandés)"
        }
      ));
    }
    
    // Validation des points forts (highlights)
    if (!work.highlights || work.highlights.length === 0) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.WORK.MISSING_HIGHLIGHTS,
        "Aucune réalisation notable mentionnée",
        "highlights",
        ValidationLayerType.APPLICATION,
        "warning",
        {
          suggestion: "Incluez 2-3 réalisations quantifiables pour valoriser cette expérience"
        }
      ));
    } else {
      const hasVagueHighlight = work.highlights.some(h => h.length < 30);
      if (hasVagueHighlight) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.WORK.VAGUE_HIGHLIGHTS,
          "Réalisations peu précises",
          "highlights",
          ValidationLayerType.PRESENTATION,
          "info",
          {
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
            "Le nom de l'entreprise est requis",
            "company",
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'position':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_POSITION,
            "L'intitulé du poste est requis",
            "position",
            ValidationLayerType.DOMAIN
          ));
        } else if (this.hasMinLength(value as string, 2) && (value as string).length < 5) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.VAGUE_POSITION,
            "L'intitulé du poste est trop vague",
            "position",
            ValidationLayerType.APPLICATION,
            "warning",
            {
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
        
      case 'summary':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.MISSING_SUMMARY,
            "La description du poste est requise",
            "summary",
            ValidationLayerType.APPLICATION
          ));
        } else if ((value as string).length < 100) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.WORK.BRIEF_DESCRIPTION,
            "Description trop succincte",
            "summary",
            ValidationLayerType.APPLICATION,
            "warning",
            {
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
            "Aucune réalisation notable mentionnée",
            "highlights",
            ValidationLayerType.APPLICATION,
            "warning",
            {
              suggestion: "Incluez 2-3 réalisations quantifiables pour valoriser cette expérience"
            }
          ));
        } else {
          const hasVagueHighlight = highlights.some(h => h.length < 30);
          if (hasVagueHighlight) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.WORK.VAGUE_HIGHLIGHTS,
              "Réalisations peu précises",
              "highlights",
              ValidationLayerType.PRESENTATION,
              "info",
              {
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
        value,
        warnings: errors
      } as any;
    }
    
    return createSuccess(value as WorkInterface[K]);
  }
} 