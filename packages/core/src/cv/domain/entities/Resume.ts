import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface';
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type';
import { Email } from '../value-objects/email.value-object';
import { Phone } from '../value-objects/phone.value-object';
import { TRANSLATION_KEYS } from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

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

  static create(
    data: Partial<ResumeInterface>,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ValidationResultType & { resume?: Resume } {
    const errors: string[] = []
    
    // 1. Validation basique des données essentielles
    if (!data.basics) {
      errors.push(i18n.translate(RESUME_VALIDATION_KEYS.MISSING_BASICS))
      return { isValid: false, errors }
    }
    
    // 2. Validation du nom (requis)
    if (!data.basics.name || data.basics.name.trim().length === 0) {
      errors.push(i18n.translate(RESUME_VALIDATION_KEYS.MISSING_NAME))
    }
    
    // 3. Validation de l'email avec le value object Email
    if (data.basics?.email) {
      const emailResult = Email.create(data.basics.email)
      if (!emailResult.success) {
        errors.push(emailResult.error[0].message)
      }
    }
    
    // 4. Validation du téléphone si fourni
    if (data.basics.phone) {
      const phoneResult = Phone.create(data.basics.phone)
      if (phoneResult.isFailure) {
        // Le résultat peut être une chaîne ou un tableau
        if (typeof phoneResult.error === 'string') {
          errors.push(phoneResult.error)
        } else if (Array.isArray(phoneResult.error)) {
          // Si c'est un tableau, prendre le premier message
          errors.push(phoneResult.error[0]?.message || 'Format de téléphone invalide')
        } else {
          errors.push('Format de téléphone invalide')
        }
      }
    }
    
    // 5. Validation des dates dans les expériences professionnelles
    if (data.work && data.work.length > 0) {
      data.work.forEach((work, index) => {
        if (!this.isValidDate(work.startDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_WORK_DATE, { index }))
        }
        
        if (work.endDate && !this.isValidDate(work.endDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_WORK_END_DATE, { index }))
        }
      })
    }

    // 6. Validation des dates dans les activités bénévoles
    if (data.volunteer && data.volunteer.length > 0) {
      data.volunteer.forEach((vol, index) => {
        if (!this.isValidDate(vol.startDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_DATE, { index }))
        }
        
        if (vol.endDate && !this.isValidDate(vol.endDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_VOLUNTEER_END_DATE, { index }))
        }
      })
    }

    // 7. Validation des dates dans l'éducation
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu, index) => {
        if (!this.isValidDate(edu.startDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_EDUCATION_DATE, { index }))
        }
        
        if (edu.endDate && !this.isValidDate(edu.endDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_EDUCATION_END_DATE, { index }))
        }
      })
    }
    
    // 8. Validation des dates des distinctions
    if (data.awards && data.awards.length > 0) {
      data.awards.forEach((award, index) => {
        if (!this.isValidDate(award.date)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_AWARD_DATE, { index }))
        }
      })
    }

    // 9. Validation des dates des certificats
    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((cert, index) => {
        if (!this.isValidDate(cert.date)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_CERTIFICATE_DATE, { index }))
        }
      })
    }

    // 10. Validation des dates des publications
    if (data.publications && data.publications.length > 0) {
      data.publications.forEach((pub, index) => {
        if (!this.isValidDate(pub.releaseDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PUBLICATION_DATE, { index }))
        }
      })
    }

    // 11. Validation des dates des projets
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((project, index) => {
        if (project.startDate && !this.isValidDate(project.startDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PROJECT_START_DATE, { index }))
        }
        
        if (project.endDate && !this.isValidDate(project.endDate)) {
          errors.push(i18n.translate(RESUME_VALIDATION_KEYS.INVALID_PROJECT_END_DATE, { index }))
        }
      })
    }
    
    // Si des erreurs sont présentes, retourne le résultat d'échec
    if (errors.length > 0) {

      return { isValid: false, errors }
    }
    
    // Créer l'instance avec les données validées
    const resume = new Resume(data as ResumeInterface, i18n)
    return {
      isValid: true,
      resume
    }
  }
  
  private static isValidDate(dateString: string): boolean {
    // Format ISO YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) {
      return false
    }
    
    // Validation que la date est valide
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  // Getters pour accéder aux propriétés en immutabilité
  get basics() {
    return { ...this.data.basics }
  }

  get work() {
    return this.data.work ? [...this.data.work] : []
  }

  get volunteer() {
    return this.data.volunteer ? [...this.data.volunteer] : []
  }

  get education() {
    return this.data.education ? [...this.data.education] : []
  }

  get awards() {
    return this.data.awards ? [...this.data.awards] : []
  }

  get certificates() {
    return this.data.certificates ? [...this.data.certificates] : []
  }

  get publications() {
    return this.data.publications ? [...this.data.publications] : []
  }

  get skills() {
    return this.data.skills ? [...this.data.skills] : []
  }

  get languages() {
    return this.data.languages ? [...this.data.languages] : []
  }

  get interests() {
    return this.data.interests ? [...this.data.interests] : []
  }

  get references() {
    return this.data.references ? [...this.data.references] : []
  }

  get projects() {
    return this.data.projects ? [...this.data.projects] : []
  }

  /**
   * Convert the Resume entity to a JSON object conforming to the JSON Resume standard
   * @returns ResumeInterface - A structured object that follows the JSON Resume schema
   */
  toJSON(): ResumeInterface {
    const json = {
      basics: this.basics,
      ...(this.work.length > 0 && { work: this.work }),
      ...(this.volunteer.length > 0 && { volunteer: this.volunteer }),
      ...(this.education.length > 0 && { education: this.education }),
      awards: this.awards,
      ...(this.certificates.length > 0 && { certificates: this.certificates }),
      ...(this.publications.length > 0 && { publications: this.publications }),
      skills: this.skills,
      ...(this.languages.length > 0 && { languages: this.languages }),
      ...(this.interests.length > 0 && { interests: this.interests }),
      ...(this.references.length > 0 && { references: this.references }),
      ...(this.projects.length > 0 && { projects: this.projects })
    }
    return json
  }
}
