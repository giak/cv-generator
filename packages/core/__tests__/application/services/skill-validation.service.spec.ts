/**
 * Tests pour le SkillValidationService
 */
import { describe, it, expect } from 'vitest';
import { SkillValidationService, SkillInterface, VALID_SKILL_LEVELS } from '../../../src/cv/application/services/skill-validation.service';
import { isSuccess, isFailure, ValidationLayerType, getWarnings } from '@cv-generator/shared';

describe('SkillValidationService', () => {
  let service: SkillValidationService;
  let validSkill: SkillInterface;
  
  beforeEach(() => {
    service = new SkillValidationService();
    
    // Préparer une compétence valide
    validSkill = {
      name: 'JavaScript',
      level: 'advanced',
      keywords: ['ES6+', 'TypeScript', 'Node.js', 'React']
    };
  });
  
  describe('validate', () => {
    it('should validate a complete valid skill', () => {
      // Act
      const result = service.validate(validSkill);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toEqual(validSkill);
      }
    });
    
    it('should fail when skill name is missing', () => {
      // Arrange
      const invalidSkill = { ...validSkill, name: '' };
      
      // Act
      const result = service.validate(invalidSkill);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const nameError = result.error.find(e => e.field === 'name');
        expect(nameError).toBeDefined();
        expect(nameError?.code).toBe('missing_skill_name');
        expect(nameError?.severity).toBe('error');
        expect(nameError?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });
    
    it('should warn when skill name is too short', () => {
      // Arrange
      const skillWithShortName = { ...validSkill, name: 'JS' }; // Trop court
      
      // Act
      const result = service.validate(skillWithShortName);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(getWarnings(result)).toBeDefined();
      const shortNameWarning = getWarnings(result).find((w: any) => w.code === 'brief_skill_name');
      expect(shortNameWarning).toBeDefined();
      expect(shortNameWarning.severity).toBe('warning');
      expect(shortNameWarning.layer).toBe(ValidationLayerType.APPLICATION);
    });
    
    it('should add info message when skill name is too generic', () => {
      // Arrange
      const skillWithGenericName = { ...validSkill, name: 'Programming' };
      
      // Act
      const result = service.validate(skillWithGenericName);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(getWarnings(result)).toBeDefined();
      const genericSkillInfo = getWarnings(result).find((w: any) => w.code === 'generic_skill');
      expect(genericSkillInfo).toBeDefined();
      expect(genericSkillInfo.severity).toBe('info');
      expect(genericSkillInfo.layer).toBe(ValidationLayerType.APPLICATION);
    });
    
    it('should warn when skill level is not recognized', () => {
      // Arrange
      const skillWithInvalidLevel = { ...validSkill, level: 'super-expert' }; // Niveau non standard
      
      // Act
      const result = service.validate(skillWithInvalidLevel);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      const levelWarning = getWarnings(result).find((w: any) => w.code === 'undefined_level');
      expect(levelWarning).toBeDefined();
      expect(levelWarning.severity).toBe('warning');
    });
    
    it('should recognize all valid skill levels', () => {
      // Test chaque niveau de compétence valide
      for (const level of VALID_SKILL_LEVELS) {
        const skill = { ...validSkill, level };
        const result = service.validate(skill);
        
        expect(isSuccess(result)).toBe(true);
        const warnings = getWarnings(result);
        const levelWarning = warnings.find((w: any) => w.code === 'undefined_level');
        expect(levelWarning).toBeUndefined();
      }
    });
    
    it('should add info message when keywords are missing', () => {
      // Arrange
      const skillWithoutKeywords = { ...validSkill, keywords: [] };
      
      // Act
      const result = service.validate(skillWithoutKeywords);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      const keywordsInfo = getWarnings(result).find((w: any) => w.code === 'missing_keywords');
      expect(keywordsInfo).toBeDefined();
      expect(keywordsInfo.severity).toBe('info');
      expect(keywordsInfo.layer).toBe(ValidationLayerType.PRESENTATION);
    });
  });
  
  describe('validateField', () => {
    it('should validate a specific field correctly - name', () => {
      // Act
      const result = service.validateField(validSkill, 'name');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe(validSkill.name);
      }
    });
    
    it('should validate a specific field correctly - level', () => {
      // Act
      const result = service.validateField(validSkill, 'level');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe(validSkill.level);
      }
    });
    
    it('should fail when validating a missing required field - name', () => {
      // Arrange
      const invalidSkill = { ...validSkill, name: '' };
      
      // Act
      const result = service.validateField(invalidSkill, 'name');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].code).toBe('missing_skill_name');
      }
    });
    
    it('should return warnings for fields with non-blocking issues', () => {
      // Arrangez - Nous allons tester un nom générique, qui devrait passer avec un avertissement
      const skillWithGenericName = { ...validSkill, name: 'Programming' };
      
      // Act
      const result = service.validateField(skillWithGenericName, 'name');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(getWarnings(result)).toBeDefined();
      expect(getWarnings(result)[0].code).toBe('generic_skill');
      expect(getWarnings(result)[0].severity).toBe('info');
    });
  });
}); 