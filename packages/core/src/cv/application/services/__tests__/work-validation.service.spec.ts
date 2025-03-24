import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkValidationService, WORK_VALIDATION_KEYS } from '../work-validation.service';
import { isSuccess, isFailure } from '@cv-generator/shared';
import type { WorkInterface } from '../work-validation.service';
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock';
import { DATE_RANGE_VALIDATION_KEYS, DateRange } from '../../../domain/value-objects/date-range.value-object';

describe('WorkValidationService', () => {
  // Create a mock i18n adapter with translations for testing
  const mockI18n = new MockDomainI18nAdapter({
    [WORK_VALIDATION_KEYS.MISSING_COMPANY]: "Le nom de l'entreprise est requis",
    [WORK_VALIDATION_KEYS.MISSING_POSITION]: "L'intitulé du poste est requis",
    [WORK_VALIDATION_KEYS.VAGUE_POSITION]: "L'intitulé du poste est trop vague",
    [WORK_VALIDATION_KEYS.MISSING_SUMMARY]: "La description du poste est requise",
    [WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION]: "Description trop succincte",
    [WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS]: "Aucune réalisation notable mentionnée",
    [WORK_VALIDATION_KEYS.VAGUE_HIGHLIGHTS]: "Réalisations peu précises",
    [DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE]: 'La date de début est requise',
    [DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT]: 'Format de date invalide',
    [DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START]: 'La date de fin doit être postérieure à la date de début'
  });

  // Create the validation service with the mock i18n adapter
  const validationService = new WorkValidationService(mockI18n);
  let dateRangeSpy: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    dateRangeSpy = vi.spyOn(DateRange, 'create');
  });

  describe('validate', () => {
    it('should validate valid work experience data', () => {
      // Arrange
      const validWork: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector. Worked with a team of 5 developers to deliver high-quality solutions.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(validWork);
      
      // Assert
      expect(result.success).toBe(true);
    });
    
    it('should fail with missing company name', () => {
      // Arrange
      const invalidWork: WorkInterface = {
        company: '',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector. Worked with a team of 5 developers to deliver high-quality solutions.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(invalidWork);
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("Le nom de l'entreprise est requis");
        expect(errors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_COMPANY);
      }
    });
    
    it('should fail with missing position', () => {
      // Arrange
      const invalidWork: WorkInterface = {
        company: 'Acme Inc.',
        position: '',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(invalidWork);
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("L'intitulé du poste est requis");
        expect(errors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_POSITION);
      }
    });
    
    it('should warn about vague position title', () => {
      // Arrange
      const workWithVaguePosition: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Dev', // Too vague
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector. Worked with a team of 5 developers to deliver high-quality solutions.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(workWithVaguePosition);
      
      // Assert
      expect(result.success).toBe(true);
      expect('warnings' in result).toBe(true);
    });
    
    it('should fail with invalid date format', () => {
      // Arrange
      const workWithInvalidDate: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: 'not-a-date',
        endDate: '2022-12-31',
        summary: 'Worked on various projects.'
      };
      
      // Mock DateRange.create to return a failure result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => true,
        getErrors: () => [{
          code: 'INVALID_DATE_FORMAT',
          message: 'Format de date invalide',
          field: 'startDate',
          i18nKey: DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT
        }]
      });
      
      // Act
      const result = validationService.validate(workWithInvalidDate);
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("Format de date invalide");
        expect(errors[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
    
    it('should warn about brief description', () => {
      // Arrange
      const workWithBriefSummary: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Brief summary.' // Too short
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(workWithBriefSummary);
      
      // Assert
      expect(result.success).toBe(true);
      expect('warnings' in result).toBe(true);
    });
    
    it('should warn about missing highlights', () => {
      // Arrange
      const workWithoutHighlights: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector. Worked with a team of 5 developers to deliver high-quality solutions.'
        // No highlights
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(workWithoutHighlights);
      
      // Assert
      expect(result.success).toBe(true);
      expect('warnings' in result).toBe(true);
    });

    it('should fail validation for missing company', () => {
      // Arrange
      const invalidWorkExperience: WorkInterface = {
        company: '',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on enterprise applications.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ 
        isFailure: () => false 
      });
      
      // Act
      const result = validationService.validate(invalidWorkExperience);
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("Le nom de l'entreprise est requis");
        expect(errors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_COMPANY);
      }
    });

    it('should fail validation for invalid date range', () => {
      // Arrange
      const invalidWorkExperience: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Senior Developer',
        startDate: '2022-01-01',
        endDate: '2020-12-31', // End before start
        summary: 'Worked on enterprise applications.'
      };
      
      // Mock DateRange.create to return a failure result
      dateRangeSpy.mockReturnValue({
        isFailure: () => true,
        getErrors: () => [{
          code: 'END_BEFORE_START',
          message: 'La date de fin doit être postérieure à la date de début',
          field: 'endDate',
          i18nKey: DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START
        }]
      });
      
      // Act
      const result = validationService.validate(invalidWorkExperience);
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("La date de fin doit être postérieure à la date de début");
        expect(errors[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START);
      }
    });
  });
  
  describe('validateField', () => {
    it('should validate company field correctly', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Senior Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31'
      };
      
      // Act
      const result = validationService.validateField(work, 'company');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should fail validating empty company', () => {
      // Arrange
      const work: WorkInterface = {
        company: '',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications.'
      };
      
      // Act
      const result = validationService.validateField(work, 'company');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("Le nom de l'entreprise est requis");
        expect(errors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_COMPANY);
      }
    });
    
    it('should validate startDate field correctly', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({
        isFailure: () => false
      });
      
      // Act
      const result = validationService.validateField(work, 'startDate');
      
      // Assert
      expect(result.success).toBe(true);
    });
    
    it('should fail validating invalid startDate', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Developer',
        startDate: 'invalid-date',
        endDate: '2022-12-31'
      };
      
      // Mock DateRange.create to return a failure result
      dateRangeSpy.mockReturnValue({
        isFailure: () => true,
        getErrors: () => [{
          code: 'INVALID_DATE_FORMAT',
          message: 'Format de date invalide',
          field: 'startDate',
          i18nKey: DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT
        }]
      });
      
      // Act
      const result = validationService.validateField(work, 'startDate');
      
      // Assert
      expect(result.success).toBe(false);
      if (isFailure(result)) {
        const errors = result.getErrors();
        expect(errors[0].message).toBe("Format de date invalide");
        expect(errors[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
  });
}); 