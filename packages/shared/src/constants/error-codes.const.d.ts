/**
 * Constantes pour les codes d'erreur
 * Suivent la structure définie dans message-systeme-catalogue.md
 */
export declare const ERROR_CODES: {
    readonly COMMON: {
        readonly INVALID_DATE_FORMAT: "invalid_date_format";
        readonly REQUIRED_FIELD: "required_field";
        readonly INVALID_FORMAT: "invalid_format";
        readonly TOO_LONG: "too_long";
        readonly TOO_SHORT: "too_short";
        readonly FUTURE_DATE: "future_date";
    };
    readonly SYSTEM: {
        readonly UNEXPECTED_ERROR: "unexpected_error";
        readonly EXTERNAL_SERVICE_ERROR: "external_service_error";
        readonly NETWORK_ERROR: "network_error";
        readonly PERMISSION_DENIED: "permission_denied";
    };
    readonly RESUME: {
        readonly BASICS: {
            readonly MISSING_NAME: "missing_name";
            readonly MISSING_EMAIL: "missing_email";
            readonly INVALID_EMAIL: "invalid_email";
            readonly PERSONAL_EMAIL: "personal_email";
            readonly MISSING_PHONE: "missing_phone";
            readonly INVALID_PHONE: "invalid_phone";
            readonly MISSING_LOCATION: "missing_location";
            readonly VAGUE_LOCATION: "vague_location";
            readonly MISSING_SUMMARY: "missing_summary";
            readonly BRIEF_SUMMARY: "brief_summary";
        };
        readonly WORK: {
            readonly MISSING_COMPANY: "missing_company";
            readonly VAGUE_POSITION: "vague_position";
            readonly MISSING_POSITION: "missing_position";
            readonly MISSING_START_DATE: "missing_start_date";
            readonly END_BEFORE_START: "end_before_start";
            readonly FUTURE_DATE: "future_date";
            readonly MISSING_SUMMARY: "missing_summary";
            readonly BRIEF_DESCRIPTION: "brief_description";
            readonly MISSING_HIGHLIGHTS: "missing_highlights";
            readonly VAGUE_HIGHLIGHTS: "vague_highlights";
        };
        readonly SKILLS: {
            readonly MISSING_SKILL_NAME: "missing_skill_name";
            readonly BRIEF_SKILL_NAME: "brief_skill_name";
            readonly UNDEFINED_LEVEL: "undefined_level";
            readonly MISSING_KEYWORDS: "missing_keywords";
            readonly GENERIC_SKILL: "generic_skill";
        };
        readonly EDUCATION: {
            readonly MISSING_INSTITUTION: "missing_institution";
            readonly MISSING_AREA: "missing_area";
            readonly MISSING_STUDY_TYPE: "missing_study_type";
            readonly MISSING_START_DATE: "missing_start_date";
            readonly END_BEFORE_START: "end_before_start";
            readonly MISSING_GPA: "missing_gpa";
            readonly VAGUE_COURSES: "vague_courses";
        };
        readonly PROJECT: {
            readonly MISSING_PROJECT_NAME: "missing_project_name";
            readonly MISSING_DESCRIPTION: "missing_description";
            readonly BRIEF_DESCRIPTION: "brief_description";
            readonly MISSING_START_DATE: "missing_start_date";
            readonly MISSING_KEYWORDS: "missing_keywords";
            readonly MISSING_URL: "missing_url";
            readonly INVALID_URL: "invalid_url";
        };
        readonly VOLUNTEER: {
            readonly MISSING_ORGANIZATION: "missing_organization";
            readonly MISSING_POSITION: "missing_position";
            readonly MISSING_START_DATE: "missing_start_date";
            readonly MISSING_SUMMARY: "missing_summary";
            readonly BRIEF_SUMMARY: "brief_summary";
            readonly MISSING_HIGHLIGHTS: "missing_highlights";
        };
        readonly CERTIFICATE: {
            readonly MISSING_NAME: "missing_name";
            readonly MISSING_ISSUER: "missing_issuer";
            readonly MISSING_DATE: "missing_date";
            readonly FUTURE_DATE: "future_date";
            readonly MISSING_URL: "missing_url";
            readonly EXPIRED_CERTIFICATION: "expired_certification";
        };
        readonly PUBLICATION: {
            readonly MISSING_NAME: "missing_name";
            readonly MISSING_PUBLISHER: "missing_publisher";
            readonly MISSING_RELEASE_DATE: "missing_release_date";
            readonly FUTURE_DATE: "future_date";
            readonly MISSING_URL: "missing_url";
            readonly MISSING_SUMMARY: "missing_summary";
        };
        readonly LANGUAGE: {
            readonly MISSING_LANGUAGE: "missing_language";
            readonly MISSING_FLUENCY: "missing_fluency";
            readonly UNDEFINED_FLUENCY: "undefined_fluency";
            readonly REDUNDANT_LANGUAGE: "redundant_language";
        };
        readonly AWARD: {
            readonly MISSING_TITLE: "missing_title";
            readonly MISSING_DATE: "missing_date";
            readonly MISSING_AWARDER: "missing_awarder";
            readonly MISSING_SUMMARY: "missing_summary";
            readonly FUTURE_DATE: "future_date";
        };
        readonly INTEREST: {
            readonly MISSING_NAME: "missing_name";
            readonly BRIEF_NAME: "brief_name";
            readonly MISSING_KEYWORDS: "missing_keywords";
        };
        readonly REFERENCE: {
            readonly MISSING_NAME: "missing_name";
            readonly MISSING_REFERENCE: "missing_reference";
            readonly BRIEF_REFERENCE: "brief_reference";
            readonly MISSING_POSITION: "missing_position";
            readonly MISSING_COMPANY: "missing_company";
        };
    };
};
/**
 * Type pour l'autocomplétion et la sécurité de type des codes d'erreur
 */
export type ErrorCodeType = typeof ERROR_CODES;
