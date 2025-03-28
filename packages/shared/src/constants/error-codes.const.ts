/**
 * Constantes pour les codes d'erreur
 * Suivent la structure définie dans message-systeme-catalogue.md
 */

export const ERROR_CODES = {
  COMMON: {
    INVALID_DATE_FORMAT: "invalid_date_format",
    REQUIRED_FIELD: "required_field",
    INVALID_FORMAT: "invalid_format",
    TOO_LONG: "too_long",
    TOO_SHORT: "too_short",
    FUTURE_DATE: "future_date",
  },
  SYSTEM: {
    UNEXPECTED_ERROR: "unexpected_error",
    EXTERNAL_SERVICE_ERROR: "external_service_error",
    NETWORK_ERROR: "network_error",
    PERMISSION_DENIED: "permission_denied",
  },
  RESUME: {
    BASICS: {
      MISSING_NAME: "missing_name",
      MISSING_EMAIL: "missing_email",
      INVALID_EMAIL: "invalid_email",
      PERSONAL_EMAIL: "personal_email",
      MISSING_PHONE: "missing_phone",
      INVALID_PHONE: "invalid_phone",
      MISSING_LOCATION: "missing_location",
      VAGUE_LOCATION: "vague_location",
      MISSING_SUMMARY: "missing_summary",
      BRIEF_SUMMARY: "brief_summary",
    },
    WORK: {
      MISSING_COMPANY: "missing_company",
      VAGUE_POSITION: "vague_position",
      MISSING_POSITION: "missing_position",
      MISSING_START_DATE: "missing_start_date",
      END_BEFORE_START: "end_before_start",
      FUTURE_DATE: "future_date",
      MISSING_SUMMARY: "missing_summary",
      BRIEF_DESCRIPTION: "brief_description",
      MISSING_HIGHLIGHTS: "missing_highlights",
      VAGUE_HIGHLIGHTS: "vague_highlights",
    },
    SKILLS: {
      MISSING_SKILL_NAME: "missing_skill_name",
      BRIEF_SKILL_NAME: "brief_skill_name",
      UNDEFINED_LEVEL: "undefined_level",
      MISSING_KEYWORDS: "missing_keywords",
      GENERIC_SKILL: "generic_skill",
    },
    EDUCATION: {
      MISSING_INSTITUTION: "missing_institution",
      MISSING_AREA: "missing_area",
      MISSING_STUDY_TYPE: "missing_study_type",
      MISSING_START_DATE: "missing_start_date",
      END_BEFORE_START: "end_before_start",
      MISSING_GPA: "missing_gpa",
      VAGUE_COURSES: "vague_courses",
    },
    PROJECT: {
      MISSING_PROJECT_NAME: "missing_project_name",
      MISSING_DESCRIPTION: "missing_description",
      BRIEF_DESCRIPTION: "brief_description",
      MISSING_START_DATE: "missing_start_date",
      MISSING_KEYWORDS: "missing_keywords",
      MISSING_URL: "missing_url",
      INVALID_URL: "invalid_url",
      INVALID_DATE_FORMAT: "invalid_date_format",
      MISSING_ROLE: "missing_role",
      MISSING_HIGHLIGHTS: "missing_highlights"
    },
    VOLUNTEER: {
      MISSING_ORGANIZATION: "missing_organization",
      MISSING_POSITION: "missing_position",
      MISSING_START_DATE: "missing_start_date",
      MISSING_SUMMARY: "missing_summary",
      BRIEF_SUMMARY: "brief_summary",
      MISSING_HIGHLIGHTS: "missing_highlights",
    },
    CERTIFICATE: {
      MISSING_NAME: "missing_name",
      MISSING_ISSUER: "missing_issuer",
      MISSING_DATE: "missing_date",
      FUTURE_DATE: "future_date",
      MISSING_URL: "missing_url",
      EXPIRED_CERTIFICATION: "expired_certification",
    },
    PUBLICATION: {
      MISSING_NAME: "missing_name",
      MISSING_PUBLISHER: "missing_publisher",
      MISSING_RELEASE_DATE: "missing_release_date",
      FUTURE_DATE: "future_date",
      MISSING_URL: "missing_url",
      MISSING_SUMMARY: "missing_summary",
    },
    LANGUAGE: {
      MISSING_LANGUAGE: "missing_language",
      MISSING_FLUENCY: "missing_fluency",
      UNDEFINED_FLUENCY: "undefined_fluency",
      REDUNDANT_LANGUAGE: "redundant_language",
    },
    AWARD: {
      MISSING_TITLE: "missing_title",
      MISSING_DATE: "missing_date",
      MISSING_AWARDER: "missing_awarder",
      MISSING_SUMMARY: "missing_summary",
      FUTURE_DATE: "future_date",
    },
    INTEREST: {
      MISSING_NAME: "missing_name",
      BRIEF_NAME: "brief_name",
      MISSING_KEYWORDS: "missing_keywords",
    },
    REFERENCE: {
      MISSING_NAME: "missing_name",
      MISSING_REFERENCE: "missing_reference",
      BRIEF_REFERENCE: "brief_reference",
      MISSING_POSITION: "missing_position",
      MISSING_COMPANY: "missing_company",
    },
  },
} as const;

/**
 * Type pour l'autocomplétion et la sécurité de type des codes d'erreur
 */
export type ErrorCodeType = typeof ERROR_CODES; 