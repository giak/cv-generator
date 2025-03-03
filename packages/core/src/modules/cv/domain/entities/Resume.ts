import type { ResumeInterface, AwardInterface } from '@cv-generator/shared/src/types/resume.interface'
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type'
import { Email } from '../value-objects/Email'
import { Phone } from '../value-objects/Phone'
import { Result } from '../shared/Result'

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

    // 6. Validation des dates dans l'éducation
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
    
    // 7. Validation des dates dans les expériences de bénévolat
    if (data.volunteer && data.volunteer.length > 0) {
      data.volunteer.forEach((vol, index) => {
        if (!this.isValidDate(vol.startDate)) {
          errors.push(`Format de date invalide pour le bénévolat ${index + 1}`)
        }
        
        if (vol.endDate && !this.isValidDate(vol.endDate)) {
          errors.push(`Format de date de fin invalide pour le bénévolat ${index + 1}`)
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

  get skills() {
    return this.data.skills ? [...this.data.skills] : []
  }

  get awards(): AwardInterface[] {
    return this.data.awards || [];
  }

  toJSON(): ResumeInterface {
    console.log('=== Domain Layer - Resume.toJSON ===')
    const json = {
      ...this.data,
      basics: this.basics,
      work: this.work,
      volunteer: this.volunteer,
      education: this.education,
      awards: this.awards,
      skills: this.skills
    }
    console.log('Generated JSON:', json)
    return json
  }
} 