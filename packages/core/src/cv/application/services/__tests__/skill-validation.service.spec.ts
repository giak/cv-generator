import { describe, it, expect, beforeEach } from 'vitest';
import { SkillValidationService, SKILL_VALIDATION_KEYS, SkillInterface } from '../skill-validation.service';
import {
    ValidationLayerType,
    ERROR_CODES,
    isSuccess,
    isFailure,
    ValidationErrorInterface,
    ResultType
} from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../../shared/i18n/domain-i18n.port';

// Helper function to check if a result has warnings
function hasWarnings(result: ResultType<any>): boolean {
  return 'warnings' in result && !!result.warnings && result.warnings.length > 0;
}

// Helper function to get warnings from a result
function getWarnings(result: ResultType<any>): ValidationErrorInterface[] {
  return ('warnings' in result && result.warnings) ? result.warnings : [];
}

// Helper function to get errors from a failure result

describe('SkillValidationService with i18n', () => {
  let skillValidationService: SkillValidationService;
  
  beforeEach(() => {
    // Create a mock i18n adapter
    const mockI18n: DomainI18nPortInterface = {
      translate: (key: string) => {
        const translations: Record<string, string> = {
          [SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME]: 'Le nom de la compétence est requis',
          [SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME]: 'Nom de compétence trop court',
          [SKILL_VALIDATION_KEYS.GENERIC_SKILL]: 'Compétence trop générique',
          [SKILL_VALIDATION_KEYS.MISSING_KEYWORDS]: 'Aucun mot-clé associé',
          [SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL]: 'Niveau non reconnu'
        };
        return translations[key] || key;
      },
      exists: () => true
    };
    
    skillValidationService = new SkillValidationService(mockI18n);
  });

  describe('validate', () => {
    it('should validate correct skill data', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6', 'React']
      };

      const result = skillValidationService.validate(skill);
      expect(isSuccess(result)).toBe(true);
      expect(hasWarnings(result)).toBe(false);
    });

    it('should fail validation for missing skill name', () => {
      const skill: SkillInterface = {
        name: '',
        level: 'Expert',
        keywords: ['ES6', 'Framework']
      };

      const result = skillValidationService.validate(skill);
      expect(isFailure(result)).toBe(true);
      
      if (isFailure(result)) {
        const errors = result.error;
        const error = errors.find((e: ValidationErrorInterface) => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Le nom de la compétence est requis');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME);
        expect(error?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });

    it('should warn about brief skill name', () => {
      const skill: SkillInterface = {
        name: 'JS',
        level: 'Expert',
        keywords: ['WebDev']
      };

      const result = skillValidationService.validate(skill);
      expect(isSuccess(result)).toBe(true);
      expect(hasWarnings(result)).toBe(true);
      
      if (isSuccess(result) && hasWarnings(result)) {
        const warnings = getWarnings(result);
        const warning = warnings.find((w: ValidationErrorInterface) => w.code === ERROR_CODES.RESUME.SKILLS.BRIEF_SKILL_NAME);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Nom de compétence trop court');
        expect(warning?.i18nKey).toBe(SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME);
        expect(warning?.severity).toBe('warning');
      }
    });

    it('should warn about generic skill name', () => {
      const skill: SkillInterface = {
        name: 'skill',
        level: 'Expert',
        keywords: ['coding']
      };

      const result = skillValidationService.validate(skill);
      expect(isSuccess(result)).toBe(true);
      expect(hasWarnings(result)).toBe(true);
      
      if (isSuccess(result) && hasWarnings(result)) {
        const warnings = getWarnings(result);
        const warning = warnings.find((w: ValidationErrorInterface) => w.code === ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Compétence trop générique');
        expect(warning?.i18nKey).toBe(SKILL_VALIDATION_KEYS.GENERIC_SKILL);
        expect(warning?.severity).toBe('info');
      }
    });

    it('should warn about missing keywords', () => {
      const skill: SkillInterface = {
        name: 'TypeScript',
        level: 'Advanced',
        keywords: []
      };

      const result = skillValidationService.validate(skill);
      expect(isSuccess(result)).toBe(true);
      expect(hasWarnings(result)).toBe(true);
      
      if (isSuccess(result) && hasWarnings(result)) {
        const warnings = getWarnings(result);
        const warning = warnings.find((w: ValidationErrorInterface) => w.code === ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Aucun mot-clé associé');
        expect(warning?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS);
        expect(warning?.severity).toBe('info');
        expect(warning?.layer).toBe(ValidationLayerType.PRESENTATION);
      }
    });
  });

  describe('validateField', () => {
    it('should validate name field correctly', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6']
      };

      const result = skillValidationService.validateField(skill, 'name');
      expect(isSuccess(result)).toBe(true);
    });

    it('should fail validation for missing name field', () => {
      const skill: SkillInterface = {
        name: '',
        level: 'Expert',
        keywords: ['ES6']
      };

      const result = skillValidationService.validateField(skill, 'name');
      expect(isFailure(result)).toBe(true);
      
      if (isFailure(result)) {
        const errors = result.error;
        const error = errors.find((e: ValidationErrorInterface) => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Le nom de la compétence est requis');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME);
      }
    });

    it('should validate level field correctly', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6']
      };

      const result = skillValidationService.validateField(skill, 'level');
      expect(isSuccess(result)).toBe(true);
    });

    it('should validate keywords field correctly', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6', 'React']
      };

      const result = skillValidationService.validateField(skill, 'keywords');
      expect(isSuccess(result)).toBe(true);
    });

    it('should fail validation for missing keywords', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: []
      };

      const result = skillValidationService.validateField(skill, 'keywords');
      expect(isFailure(result)).toBe(true);
      
      if (isFailure(result)) {
        const errors = result.error;
        const error = errors.find((e: ValidationErrorInterface) => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Aucun mot-clé associé');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS);
      }
    });
  });
}); 