// Export des entités
export { Resume } from './modules/cv/domain/entities/Resume'

// Export des value objects
export { Email } from './modules/cv/domain/value-objects/Email'
export { Phone } from './modules/cv/domain/value-objects/Phone'

// Export des use cases
export { ManageResume } from './modules/cv/application/use-cases/ManageResume'
export type { ResumeRepository } from './modules/cv/application/use-cases/ManageResume'

// Export des types
export type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
export type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type' 