/**
 * Service de validation pour les formations (éducation)
 */

import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  createSuccessWithWarnings,
  isFailure,
  getErrors,
  ERROR_CODES,
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DateRange } from '../../domain/value-objects/date-range.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Export validation keys for the education validation service
export const EDUCATION_VALIDATION_KEYS = {
  MISSING_INSTITUTION: 'resume.education.validation.missingInstitution',
  MISSING_AREA: 'resume.education.validation.missingArea',
  MISSING_STUDY_TYPE: 'resume.education.validation.missingStudyType',
  MISSING_GPA: 'resume.education.validation.missingGpa',
  VAGUE_COURSES: 'resume.education.validation.vagueCourses'
};

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
        this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION),
        "institution",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION
        }
      ));
    }
    
    // Validation du domaine d'études
    if (this.isEmpty(education.area)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_AREA,
        this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_AREA),
        "area",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_AREA
        }
      ));
    }
    
    // Validation du type d'études
    if (this.isEmpty(education.studyType)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_STUDY_TYPE,
        this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE),
        "studyType",
        ValidationLayerType.DOMAIN,
        "error",
        {
          i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE
        }
      ));
    }
    
    // Validation des dates avec le Value Object DateRange
    const dateRangeResult = DateRange.create(
      education.startDate, 
      education.endDate, 
      'education',
      this.i18nAdapter
    );
    
    if (isFailure(dateRangeResult)) {
      errors.push(...getErrors(dateRangeResult));
    }
    
    // Validation du GPA/mention (non obligatoire mais conseillé)
    if (!this.isDefined(education.gpa)) {
      errors.push(this.createError(
        ERROR_CODES.RESUME.EDUCATION.MISSING_GPA,
        this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_GPA),
        "gpa",
        ValidationLayerType.APPLICATION,
        "info",
        {
          i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_GPA,
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
          this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.VAGUE_COURSES),
          "courses",
          ValidationLayerType.PRESENTATION,
          "info",
          {
            i18nKey: EDUCATION_VALIDATION_KEYS.VAGUE_COURSES,
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
      // Utilisation du pattern Result standardisé
      return createSuccessWithWarnings(education, errors);
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
            this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION),
            "institution",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION
            }
          ));
        }
        break;
        
      case 'area':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_AREA,
            this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_AREA),
            "area",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_AREA
            }
          ));
        }
        break;
        
      case 'studyType':
        if (this.isEmpty(value as string)) {
          errors.push(this.createError(
            ERROR_CODES.RESUME.EDUCATION.MISSING_STUDY_TYPE,
            this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE),
            "studyType",
            ValidationLayerType.DOMAIN,
            "error",
            {
              i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE
            }
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
          'education',
          this.i18nAdapter
        );
        
        if (isFailure(dateRangeResult)) {
          // On filtre les erreurs pour ne garder que celles du champ spécifié
          const fieldErrors = getErrors(dateRangeResult).filter(
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
            this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.MISSING_GPA),
            "gpa",
            ValidationLayerType.APPLICATION,
            "info",
            {
              i18nKey: EDUCATION_VALIDATION_KEYS.MISSING_GPA,
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
              this.i18nAdapter.translate(EDUCATION_VALIDATION_KEYS.VAGUE_COURSES),
              "courses",
              ValidationLayerType.PRESENTATION,
              "info",
              {
                i18nKey: EDUCATION_VALIDATION_KEYS.VAGUE_COURSES,
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
      return createSuccessWithWarnings(value as EducationInterface[K], errors);
    }
    
    return createSuccess(value as EducationInterface[K]);
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