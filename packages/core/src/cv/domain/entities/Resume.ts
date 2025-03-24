import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface';
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type';
import {
    ResultTypeInterface,
    ValidationErrorInterface,
    ValidationLayerType,
    ERROR_CODES,
    TRANSLATION_KEYS,
    Success,
    Failure
} from '@cv-generator/shared';
import { Email } from '../value-objects/email.value-object';
import { Phone } from '../value-objects/phone.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

/**
 * Type standard pour les résultats de l'entité Resume
 * Conforme au pattern ResultTypeInterface standardisé
 */
export type ResumeResultType = ResultTypeInterface<ResumeInterface> & { 
  entity?: Resume 
};

/**
 * Classes d'implémentation pour ResumeResultType
 */
export class ResumeSuccess extends Success<ResumeInterface> implements ResumeResultType {
  public readonly entity: Resume;
  
  constructor(resume: Resume) {
    super(resume.toJSON());
    this.entity = resume;
  }
}

export class ResumeFailure extends Failure<ResumeInterface> implements ResumeResultType {
  public readonly entity?: undefined;
  
  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}

/**
 * Clés de traduction spécifiques pour l'entité Resume
 */
export const RESUME_VALIDATION_KEYS = {
  // Basics
  MISSING_BASICS: 'resume.basics.validation.missingBasics', // Clé personnalisée
  MISSING_NAME: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_NAME,
  
  // Common
  INVALID_DATE_FORMAT: TRANSLATION_KEYS.COMMON.VALIDATION.INVALID_DATE_FORMAT,
  
  // Work
  INVALID_WORK_DATE: 'resume.work.validation.invalidDate', // Clé personnalisée pour les indices
  INVALID_WORK_END_DATE: 'resume.work.validation.invalidEndDate', // Clé personnalisée pour les indices
  
  // Volunteer
  INVALID_VOLUNTEER_DATE: 'resume.volunteer.validation.invalidDate', // Clé personnalisée pour les indices
  INVALID_VOLUNTEER_END_DATE: 'resume.volunteer.validation.invalidEndDate', // Clé personnalisée pour les indices
  
  // Education
  INVALID_EDUCATION_DATE: 'resume.education.validation.invalidDate', // Clé personnalisée pour les indices
  INVALID_EDUCATION_END_DATE: 'resume.education.validation.invalidEndDate', // Clé personnalisée pour les indices
  
  // Awards, Certificates, Publications
  INVALID_AWARD_DATE: TRANSLATION_KEYS.RESUME.AWARDS.VALIDATION.INVALID_DATE,
  INVALID_CERTIFICATE_DATE: TRANSLATION_KEYS.RESUME.CERTIFICATES.VALIDATION.INVALID_DATE,
  INVALID_PUBLICATION_DATE: TRANSLATION_KEYS.RESUME.PUBLICATIONS.VALIDATION.INVALID_DATE,
  
  // Projects
  INVALID_PROJECT_START_DATE: 'resume.projects.validation.invalidStartDate', // Clé personnalisée pour les indices
  INVALID_PROJECT_END_DATE: 'resume.projects.validation.invalidEndDate' // Clé personnalisée pour les indices
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 */
export class DefaultResumeI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, params?: Record<string, unknown>): string {
    const index = params?.index as number;
    const defaultMessages: Record<string, string> = {
      [RESUME_VALIDATION_KEYS.MISSING_BASICS]: 'Informations de base requises',
      [RESUME_VALIDATION_KEYS.MISSING_NAME]: 'Le nom est requis',
      [RESUME_VALIDATION_KEYS.INVALID_DATE_FORMAT]: 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_WORK_DATE]: index !== undefined ? 
        `Format de date invalide pour l'expérience ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_WORK_END_DATE]: index !== undefined ? 
        `Format de date de fin invalide pour l'expérience ${index + 1}` : 'Format de date de fin invalide',
      [RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_DATE]: index !== undefined ? 
        `Format de date invalide pour l'activité bénévole ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_END_DATE]: index !== undefined ? 
        `Format de date de fin invalide pour l'activité bénévole ${index + 1}` : 'Format de date de fin invalide',
      [RESUME_VALIDATION_KEYS.INVALID_EDUCATION_DATE]: index !== undefined ? 
        `Format de date invalide pour l'éducation ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_EDUCATION_END_DATE]: index !== undefined ? 
        `Format de date de fin invalide pour l'éducation ${index + 1}` : 'Format de date de fin invalide',
      [RESUME_VALIDATION_KEYS.INVALID_AWARD_DATE]: index !== undefined ? 
        `Format de date invalide pour la distinction ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_CERTIFICATE_DATE]: index !== undefined ? 
        `Format de date invalide pour le certificat ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_PUBLICATION_DATE]: index !== undefined ? 
        `Format de date invalide pour la publication ${index + 1}` : 'Format de date invalide',
      [RESUME_VALIDATION_KEYS.INVALID_PROJECT_START_DATE]: index !== undefined ? 
        `Format de date de début invalide pour le projet ${index + 1}` : 'Format de date de début invalide',
      [RESUME_VALIDATION_KEYS.INVALID_PROJECT_END_DATE]: index !== undefined ? 
        `Format de date de fin invalide pour le projet ${index + 1}` : 'Format de date de fin invalide'
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true;
  }
}

// Création d'une instance de l'adaptateur par défaut
const defaultI18nAdapter = new DefaultResumeI18nAdapter();

/**
 * Resume entity representing a CV in JSON Resume format
 * Implements the JSON Resume schema: https://jsonresume.org/schema/
 */
export class Resume {
  private constructor(
    private readonly data: ResumeInterface,
    private readonly _i18n: DomainI18nPortInterface
  ) {}

  /**
   * Méthode factory pour créer une instance validée de Resume avec le pattern ResultType standardisé
   * @param data Les données brutes du CV
   * @param i18n Interface pour l'internationalisation des messages
   * @returns ResultTypeInterface contenant soit les données de Resume en cas de succès, soit les erreurs
   */
  static createWithResultType(
    data: Partial<ResumeInterface>,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResumeResultType {
    const errors: ValidationErrorInterface[] = [];
    
    // 1. Validation basique des données essentielles
    if (!data.basics) {
      errors.push({
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: i18n.translate(RESUME_VALIDATION_KEYS.MISSING_BASICS),
        i18nKey: RESUME_VALIDATION_KEYS.MISSING_BASICS,
        field: "basics",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez fournir les informations de base du CV"
      });
      
      return new ResumeFailure(errors);
    }
    
    // 2. Validation du nom (requis)
    if (!data.basics.name || data.basics.name.trim().length === 0) {
      errors.push({
        code: ERROR_CODES.RESUME.BASICS.MISSING_NAME,
        message: i18n.translate(RESUME_VALIDATION_KEYS.MISSING_NAME),
        i18nKey: RESUME_VALIDATION_KEYS.MISSING_NAME,
        field: "basics.name",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez fournir un nom"
      });
    }
    
    // 3. Validation de l'email avec le value object Email
    if (data.basics?.email) {
      const emailResult = Email.create(data.basics.email);
      if (emailResult.isFailure()) {
        errors.push(...emailResult.getErrors().map(err => ({
          ...err,
          field: "basics.email"
        })));
      }
    }
    
    // 4. Validation du téléphone si fourni
    if (data.basics.phone) {
      const phoneResult = Phone.createWithResultType(data.basics.phone);
      if (phoneResult.isFailure()) {
        errors.push(...phoneResult.getErrors().map(err => ({
          ...err,
          field: "basics.phone"
        })));
      }
    }
    
    // 5. Validation des dates dans les expériences professionnelles
    if (data.work && data.work.length > 0) {
      data.work.forEach((work, index) => {
        if (!this.isValidDate(work.startDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_WORK_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_WORK_DATE,
            field: `work[${index}].startDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
        
        if (work.endDate && !this.isValidDate(work.endDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_WORK_END_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_WORK_END_DATE,
            field: `work[${index}].endDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }

    // 6. Validation des dates dans les activités bénévoles
    if (data.volunteer && data.volunteer.length > 0) {
      data.volunteer.forEach((vol, index) => {
        if (!this.isValidDate(vol.startDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_DATE,
            field: `volunteer[${index}].startDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
        
        if (vol.endDate && !this.isValidDate(vol.endDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_END_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_END_DATE,
            field: `volunteer[${index}].endDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }

    // 7. Validation des dates dans l'éducation
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu, index) => {
        if (!this.isValidDate(edu.startDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_EDUCATION_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_EDUCATION_DATE,
            field: `education[${index}].startDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
        
        if (edu.endDate && !this.isValidDate(edu.endDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_EDUCATION_END_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_EDUCATION_END_DATE,
            field: `education[${index}].endDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }
    
    // 8. Validation des dates des distinctions
    if (data.awards && data.awards.length > 0) {
      data.awards.forEach((award, index) => {
        if (!this.isValidDate(award.date)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_AWARD_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_AWARD_DATE,
            field: `awards[${index}].date`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }

    // 9. Validation des dates des certificats
    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((cert, index) => {
        if (!this.isValidDate(cert.date)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_CERTIFICATE_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_CERTIFICATE_DATE,
            field: `certificates[${index}].date`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }

    // 10. Validation des dates des publications
    if (data.publications && data.publications.length > 0) {
      data.publications.forEach((pub, index) => {
        if (!this.isValidDate(pub.releaseDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PUBLICATION_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_PUBLICATION_DATE,
            field: `publications[${index}].releaseDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }

    // 11. Validation des dates des projets
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((project, index) => {
        if (project.startDate && !this.isValidDate(project.startDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PROJECT_START_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_PROJECT_START_DATE,
            field: `projects[${index}].startDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
        
        if (project.endDate && !this.isValidDate(project.endDate)) {
          errors.push({
            code: ERROR_CODES.COMMON.INVALID_DATE_FORMAT,
            message: i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PROJECT_END_DATE, { index }),
            i18nKey: RESUME_VALIDATION_KEYS.INVALID_PROJECT_END_DATE,
            field: `projects[${index}].endDate`,
            severity: "error",
            layer: ValidationLayerType.DOMAIN,
            suggestion: "Utilisez le format YYYY-MM-DD"
          });
        }
      });
    }
    
    // Si des erreurs sont présentes, retourne un résultat d'échec
    if (errors.length > 0) {
      return new ResumeFailure(errors);
    }
    
    // Création de l'instance avec les données validées
    const resume = new Resume(
      // Utiliser l'objet data directement, ou un clone pour éviter les modifications
      {
        ...data as ResumeInterface
      },
      i18n
    );
    
    // Retourner un résultat de succès avec l'entité attachée
    return new ResumeSuccess(resume);
  }

  /**
   * Méthode factory pour créer une instance validée de Resume
   * @param data Les données brutes du CV
   * @param i18n Interface pour l'internationalisation des messages
   * @returns Un objet contenant le résultat de la validation et éventuellement l'instance de Resume
   * @deprecated Utilisez createWithResultType à la place, qui retourne un ResultTypeInterface standard
   */
  static create(
    data: Partial<ResumeInterface>,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ValidationResultType & { resume?: Resume } {
    const result = this.createWithResultType(data, i18n);
    
    if (result instanceof ResumeFailure) {
      return {
        isValid: false,
        errors: result.getErrors().map(err => err.message)
      };
    } else {
      return {
        isValid: true,
        errors: [], // Assurer que errors est un tableau vide pour le cas de succès
        resume: result.entity
      };
    }
  }
  
  private static isValidDate(dateString?: string): boolean {
    if (!dateString) return false;
    
    // Format ISO YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    
    // Validation que la date est valide
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Getters pour accéder aux propriétés en immutabilité
  get basics() {
    return { ...this.data.basics };
  }

  get work() {
    return this.data.work ? [...this.data.work] : [];
  }

  get volunteer() {
    return this.data.volunteer ? [...this.data.volunteer] : [];
  }

  get education() {
    return this.data.education ? [...this.data.education] : [];
  }

  get awards() {
    return this.data.awards ? [...this.data.awards] : [];
  }

  get certificates() {
    return this.data.certificates ? [...this.data.certificates] : [];
  }

  get publications() {
    return this.data.publications ? [...this.data.publications] : [];
  }

  get skills() {
    return this.data.skills ? [...this.data.skills] : [];
  }

  get languages() {
    return this.data.languages ? [...this.data.languages] : [];
  }

  get interests() {
    return this.data.interests ? [...this.data.interests] : [];
  }

  get references() {
    return this.data.references ? [...this.data.references] : [];
  }

  get projects() {
    return this.data.projects ? [...this.data.projects] : [];
  }

  /**
   * Convertit l'entité en objet simple conforme à ResumeInterface
   * @returns L'objet représentant le CV
   */
  toJSON(): ResumeInterface {
    return { ...this.data };
  }
}
