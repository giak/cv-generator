import { describe, it, expect } from 'vitest';
import { ProjectValidationService, PROJECT_VALIDATION_KEYS, ProjectInterface } from '../project-validation.service';
import { ValidationLayerType, ERROR_CODES } from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../../shared/i18n/domain-i18n.port';

describe('ProjectValidationService with i18n', () => {
  // Create a mock i18n adapter
  const mockI18n: DomainI18nPortInterface = {
    translate: (key: string) => {
      const translations: Record<string, string> = {
        [PROJECT_VALIDATION_KEYS.MISSING_NAME]: 'Le nom du projet est requis',
        [PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION]: 'La description du projet est requise',
        [PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION]: 'Description trop succincte',
        [PROJECT_VALIDATION_KEYS.MISSING_ROLE]: 'Rôle non spécifié',
        [PROJECT_VALIDATION_KEYS.MISSING_HIGHLIGHTS]: 'Points forts non spécifiés',
        [PROJECT_VALIDATION_KEYS.MISSING_KEYWORDS]: 'Aucun mot-clé associé',
        [PROJECT_VALIDATION_KEYS.MISSING_START_DATE]: 'La date de début est requise',
        [PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT]: 'Format de date invalide'
      };
      return translations[key] || key;
    },
    exists: () => true
  };

  const projectValidationService = new ProjectValidationService(mockI18n);

  describe('validate', () => {
    it('should validate correct project data', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool with validation and export features. This project helps users create professional CVs with ease.',
        highlights: ['Clean Architecture', 'Domain-Driven Design'],
        keywords: ['TypeScript', 'Vue.js', 'Clean Architecture'],
        startDate: '2023-01',
        endDate: '2023-06',
        roles: ['Lead Developer', 'Architect'],
        entity: 'Personal Project',
        type: 'Web Application'
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing project name', () => {
      const project: ProjectInterface = {
        name: '',
        description: 'A comprehensive CV generation tool with validation and export features.',
        startDate: '2023-01',
        roles: ['Developer']
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Le nom du projet est requis');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.MISSING_NAME);
        expect(error?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });

    it('should fail validation for missing description', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: '',
        startDate: '2023-01',
        roles: ['Developer']
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.MISSING_DESCRIPTION);
        expect(error).toBeDefined();
        expect(error?.message).toBe('La description du projet est requise');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.MISSING_DESCRIPTION);
        expect(error?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });

    it('should fail validation for vague description', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A simple CV tool.',
        startDate: '2023-01',
        roles: ['Developer']
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.BRIEF_DESCRIPTION);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Description trop succincte');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.VAGUE_DESCRIPTION);
        expect(error?.severity).toBe('warning');
      }
    });

    it('should fail validation for invalid date format', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool with validation and export features.',
        startDate: '01/2023', // Invalid format
        roles: ['Developer']
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Format de date invalide');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT);
        expect(error?.field).toBe('startDate');
      }
    });

    it('should warn about missing roles', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool with validation and export features. This project helps users create professional CVs with ease.',
        startDate: '2023-01',
        roles: []
      };

      const result = projectValidationService.validate(project);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.MISSING_ROLE);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Rôle non spécifié');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.MISSING_ROLE);
        expect(error?.severity).toBe('warning');
      }
    });
  });

  describe('validateField', () => {
    it('should validate name field correctly', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool.',
        startDate: '2023-01'
      };

      const result = projectValidationService.validateField(project, 'name');
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing name field', () => {
      const project: ProjectInterface = {
        name: '',
        description: 'A comprehensive CV generation tool.',
        startDate: '2023-01'
      };

      const result = projectValidationService.validateField(project, 'name');
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.MISSING_PROJECT_NAME);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Le nom du projet est requis');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.MISSING_NAME);
      }
    });

    it('should validate startDate field correctly', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool.',
        startDate: '2023-01'
      };

      const result = projectValidationService.validateField(project, 'startDate');
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid startDate format', () => {
      const project: ProjectInterface = {
        name: 'CV Generator',
        description: 'A comprehensive CV generation tool.',
        startDate: '01/2023' // Invalid format
      };

      const result = projectValidationService.validateField(project, 'startDate');
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.PROJECT.INVALID_DATE_FORMAT);
        expect(error).toBeDefined();
        expect(error?.message).toBe('Format de date invalide');
        expect(error?.i18nKey).toBe(PROJECT_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
  });
}); 