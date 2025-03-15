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
        HIGHLIGHTS: 'resume.work.labels.highlights',
        CURRENT_POSITION: 'resume.work.labels.currentPosition'
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
      HELP_TEXT: {
        COMPANY: 'resume.work.helpText.company',
        POSITION: 'resume.work.helpText.position',
        WEBSITE: 'resume.work.helpText.website',
        START_DATE: 'resume.work.helpText.startDate',
        END_DATE: 'resume.work.helpText.endDate',
        SUMMARY: 'resume.work.helpText.summary',
        HIGHLIGHTS: 'resume.work.helpText.highlights'
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
      },
      FORM: {
        ADD_TITLE: 'resume.work.form.addTitle',
        EDIT_TITLE: 'resume.work.form.editTitle',
        ADD_SUBTITLE: 'resume.work.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.work.form.editSubtitle',
        HIGHLIGHTS_SECTION: 'resume.work.form.highlightsSection',
        HIGHLIGHTS_DESCRIPTION: 'resume.work.form.highlightsDescription',
        NO_HIGHLIGHTS: 'resume.work.form.noHighlights',
        ADD_HIGHLIGHT: 'resume.work.form.addHighlight'
      },
      LIST: {
        TITLE: 'resume.work.list.title',
        DESCRIPTION: 'resume.work.list.description',
        ADD_BUTTON: 'resume.work.list.addButton',
        EMPTY_STATE_TITLE: 'resume.work.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.work.list.emptyStateDescription',
        MOVE_UP: 'resume.work.list.moveUp',
        MOVE_DOWN: 'resume.work.list.moveDown',
        PRESENT: 'resume.work.list.present'
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
      HELP_TEXT: {
        INSTITUTION: 'resume.education.helpText.institution',
        AREA: 'resume.education.helpText.area',
        STUDY_TYPE: 'resume.education.helpText.studyType',
        START_DATE: 'resume.education.helpText.startDate',
        END_DATE: 'resume.education.helpText.endDate',
        GPA: 'resume.education.helpText.gpa',
        COURSES: 'resume.education.helpText.courses'
      },
      VALIDATION: {
        MISSING_INSTITUTION: 'resume.education.validation.missingInstitution',
        MISSING_AREA: 'resume.education.validation.missingArea',
        MISSING_STUDY_TYPE: 'resume.education.validation.missingStudyType',
        MISSING_START_DATE: 'resume.education.validation.missingStartDate',
        END_BEFORE_START: 'resume.education.validation.endBeforeStart',
        MISSING_GPA: 'resume.education.validation.missingGpa',
        VAGUE_COURSES: 'resume.education.validation.vagueCourses'
      },
      FORM: {
        ADD_TITLE: 'resume.education.form.addTitle',
        EDIT_TITLE: 'resume.education.form.editTitle',
        ADD_SUBTITLE: 'resume.education.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.education.form.editSubtitle',
        COURSES_SECTION: 'resume.education.form.coursesSection',
        COURSES_DESCRIPTION: 'resume.education.form.coursesDescription',
        NO_COURSES: 'resume.education.form.noCourses',
        ADD_COURSE: 'resume.education.form.addCourse'
      },
      LIST: {
        TITLE: 'resume.education.list.title',
        DESCRIPTION: 'resume.education.list.description',
        ADD_BUTTON: 'resume.education.list.addButton',
        EMPTY_STATE_TITLE: 'resume.education.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.education.list.emptyStateDescription',
        MOVE_UP: 'resume.education.list.moveUp',
        MOVE_DOWN: 'resume.education.list.moveDown',
        PRESENT: 'resume.education.list.present'
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
      HELP_TEXT: {
        NAME: 'resume.skills.helpText.name',
        LEVEL: 'resume.skills.helpText.level',
        KEYWORDS: 'resume.skills.helpText.keywords'
      },
      VALIDATION: {
        MISSING_SKILL_NAME: 'resume.skills.validation.missingSkillName',
        BRIEF_SKILL_NAME: 'resume.skills.validation.briefSkillName',
        UNDEFINED_LEVEL: 'resume.skills.validation.undefinedLevel',
        MISSING_KEYWORDS: 'resume.skills.validation.missingKeywords',
        GENERIC_SKILL: 'resume.skills.validation.genericSkill',
        EMPTY_KEYWORD: 'resume.skills.validation.emptyKeyword'
      },
      FORM: {
        ADD_TITLE: 'resume.skills.form.addTitle',
        EDIT_TITLE: 'resume.skills.form.editTitle',
        ADD_SUBTITLE: 'resume.skills.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.skills.form.editSubtitle',
        KEYWORDS_SECTION: 'resume.skills.form.keywordsSection',
        KEYWORDS_DESCRIPTION: 'resume.skills.form.keywordsDescription',
        NO_KEYWORDS: 'resume.skills.form.noKeywords',
        ADD_KEYWORD: 'resume.skills.form.addKeyword'
      },
      LIST: {
        TITLE: 'resume.skills.list.title',
        DESCRIPTION: 'resume.skills.list.description',
        ADD_BUTTON: 'resume.skills.list.addButton',
        EMPTY_STATE_TITLE: 'resume.skills.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.skills.list.emptyStateDescription',
        MOVE_UP: 'resume.skills.list.moveUp',
        MOVE_DOWN: 'resume.skills.list.moveDown'
      }
    },
    PROJECTS: {
      LABELS: {
        NAME: 'resume.projects.labels.name',
        DESCRIPTION: 'resume.projects.labels.description',
        URL: 'resume.projects.labels.url',
        START_DATE: 'resume.projects.labels.startDate',
        END_DATE: 'resume.projects.labels.endDate',
        ENTITY: 'resume.projects.labels.entity',
        TYPE: 'resume.projects.labels.type',
        HIGHLIGHTS: 'resume.projects.labels.highlights',
        ROLES: 'resume.projects.labels.roles',
        KEYWORDS: 'resume.projects.labels.keywords'
      },
      PLACEHOLDERS: {
        NAME: 'resume.projects.placeholders.name',
        DESCRIPTION: 'resume.projects.placeholders.description',
        URL: 'resume.projects.placeholders.url',
        START_DATE: 'resume.projects.placeholders.startDate',
        END_DATE: 'resume.projects.placeholders.endDate',
        ENTITY: 'resume.projects.placeholders.entity',
        TYPE: 'resume.projects.placeholders.type',
        HIGHLIGHT: 'resume.projects.placeholders.highlight',
        ROLE: 'resume.projects.placeholders.role',
        KEYWORD: 'resume.projects.placeholders.keyword'
      },
      HELP_TEXT: {
        NAME: 'resume.projects.helpText.name',
        DESCRIPTION: 'resume.projects.helpText.description',
        URL: 'resume.projects.helpText.url',
        START_DATE: 'resume.projects.helpText.startDate',
        END_DATE: 'resume.projects.helpText.endDate',
        ENTITY: 'resume.projects.helpText.entity',
        TYPE: 'resume.projects.helpText.type',
        HIGHLIGHTS: 'resume.projects.helpText.highlights',
        ROLES: 'resume.projects.helpText.roles',
        KEYWORDS: 'resume.projects.helpText.keywords'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.projects.validation.missingName',
        MISSING_DESCRIPTION: 'resume.projects.validation.missingDescription',
        INVALID_URL: 'resume.projects.validation.invalidUrl',
        END_BEFORE_START: 'resume.projects.validation.endBeforeStart',
        FUTURE_DATE: 'resume.projects.validation.futureDate' 
      },
      FORM: {
        ADD_TITLE: 'resume.projects.form.addTitle',
        EDIT_TITLE: 'resume.projects.form.editTitle',
        ADD_SUBTITLE: 'resume.projects.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.projects.form.editSubtitle',
        HIGHLIGHTS_SECTION: 'resume.projects.form.highlightsSection',
        HIGHLIGHTS_DESCRIPTION: 'resume.projects.form.highlightsDescription',
        ROLES_SECTION: 'resume.projects.form.rolesSection',
        ROLES_DESCRIPTION: 'resume.projects.form.rolesDescription',
        KEYWORDS_SECTION: 'resume.projects.form.keywordsSection',
        KEYWORDS_DESCRIPTION: 'resume.projects.form.keywordsDescription',
        NO_HIGHLIGHTS: 'resume.projects.form.noHighlights',
        NO_ROLES: 'resume.projects.form.noRoles',
        NO_KEYWORDS: 'resume.projects.form.noKeywords',
        ADD_HIGHLIGHT: 'resume.projects.form.addHighlight',
        ADD_ROLE: 'resume.projects.form.addRole',
        ADD_KEYWORD: 'resume.projects.form.addKeyword'
      },
      LIST: {
        TITLE: 'resume.projects.list.title',
        DESCRIPTION: 'resume.projects.list.description',
        ADD_BUTTON: 'resume.projects.list.addButton',
        EMPTY_STATE_TITLE: 'resume.projects.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.projects.list.emptyStateDescription',
        MOVE_UP: 'resume.projects.list.moveUp',
        MOVE_DOWN: 'resume.projects.list.moveDown'
      }
    },
    PUBLICATIONS: {
      LABELS: {
        NAME: 'resume.publications.labels.name',
        PUBLISHER: 'resume.publications.labels.publisher',
        RELEASE_DATE: 'resume.publications.labels.releaseDate',
        URL: 'resume.publications.labels.url',
        SUMMARY: 'resume.publications.labels.summary'
      },
      PLACEHOLDERS: {
        NAME: 'resume.publications.placeholders.name',
        PUBLISHER: 'resume.publications.placeholders.publisher',
        RELEASE_DATE: 'resume.publications.placeholders.releaseDate',
        URL: 'resume.publications.placeholders.url',
        SUMMARY: 'resume.publications.placeholders.summary'
      },
      HELP_TEXT: {
        NAME: 'resume.publications.helpText.name',
        PUBLISHER: 'resume.publications.helpText.publisher',
        RELEASE_DATE: 'resume.publications.helpText.releaseDate',
        URL: 'resume.publications.helpText.url',
        SUMMARY: 'resume.publications.helpText.summary'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.publications.validation.missingName',
        MISSING_PUBLISHER: 'resume.publications.validation.missingPublisher',
        INVALID_DATE: 'resume.publications.validation.invalidDate',
        FUTURE_DATE: 'resume.publications.validation.futureDate',
        INVALID_URL: 'resume.publications.validation.invalidUrl',
        MISSING_SUMMARY: 'resume.publications.validation.missingSummary'
      },
      FORM: {
        ADD_TITLE: 'resume.publications.form.addTitle',
        EDIT_TITLE: 'resume.publications.form.editTitle',
        ADD_SUBTITLE: 'resume.publications.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.publications.form.editSubtitle'
      },
      LIST: {
        TITLE: 'resume.publications.list.title',
        DESCRIPTION: 'resume.publications.list.description',
        ADD_BUTTON: 'resume.publications.list.addButton',
        EMPTY_STATE_TITLE: 'resume.publications.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.publications.list.emptyStateDescription',
        MOVE_UP: 'resume.publications.list.moveUp',
        MOVE_DOWN: 'resume.publications.list.moveDown'
      }
    },
    LANGUAGES: {
      LABELS: {
        LANGUAGE: 'resume.languages.labels.language',
        FLUENCY: 'resume.languages.labels.fluency'
      },
      PLACEHOLDERS: {
        LANGUAGE: 'resume.languages.placeholders.language',
        FLUENCY: 'resume.languages.placeholders.fluency'
      },
      HELP_TEXT: {
        LANGUAGE: 'resume.languages.helpText.language',
        FLUENCY: 'resume.languages.helpText.fluency'
      },
      VALIDATION: {
        MISSING_LANGUAGE: 'resume.languages.validation.missingLanguage',
        MISSING_FLUENCY: 'resume.languages.validation.missingFluency'
      },
      FORM: {
        ADD_TITLE: 'resume.languages.form.addTitle',
        EDIT_TITLE: 'resume.languages.form.editTitle',
        ADD_SUBTITLE: 'resume.languages.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.languages.form.editSubtitle'
      },
      LIST: {
        TITLE: 'resume.languages.list.title',
        DESCRIPTION: 'resume.languages.list.description',
        ADD_BUTTON: 'resume.languages.list.addButton',
        EMPTY_STATE_TITLE: 'resume.languages.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.languages.list.emptyStateDescription',
        MOVE_UP: 'resume.languages.list.moveUp',
        MOVE_DOWN: 'resume.languages.list.moveDown'
      }
    },
    INTERESTS: {
      LABELS: {
        NAME: 'resume.interests.labels.name',
        KEYWORDS: 'resume.interests.labels.keywords'
      },
      PLACEHOLDERS: {
        NAME: 'resume.interests.placeholders.name',
        KEYWORD: 'resume.interests.placeholders.keyword'
      },
      HELP_TEXT: {
        NAME: 'resume.interests.helpText.name',
        KEYWORDS: 'resume.interests.helpText.keywords'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.interests.validation.missingName',
        EMPTY_KEYWORD: 'resume.interests.validation.emptyKeyword'
      },
      FORM: {
        ADD_TITLE: 'resume.interests.form.addTitle',
        EDIT_TITLE: 'resume.interests.form.editTitle',
        ADD_SUBTITLE: 'resume.interests.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.interests.form.editSubtitle',
        KEYWORDS_SECTION: 'resume.interests.form.keywordsSection',
        KEYWORDS_DESCRIPTION: 'resume.interests.form.keywordsDescription',
        NO_KEYWORDS: 'resume.interests.form.noKeywords',
        ADD_KEYWORD: 'resume.interests.form.addKeyword'
      },
      LIST: {
        TITLE: 'resume.interests.list.title',
        DESCRIPTION: 'resume.interests.list.description',
        ADD_BUTTON: 'resume.interests.list.addButton',
        EMPTY_STATE_TITLE: 'resume.interests.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.interests.list.emptyStateDescription',
        MOVE_UP: 'resume.interests.list.moveUp',
        MOVE_DOWN: 'resume.interests.list.moveDown'
      }
    },
    AWARDS: {
      LABELS: {
        TITLE: 'resume.awards.labels.title',
        DATE: 'resume.awards.labels.date',
        AWARDER: 'resume.awards.labels.awarder',
        SUMMARY: 'resume.awards.labels.summary'
      },
      PLACEHOLDERS: {
        TITLE: 'resume.awards.placeholders.title',
        DATE: 'resume.awards.placeholders.date',
        AWARDER: 'resume.awards.placeholders.awarder',
        SUMMARY: 'resume.awards.placeholders.summary'
      },
      HELP_TEXT: {
        TITLE: 'resume.awards.helpText.title',
        DATE: 'resume.awards.helpText.date',
        AWARDER: 'resume.awards.helpText.awarder',
        SUMMARY: 'resume.awards.helpText.summary'
      },
      VALIDATION: {
        MISSING_TITLE: 'resume.awards.validation.missingTitle',
        INVALID_DATE: 'resume.awards.validation.invalidDate',
        FUTURE_DATE: 'resume.awards.validation.futureDate',
        MISSING_AWARDER: 'resume.awards.validation.missingAwarder',
        MISSING_SUMMARY: 'resume.awards.validation.missingSummary'
      },
      FORM: {
        ADD_TITLE: 'resume.awards.form.addTitle',
        EDIT_TITLE: 'resume.awards.form.editTitle',
        ADD_SUBTITLE: 'resume.awards.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.awards.form.editSubtitle'
      },
      LIST: {
        TITLE: 'resume.awards.list.title',
        DESCRIPTION: 'resume.awards.list.description',
        ADD_BUTTON: 'resume.awards.list.addButton',
        EMPTY_STATE_TITLE: 'resume.awards.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.awards.list.emptyStateDescription',
        MOVE_UP: 'resume.awards.list.moveUp',
        MOVE_DOWN: 'resume.awards.list.moveDown'
      }
    },
    CERTIFICATES: {
      LABELS: {
        NAME: 'resume.certificates.labels.name',
        DATE: 'resume.certificates.labels.date',
        ISSUER: 'resume.certificates.labels.issuer',
        URL: 'resume.certificates.labels.url'
      },
      PLACEHOLDERS: {
        NAME: 'resume.certificates.placeholders.name',
        DATE: 'resume.certificates.placeholders.date',
        ISSUER: 'resume.certificates.placeholders.issuer',
        URL: 'resume.certificates.placeholders.url'
      },
      HELP_TEXT: {
        NAME: 'resume.certificates.helpText.name',
        DATE: 'resume.certificates.helpText.date',
        ISSUER: 'resume.certificates.helpText.issuer',
        URL: 'resume.certificates.helpText.url'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.certificates.validation.missingName',
        INVALID_DATE: 'resume.certificates.validation.invalidDate',
        FUTURE_DATE: 'resume.certificates.validation.futureDate',
        MISSING_ISSUER: 'resume.certificates.validation.missingIssuer',
        INVALID_URL: 'resume.certificates.validation.invalidUrl'
      },
      FORM: {
        ADD_TITLE: 'resume.certificates.form.addTitle',
        EDIT_TITLE: 'resume.certificates.form.editTitle',
        ADD_SUBTITLE: 'resume.certificates.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.certificates.form.editSubtitle'
      },
      LIST: {
        TITLE: 'resume.certificates.list.title',
        DESCRIPTION: 'resume.certificates.list.description',
        ADD_BUTTON: 'resume.certificates.list.addButton',
        EMPTY_STATE_TITLE: 'resume.certificates.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.certificates.list.emptyStateDescription',
        MOVE_UP: 'resume.certificates.list.moveUp',
        MOVE_DOWN: 'resume.certificates.list.moveDown'
      }
    },
    VOLUNTEER: {
      LABELS: {
        ORGANIZATION: 'resume.volunteer.labels.organization',
        POSITION: 'resume.volunteer.labels.position',
        WEBSITE: 'resume.volunteer.labels.website',
        START_DATE: 'resume.volunteer.labels.startDate',
        END_DATE: 'resume.volunteer.labels.endDate',
        SUMMARY: 'resume.volunteer.labels.summary',
        HIGHLIGHTS: 'resume.volunteer.labels.highlights'
      },
      PLACEHOLDERS: {
        ORGANIZATION: 'resume.volunteer.placeholders.organization',
        POSITION: 'resume.volunteer.placeholders.position',
        WEBSITE: 'resume.volunteer.placeholders.website',
        START_DATE: 'resume.volunteer.placeholders.startDate',
        END_DATE: 'resume.volunteer.placeholders.endDate',
        SUMMARY: 'resume.volunteer.placeholders.summary',
        HIGHLIGHT: 'resume.volunteer.placeholders.highlight'
      },
      HELP_TEXT: {
        ORGANIZATION: 'resume.volunteer.helpText.organization',
        POSITION: 'resume.volunteer.helpText.position',
        WEBSITE: 'resume.volunteer.helpText.website',
        START_DATE: 'resume.volunteer.helpText.startDate',
        END_DATE: 'resume.volunteer.helpText.endDate',
        SUMMARY: 'resume.volunteer.helpText.summary',
        HIGHLIGHTS: 'resume.volunteer.helpText.highlights'
      },
      VALIDATION: {
        MISSING_ORGANIZATION: 'resume.volunteer.validation.missingOrganization',
        MISSING_POSITION: 'resume.volunteer.validation.missingPosition',
        INVALID_URL: 'resume.volunteer.validation.invalidUrl',
        MISSING_START_DATE: 'resume.volunteer.validation.missingStartDate',
        END_BEFORE_START: 'resume.volunteer.validation.endBeforeStart',
        FUTURE_DATE: 'resume.volunteer.validation.futureDate',
        MISSING_SUMMARY: 'resume.volunteer.validation.missingSummary'
      },
      FORM: {
        ADD_TITLE: 'resume.volunteer.form.addTitle',
        EDIT_TITLE: 'resume.volunteer.form.editTitle',
        ADD_SUBTITLE: 'resume.volunteer.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.volunteer.form.editSubtitle',
        HIGHLIGHTS_SECTION: 'resume.volunteer.form.highlightsSection',
        HIGHLIGHTS_DESCRIPTION: 'resume.volunteer.form.highlightsDescription',
        NO_HIGHLIGHTS: 'resume.volunteer.form.noHighlights',
        ADD_HIGHLIGHT: 'resume.volunteer.form.addHighlight'
      },
      LIST: {
        TITLE: 'resume.volunteer.list.title',
        DESCRIPTION: 'resume.volunteer.list.description',
        ADD_BUTTON: 'resume.volunteer.list.addButton',
        EMPTY_STATE_TITLE: 'resume.volunteer.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.volunteer.list.emptyStateDescription',
        MOVE_UP: 'resume.volunteer.list.moveUp',
        MOVE_DOWN: 'resume.volunteer.list.moveDown',
        PRESENT: 'resume.volunteer.list.present'
      }
    },
    REFERENCES: {
      LABELS: {
        NAME: 'resume.references.labels.name',
        REFERENCE: 'resume.references.labels.reference'
      },
      PLACEHOLDERS: {
        NAME: 'resume.references.placeholders.name',
        REFERENCE: 'resume.references.placeholders.reference'
      },
      HELP_TEXT: {
        NAME: 'resume.references.helpText.name',
        REFERENCE: 'resume.references.helpText.reference'
      },
      VALIDATION: {
        MISSING_NAME: 'resume.references.validation.missingName',
        MISSING_REFERENCE: 'resume.references.validation.missingReference'
      },
      FORM: {
        ADD_TITLE: 'resume.references.form.addTitle',
        EDIT_TITLE: 'resume.references.form.editTitle',
        ADD_SUBTITLE: 'resume.references.form.addSubtitle',
        EDIT_SUBTITLE: 'resume.references.form.editSubtitle'
      },
      LIST: {
        TITLE: 'resume.references.list.title',
        DESCRIPTION: 'resume.references.list.description',
        ADD_BUTTON: 'resume.references.list.addButton',
        EMPTY_STATE_TITLE: 'resume.references.list.emptyStateTitle',
        EMPTY_STATE_DESCRIPTION: 'resume.references.list.emptyStateDescription',
        MOVE_UP: 'resume.references.list.moveUp',
        MOVE_DOWN: 'resume.references.list.moveDown'
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
    },
    COLLECTION_MANAGER: {
      EDIT: 'ui.collectionManager.edit',
      DELETE: 'ui.collectionManager.delete',
      MOVE_UP: 'ui.collectionManager.moveUp',
      MOVE_DOWN: 'ui.collectionManager.moveDown',
      DELETE_CONFIRMATION: 'ui.collectionManager.deleteConfirmation',
      CONFIRM: 'ui.collectionManager.confirm',
      CANCEL: 'ui.collectionManager.cancel'
    }
  }
} as const;

/**
 * Type for type-safe access to translation keys
 */
export type TranslationKeyType = typeof TRANSLATION_KEYS; 