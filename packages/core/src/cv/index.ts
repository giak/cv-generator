/**
 * Exports pour le module cv
 */

// Services de validation
export {
  BaseValidationService
} from './application/services/validation.service';

export {
  BasicsValidationService
} from './application/services/basics-validation.service';

export {
  WorkValidationService,
  type WorkInterface
} from './application/services/work-validation.service';

export {
  SkillValidationService,
  type SkillInterface,
  VALID_SKILL_LEVELS
} from './application/services/skill-validation.service';

export {
  EducationValidationService,
  type EducationInterface
} from './application/services/education-validation.service';

export {
  ProjectValidationService,
  type ProjectInterface
} from './application/services/project-validation.service';

// Value Objects
export { Email } from './domain/value-objects/email.value-object';
export { DateRange } from './domain/value-objects/date-range.value-object';
export { Phone } from './domain/value-objects/phone.value-object';
export { Url } from './domain/value-objects/url.value-object';

// Entités de domaine
export { Resume } from './domain/entities/Resume';
export { Work } from './domain/entities/Work';
export { Basics, type BasicsValidationResultType } from './domain/entities/Basics';

// Cas d'utilisation
export { ManageResume } from './application/use-cases/ManageResume'; 