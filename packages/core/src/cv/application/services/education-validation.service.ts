/**
 * Service de validation pour les formations (éducation)
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
 * Interface pour une formation
 */
export interface EducationInterface {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string | null;
  gpa?: string;
  courses?: string[];
}

/**
 * Service de validation pour les formations
 */
export class EducationValidationService extends BaseValidationService<EducationInterface> {
  /**
   * Valide une formation complète
   * @param education Formation à valider
   * @returns Résultat de validation
   */
  public validate(education: EducationInterface): ResultType<EducationInterface> {
    const errors: ValidationErrorInterface[] = [];
    
    // Validation du nom de l'établissement
    if (this.isEmpty(education.institution)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_INSTITUTION,
        "Le nom de l'établissement est requis",
        "institution",
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation du domaine d'études
    if (this.isEmpty(education.area)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_AREA,
        "Le domaine d'études est requis",
        "area",
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation du type d'études
    if (this.isEmpty(education.studyType)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_STUDY_TYPE,
        "Le type de diplôme est requis",
        "studyType",
        ValidationLayerType.DOMAIN
      ));
    }
    
    // Validation des dates avec le Value Object DateRange
    const dateRangeResult = DateRange.create(
      education.startDate, 
      education.endDate, 
      'education'
    );
    
    if (isFailure(dateRangeResult)) {
      errors.push(...dateRangeResult.error);
    }
    
    // Validation du GPA/mention (non obligatoire mais conseillé)
    if (!this.isDefined(education.gpa)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_GPA,
        "GPA ou mention non spécifiée",
        "gpa",
        ValidationLayerType.APPLICATION,
        "info",
        {
          suggestion: "Ajoutez votre GPA ou mention pour valoriser vos résultats académiques"
        }
      ));
    }
    
    // Validation des cours (non obligatoire mais conseillé d'être précis)
    if (education.courses && education.courses.length > 0) {
      const hasVagueCourses = education.courses.some(
        course => course.length < 3 || /^(course|projet|module) \d+$/i.test(course)
      );
      
      if (hasVagueCourses) {
        errors.push(this.createError(
          ERROR_CODES.RESUME.EDUCATION.VAGUE_COURSES,
          "Liste de cours trop vague",
          "courses",
          ValidationLayerType.PRESENTATION,
          "info",
          {
            suggestion: "Citez les cours les plus pertinents pour le poste visé"
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
        value: education,
        warnings: errors
      } as any;
    }
    
    return createSuccess(education);
  }
  
  /**
   * Valide un champ spécifique d'une formation
   * @param education Formation
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof EducationInterface>(
    education: EducationInterface, 
    fieldName: K
  ): ResultType<EducationInterface[K]> {
    const value = education[fieldName];
    const errors: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'institution':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_INSTITUTION,
            "Le nom de l'établissement est requis",
            "institution",
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'area':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_AREA,
            "Le domaine d'études est requis",
            "area",
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'studyType':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_STUDY_TYPE,
            "Le type de diplôme est requis",
            "studyType",
            ValidationLayerType.DOMAIN
          ));
        }
        break;
        
      case 'startDate':
      case 'endDate':
        // Pour ces champs, on utilise directement le Value Object DateRange
        // On le fait ensemble car les dates sont liées
        const dateRangeResult = DateRange.create(
          education.startDate, 
          education.endDate, 
          'education'
        );
        
        if (isFailure(dateRangeResult)) {
          // On filtre les erreurs pour ne garder que celles du champ spécifié
          const fieldErrors = dateRangeResult.error.filter(
            err => err.field === fieldName
          );
          
          if (fieldErrors.length > 0) {
            errors.push(...fieldErrors);
          } else {
            // Si l'erreur concerne l'autre champ de date, on retourne un succès pour ce champ
            return createSuccess(value as EducationInterface[K]);
          }
        }
        break;
        
      case 'gpa':
        if (!this.isDefined(value)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_GPA,
            "GPA ou mention non spécifiée",
            "gpa",
            ValidationLayerType.APPLICATION,
            "info",
            {
              suggestion: "Ajoutez votre GPA ou mention pour valoriser vos résultats académiques"
            }
          ));
        }
        break;
        
      case 'courses':
        const courses = value as string[] | undefined;
        if (courses && courses.length > 0) {
          const hasVagueCourses = courses.some(
            course => course.length < 3 || /^(course|projet|module) \d+$/i.test(course)
          );
          
          if (hasVagueCourses) {
            errors.push(this.createError(
              ERROR_CODES.RESUME.EDUCATION.VAGUE_COURSES,
              "Liste de cours trop vague",
              "courses",
              ValidationLayerType.PRESENTATION,
              "info",
              {
                suggestion: "Citez les cours les plus pertinents pour le poste visé"
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
        value: value as EducationInterface[K],
        warnings: errors
      } as any;
    }
    
    return createSuccess(value as EducationInterface[K]);
  }
} 