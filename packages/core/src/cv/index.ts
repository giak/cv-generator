/**
 * Exports pour le module cv
 */

// Services de validation
export {
  BaseValidationService,
  ValidationServiceInterface
} from './application/services/validation.service';

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