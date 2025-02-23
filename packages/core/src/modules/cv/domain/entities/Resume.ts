import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type'

export class Resume {
  private constructor(private readonly data: ResumeInterface) {}

  static create(data: Partial<ResumeInterface>): ValidationResultType & { resume?: Resume } {
    console.log('=== Domain Layer - Resume Entity ===')
    console.log('Creating Resume from data:', data)

    // Créer directement une instance avec les données reçues
    return {
      isValid: true,
      resume: new Resume(data as ResumeInterface)
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
    console.log('=== Domain Layer - Resume.toJSON ===')
    const json = {
      basics: this.basics,
      ...(this.work.length > 0 && { work: this.work }),
      ...(this.education.length > 0 && { education: this.education }),
      ...(this.skills.length > 0 && { skills: this.skills })
    }
    console.log('Generated JSON:', json)
    return json
  }
} 