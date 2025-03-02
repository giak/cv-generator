import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type'
import { Email } from '../value-objects/Email'
import { Phone } from '../value-objects/Phone'
import { Result } from '../../../modules/cv/domain/shared/Result'

/**
 * Resume entity representing a CV in JSON Resume format
 * Implements the JSON Resume schema: https://jsonresume.org/schema/
 */
export class Resume {
  private constructor(private readonly data: ResumeInterface) {}

  static create(data: Partial<ResumeInterface>): ValidationResultType & { resume?: Resume } {
    console.log('=== Domain Layer - Resume Entity ===')
    console.log('Creating Resume from data:', data)
    
    const errors: string[] = []
    
    // 1. Validation basique des données essentielles
    if (!data.basics) {
      errors.push('Informations de base requises')
      return { isValid: false, errors }
    }
    
    // 2. Validation du nom (requis)
    if (!data.basics.name || data.basics.name.trim().length === 0) {
      errors.push('Le nom est requis')
    }
    
    // 3. Validation de l'email avec le value object Email
    const emailResult = Email.create(data.basics.email || '')
    if (emailResult.isFailure) {
      errors.push(emailResult.error)
    }
    
    // 4. Validation du téléphone si fourni
    if (data.basics.phone) {
      const phoneResult = Phone.create(data.basics.phone)
      if (phoneResult.isFailure) {
        errors.push(phoneResult.error)
      }
    }
    
    // 5. Validation des dates dans les expériences professionnelles
    if (data.work && data.work.length > 0) {
      data.work.forEach((work, index) => {
        if (!this.isValidDate(work.startDate)) {
          errors.push(`Format de date invalide pour l'expérience ${index + 1}`)
        }
        
        if (work.endDate && !this.isValidDate(work.endDate)) {
          errors.push(`Format de date de fin invalide pour l'expérience ${index + 1}`)
        }
      })
    }

    // 6. Validation des dates dans les activités bénévoles
    if (data.volunteer && data.volunteer.length > 0) {
      data.volunteer.forEach((vol, index) => {
        if (!this.isValidDate(vol.startDate)) {
          errors.push(`Format de date invalide pour l'activité bénévole ${index + 1}`)
        }
        
        if (vol.endDate && !this.isValidDate(vol.endDate)) {
          errors.push(`Format de date de fin invalide pour l'activité bénévole ${index + 1}`)
        }
      })
    }

    // 7. Validation des dates dans l'éducation
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu, index) => {
        if (!this.isValidDate(edu.startDate)) {
          errors.push(`Format de date invalide pour l'éducation ${index + 1}`)
        }
        
        if (edu.endDate && !this.isValidDate(edu.endDate)) {
          errors.push(`Format de date de fin invalide pour l'éducation ${index + 1}`)
        }
      })
    }
    
    // 8. Validation des dates des distinctions
    if (data.awards && data.awards.length > 0) {
      data.awards.forEach((award, index) => {
        if (!this.isValidDate(award.date)) {
          errors.push(`Format de date invalide pour la distinction ${index + 1}`)
        }
      })
    }

    // 9. Validation des dates des certificats
    if (data.certificates && data.certificates.length > 0) {
      data.certificates.forEach((cert, index) => {
        if (!this.isValidDate(cert.date)) {
          errors.push(`Format de date invalide pour le certificat ${index + 1}`)
        }
      })
    }

    // 10. Validation des dates des publications
    if (data.publications && data.publications.length > 0) {
      data.publications.forEach((pub, index) => {
        if (!this.isValidDate(pub.releaseDate)) {
          errors.push(`Format de date invalide pour la publication ${index + 1}`)
        }
      })
    }

    // 11. Validation des dates des projets
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((project, index) => {
        if (project.startDate && !this.isValidDate(project.startDate)) {
          errors.push(`Format de date de début invalide pour le projet ${index + 1}`)
        }
        
        if (project.endDate && !this.isValidDate(project.endDate)) {
          errors.push(`Format de date de fin invalide pour le projet ${index + 1}`)
        }
      })
    }
    
    // Si des erreurs sont présentes, retourne le résultat d'échec
    if (errors.length > 0) {
      console.log('Validation errors:', errors)
      return { isValid: false, errors }
    }
    
    // Créer l'instance avec les données validées
    const resume = new Resume(data as ResumeInterface)
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
    console.log('=== Domain Layer - Resume.toJSON ===')
    const json = {
      basics: this.basics,
      ...(this.work.length > 0 && { work: this.work }),
      ...(this.volunteer.length > 0 && { volunteer: this.volunteer }),
      ...(this.education.length > 0 && { education: this.education }),
      ...(this.awards.length > 0 && { awards: this.awards }),
      ...(this.certificates.length > 0 && { certificates: this.certificates }),
      ...(this.publications.length > 0 && { publications: this.publications }),
      ...(this.skills.length > 0 && { skills: this.skills }),
      ...(this.languages.length > 0 && { languages: this.languages }),
      ...(this.interests.length > 0 && { interests: this.interests }),
      ...(this.references.length > 0 && { references: this.references }),
      ...(this.projects.length > 0 && { projects: this.projects })
    }
    console.log('Generated JSON:', json)
    return json
  }
} 