/**
 * Translation keys for the application.
 * Keys are organized by domain/feature to maintain a clear structure.
 */

export const TRANSLATION_KEYS = {
  COMMON: {
    ERRORS: {
      REQUIRED_FIELD: 'common.errors.requiredField',
      INVALID_EMAIL: 'common.errors.invalidEmail',
      INVALID_DATE: 'common.errors.invalidDate'
    },
    ACTIONS: {
      SAVE: 'common.actions.save',
      CANCEL: 'common.actions.cancel',
      EDIT: 'common.actions.edit',
      DELETE: 'common.actions.delete'
    }
  },
  RESUME: {
    SECTIONS: {
      BASICS: 'resume.sections.basics',
      WORK: 'resume.sections.work',
      EDUCATION: 'resume.sections.education',
      SKILLS: 'resume.sections.skills'
    },
    VALIDATION: {
      INVALID_NAME: 'resume.validation.invalidName',
      INVALID_EMAIL: 'resume.validation.invalidEmail',
      INVALID_URL: 'resume.validation.invalidUrl'
    }
  }
} as const; 