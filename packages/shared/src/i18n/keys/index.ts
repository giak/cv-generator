/**
 * Translation keys for the application.
 * Keys are organized by domain/feature to maintain a clear structure.
 */

export const TRANSLATION_KEYS = {
  COMMON: {
    ERRORS: {
      REQUIRED_FIELD: 'common.errors.requiredField',
      INVALID_EMAIL: 'common.errors.invalidEmail',
      INVALID_DATE: 'common.errors.invalidDate',
      TOO_LONG: 'common.errors.tooLong',
      TOO_SHORT: 'common.errors.tooShort',
      FUTURE_DATE: 'common.errors.futureDate',
      INVALID_FORMAT: 'common.errors.invalidFormat'
    },
    ACTIONS: {
      SAVE: 'common.actions.save',
      CANCEL: 'common.actions.cancel',
      EDIT: 'common.actions.edit',
      DELETE: 'common.actions.delete',
      ADD: 'common.actions.add',
      REMOVE: 'common.actions.remove',
      EXPORT: 'common.actions.export',
      IMPORT: 'common.actions.import',
      PREVIEW: 'common.actions.preview'
    },
    LABELS: {
      YES: 'common.labels.yes',
      NO: 'common.labels.no',
      LOADING: 'common.labels.loading',
      SUCCESS: 'common.labels.success',
      ERROR: 'common.labels.error',
      WARNING: 'common.labels.warning',
      INFO: 'common.labels.info'
    }
  },
  RESUME: {
    SECTIONS: {
      BASICS: 'resume.sections.basics',
      WORK: 'resume.sections.work',
      EDUCATION: 'resume.sections.education',
      SKILLS: 'resume.sections.skills',
      PROJECTS: 'resume.sections.projects',
      VOLUNTEER: 'resume.sections.volunteer',
      AWARDS: 'resume.sections.awards',
      PUBLICATIONS: 'resume.sections.publications',
      LANGUAGES: 'resume.sections.languages',
      INTERESTS: 'resume.sections.interests',
      REFERENCES: 'resume.sections.references'
    },
    BASICS: {
      LABELS: {
        NAME: 'resume.basics.labels.name',
        EMAIL: 'resume.basics.labels.email',
        PHONE: 'resume.basics.labels.phone',
        WEBSITE: 'resume.basics.labels.website',
        LOCATION: 'resume.basics.labels.location',
        SUMMARY: 'resume.basics.labels.summary',
        PROFILES: 'resume.basics.labels.profiles',
        JOB_TITLE: 'resume.basics.labels.jobTitle',
        IMAGE: 'resume.basics.labels.image',
        ADDRESS: 'resume.basics.labels.address',
        POSTAL_CODE: 'resume.basics.labels.postalCode',
        CITY: 'resume.basics.labels.city',
        REGION: 'resume.basics.labels.region',
        COUNTRY_CODE: 'resume.basics.labels.countryCode'
      },
      PLACEHOLDERS: {
        NAME: 'resume.basics.placeholders.name',
        EMAIL: 'resume.basics.placeholders.email',
        PHONE: 'resume.basics.placeholders.phone',
        WEBSITE: 'resume.basics.placeholders.website',
        SUMMARY: 'resume.basics.placeholders.summary',
        JOB_TITLE: 'resume.basics.placeholders.jobTitle',
        IMAGE: 'resume.basics.placeholders.image',
        ADDRESS: 'resume.basics.placeholders.address',
        POSTAL_CODE: 'resume.basics.placeholders.postalCode',
        CITY: 'resume.basics.placeholders.city',
        REGION: 'resume.basics.placeholders.region',
        COUNTRY_CODE: 'resume.basics.placeholders.countryCode'
      },
      HELP_TEXT: {
        NAME: 'resume.basics.helpText.name',
        EMAIL: 'resume.basics.helpText.email',
        PHONE: 'resume.basics.helpText.phone',
        WEBSITE: 'resume.basics.helpText.website',
        SUMMARY: 'resume.basics.helpText.summary',
        JOB_TITLE: 'resume.basics.helpText.jobTitle',
        IMAGE: 'resume.basics.helpText.image',
        ADDRESS: 'resume.basics.helpText.address',
        POSTAL_CODE: 'resume.basics.helpText.postalCode',
        CITY: 'resume.basics.helpText.city',
        REGION: 'resume.basics.helpText.region',
        COUNTRY_CODE: 'resume.basics.helpText.countryCode'
      },
      IMAGE_SUGGESTIONS: {
        TITLE: 'resume.basics.imageSuggestions.title',
        USE_FULL_URL: 'resume.basics.imageSuggestions.useFullUrl',
        CHECK_PUBLIC_ACCESS: 'resume.basics.imageSuggestions.checkPublicAccess',
        USE_PROFESSIONAL_IMAGE: 'resume.basics.imageSuggestions.useProfessionalImage',
        RECOMMENDED_FORMATS: 'resume.basics.imageSuggestions.recommendedFormats'
      },
      ADDRESS_SUGGESTIONS: {
        TITLE: 'resume.basics.addressSuggestions.title',
        COMPLETE_ADDRESS: 'resume.basics.addressSuggestions.completeAddress',
        VALID_POSTAL_CODE: 'resume.basics.addressSuggestions.validPostalCode',
        OFFICIAL_CITY_NAME: 'resume.basics.addressSuggestions.officialCityName',
        ISO_COUNTRY_CODE: 'resume.basics.addressSuggestions.isoCountryCode'
      },
      PROFILES: {
        NETWORK: 'resume.basics.profiles.network',
        USERNAME: 'resume.basics.profiles.username',
        URL: 'resume.basics.profiles.url',
        NETWORK_PLACEHOLDER: 'resume.basics.profiles.networkPlaceholder',
        USERNAME_PLACEHOLDER: 'resume.basics.profiles.usernamePlaceholder',
        URL_PLACEHOLDER: 'resume.basics.profiles.urlPlaceholder'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.basics.validation.missingName',
        MISSING_EMAIL: 'resume.basics.validation.missingEmail',
        INVALID_EMAIL: 'resume.basics.validation.invalidEmail',
        PERSONAL_EMAIL: 'resume.basics.validation.personalEmail',
        MISSING_PHONE: 'resume.basics.validation.missingPhone',
        INVALID_PHONE: 'resume.basics.validation.invalidPhone',
        MISSING_LOCATION: 'resume.basics.validation.missingLocation',
        VAGUE_LOCATION: 'resume.basics.validation.vagueLocation',
        MISSING_SUMMARY: 'resume.basics.validation.missingSummary',
        BRIEF_SUMMARY: 'resume.basics.validation.briefSummary'
      }
    },
    WORK: {
      LABELS: {
        COMPANY: 'resume.work.labels.company',
        POSITION: 'resume.work.labels.position',
        WEBSITE: 'resume.work.labels.website',
        START_DATE: 'resume.work.labels.startDate',
        END_DATE: 'resume.work.labels.endDate',
        SUMMARY: 'resume.work.labels.summary',
        HIGHLIGHTS: 'resume.work.labels.highlights'
      },
      PLACEHOLDERS: {
        COMPANY: 'resume.work.placeholders.company',
        POSITION: 'resume.work.placeholders.position',
        WEBSITE: 'resume.work.placeholders.website',
        START_DATE: 'resume.work.placeholders.startDate',
        END_DATE: 'resume.work.placeholders.endDate',
        SUMMARY: 'resume.work.placeholders.summary',
        HIGHLIGHT: 'resume.work.placeholders.highlight'
      },
      VALIDATION: {
        MISSING_COMPANY: 'resume.work.validation.missingCompany',
        VAGUE_POSITION: 'resume.work.validation.vaguePosition',
        MISSING_POSITION: 'resume.work.validation.missingPosition',
        MISSING_START_DATE: 'resume.work.validation.missingStartDate',
        END_BEFORE_START: 'resume.work.validation.endBeforeStart',
        FUTURE_DATE: 'resume.work.validation.futureDate',
        MISSING_SUMMARY: 'resume.work.validation.missingSummary',
        BRIEF_DESCRIPTION: 'resume.work.validation.briefDescription',
        MISSING_HIGHLIGHTS: 'resume.work.validation.missingHighlights',
        VAGUE_HIGHLIGHTS: 'resume.work.validation.vagueHighlights'
      }
    },
    EDUCATION: {
      LABELS: {
        INSTITUTION: 'resume.education.labels.institution',
        AREA: 'resume.education.labels.area',
        STUDY_TYPE: 'resume.education.labels.studyType',
        START_DATE: 'resume.education.labels.startDate',
        END_DATE: 'resume.education.labels.endDate',
        GPA: 'resume.education.labels.gpa',
        COURSES: 'resume.education.labels.courses'
      },
      PLACEHOLDERS: {
        INSTITUTION: 'resume.education.placeholders.institution',
        AREA: 'resume.education.placeholders.area',
        STUDY_TYPE: 'resume.education.placeholders.studyType',
        START_DATE: 'resume.education.placeholders.startDate',
        END_DATE: 'resume.education.placeholders.endDate',
        GPA: 'resume.education.placeholders.gpa',
        COURSE: 'resume.education.placeholders.course'
      },
      VALIDATION: {
        MISSING_INSTITUTION: 'resume.education.validation.missingInstitution',
        MISSING_AREA: 'resume.education.validation.missingArea',
        MISSING_STUDY_TYPE: 'resume.education.validation.missingStudyType',
        MISSING_START_DATE: 'resume.education.validation.missingStartDate',
        END_BEFORE_START: 'resume.education.validation.endBeforeStart',
        MISSING_GPA: 'resume.education.validation.missingGpa',
        VAGUE_COURSES: 'resume.education.validation.vagueCourses'
      }
    },
    SKILLS: {
      LABELS: {
        NAME: 'resume.skills.labels.name',
        LEVEL: 'resume.skills.labels.level',
        KEYWORDS: 'resume.skills.labels.keywords'
      },
      PLACEHOLDERS: {
        NAME: 'resume.skills.placeholders.name',
        LEVEL: 'resume.skills.placeholders.level',
        KEYWORD: 'resume.skills.placeholders.keyword'
      },
      VALIDATION: {
        MISSING_SKILL_NAME: 'resume.skills.validation.missingSkillName',
        BRIEF_SKILL_NAME: 'resume.skills.validation.briefSkillName',
        UNDEFINED_LEVEL: 'resume.skills.validation.undefinedLevel',
        MISSING_KEYWORDS: 'resume.skills.validation.missingKeywords',
        GENERIC_SKILL: 'resume.skills.validation.genericSkill'
      }
    }
  },
  UI: {
    HEADER: {
      TITLE: 'ui.header.title',
      SUBTITLE: 'ui.header.subtitle',
      LANGUAGE_SELECTOR: 'ui.header.languageSelector'
    },
    FOOTER: {
      COPYRIGHT: 'ui.footer.copyright',
      VERSION: 'ui.footer.version',
      MADE_WITH: 'ui.footer.madeWith'
    },
    NAVIGATION: {
      HOME: 'ui.navigation.home',
      EDITOR: 'ui.navigation.editor',
      PREVIEW: 'ui.navigation.preview',
      EXPORT: 'ui.navigation.export',
      SETTINGS: 'ui.navigation.settings'
    },
    EXPORT: {
      TITLE: 'ui.export.title',
      JSON_FORMAT: 'ui.export.jsonFormat',
      HTML_FORMAT: 'ui.export.htmlFormat',
      PDF_FORMAT: 'ui.export.pdfFormat',
      DOWNLOAD: 'ui.export.download',
      SUCCESS_MESSAGE: 'ui.export.successMessage',
      ERROR_MESSAGE: 'ui.export.errorMessage'
    }
  }
} as const;

/**
 * Type for type-safe access to translation keys
 */
export type TranslationKeyType = typeof TRANSLATION_KEYS; 