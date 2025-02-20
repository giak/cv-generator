import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type'
import { resumeSchema } from '@cv-generator/shared/src/validators/resumeSchema'
import { Email } from '../value-objects/Email'
import { Phone } from '../value-objects/Phone'

export class Resume {
  private constructor(private readonly data: ResumeInterface) {}

  static create(data: Partial<ResumeInterface>): ValidationResultType & { resume?: Resume } {
    // Valider et créer les Value Objects
    if (data.basics?.email) {
      const emailResult = Email.create(data.basics.email)
      if (emailResult.isFailure) {
        return {
          isValid: false,
          errors: [emailResult.error]
        }
      }
    }

    if (data.basics?.phone) {
      const phoneResult = Phone.create(data.basics.phone)
      if (phoneResult.isFailure) {
        return {
          isValid: false,
          errors: [phoneResult.error]
        }
      }
    }

    // Valider le schéma complet
    const validation = resumeSchema.safeParse(data)

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.error.errors.map((err) => err.message)
      }
    }

    return {
      isValid: true,
      resume: new Resume(validation.data)
    }
  }

  get basics() {
    return { ...this.data.basics }
  }

  get work() {
    return this.data.work ? [...this.data.work] : []
  }

  get education() {
    return this.data.education ? [...this.data.education] : []
  }

  get skills() {
    return this.data.skills ? [...this.data.skills] : []
  }

  toJSON(): ResumeInterface {
    return {
      basics: this.basics,
      ...(this.work.length > 0 && { work: this.work }),
      ...(this.education.length > 0 && { education: this.education }),
      ...(this.skills.length > 0 && { skills: this.skills })
    }
  }
} 