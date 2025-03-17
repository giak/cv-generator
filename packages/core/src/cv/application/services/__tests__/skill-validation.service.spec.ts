import { describe, it, expect } from 'vitest';
import { SkillValidationService, SKILL_VALIDATION_KEYS, SkillInterface } from '../skill-validation.service';
import { ValidationLayerType, ERROR_CODES } from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../../shared/i18n/domain-i18n.port';

describe('SkillValidationService with i18n', () => {
  // Create a mock i18n adapter
  const mockI18n: DomainI18nPortInterface = {
    translate: (key: string) => {
      const translations: Record<string, string> = {
        [SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME]: 'Le nom de la compétence est requis',
        [SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME]: 'Nom de compétence trop court',
        [SKILL_VALIDATION_KEYS.GENERIC_SKILL]: 'Compétence trop générique',
        [SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL]: 'Niveau de compétence non reconnu',
        [SKILL_VALIDATION_KEYS.MISSING_KEYWORDS]: 'Aucun mot-clé associé'
      };
      return translations[key] || key;
    },
    exists: () => true
  };

  const skillValidationService = new SkillValidationService(mockI18n);

  describe('validate', () => {
    it('should validate correct skill data', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6', 'React', 'Node.js']
      };

      const result = skillValidationService.validate(skill);
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing skill name', () => {
      const skill: SkillInterface = {
        name: '',
        level: 'Intermediate',
        keywords: ['ES6', 'Framework']
      };

      const result = skillValidationService.validate(skill);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Le nom de la compétence est requis');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME);
        expect(error?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });

    it('should fail validation for brief skill name', () => {
      const skill: SkillInterface = {
        name: 'JS',
        level: 'Expert',
        keywords: ['WebDev']
      };

      const result = skillValidationService.validate(skill);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.BRIEF_SKILL_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Nom de compétence trop court');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME);
        expect(error?.severity).toBe('warning');
      }
    });

    it('should fail validation for generic skill name', () => {
      const skill: SkillInterface = {
        name: 'skill',
        level: 'Expert',
        keywords: ['coding']
      };

      const result = skillValidationService.validate(skill);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Compétence trop générique');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.GENERIC_SKILL);
        expect(error?.severity).toBe('info');
      }
    });

    it('should warn about missing keywords', () => {
      const skill: SkillInterface = {
        name: 'TypeScript',
        level: 'Advanced',
        keywords: []
      };

      const result = skillValidationService.validate(skill);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Aucun mot-clé associé');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS);
        expect(error?.severity).toBe('info');
        expect(error?.layer).toBe(ValidationLayerType.PRESENTATION);
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
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing name field', () => {
      const skill: SkillInterface = {
        name: '',
        level: 'Expert',
        keywords: ['ES6']
      };

      const result = skillValidationService.validateField(skill, 'name');
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME);
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
      expect(result.success).toBe(true);
    });

    it('should validate keywords field correctly', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['ES6', 'React']
      };

      const result = skillValidationService.validateField(skill, 'keywords');
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing keywords', () => {
      const skill: SkillInterface = {
        name: 'JavaScript',
        level: 'Expert',
        keywords: []
      };

      const result = skillValidationService.validateField(skill, 'keywords');
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Aucun mot-clé associé');
        expect(error?.i18nKey).toBe(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS);
      }
    });
  });
}); 