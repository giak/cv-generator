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
        position: 'Senior Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Led the development of a cloud-based application serving over 10,000 users. Implemented microservices architecture, CI/CD pipelines, and automated testing frameworks to improve developer productivity.',
        highlights: [
          'Reduced API response time by 40% through query optimization and caching strategies',
          'Implemented a new authentication system with multi-factor authentication'
        ]
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(validWork);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      expect(dateRangeSpy).toHaveBeenCalledWith(
        validWork.startDate,
        validWork.endDate,
        'work',
        mockI18n
      );
    });
    
    it('should fail with missing company name', () => {
      // Arrange
      const invalidWork: WorkInterface = {
        company: '',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(invalidWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const companyErrors = result.error.filter(e => e.field === 'company');
        expect(companyErrors.length).toBe(1);
        expect(companyErrors[0].message).toBe("Le nom de l'entreprise est requis");
        expect(companyErrors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_COMPANY);
      }
    });
    
    it('should fail with missing position', () => {
      // Arrange
      const invalidWork: WorkInterface = {
        company: 'Acme Inc.',
        position: '',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on various projects.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(invalidWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const positionErrors = result.error.filter(e => e.field === 'position');
        expect(positionErrors.length).toBe(1);
        expect(positionErrors[0].message).toBe("L'intitulé du poste est requis");
        expect(positionErrors[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_POSITION);
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
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(workWithVaguePosition);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && result.warnings) {
        const positionWarnings = result.warnings.filter(w => w.field === 'position');
        expect(positionWarnings.length).toBe(1);
        expect(positionWarnings[0].message).toBe("L'intitulé du poste est trop vague");
        expect(positionWarnings[0].i18nKey).toBe(WORK_VALIDATION_KEYS.VAGUE_POSITION);
        expect(positionWarnings[0].severity).toBe('warning');
      }
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
        isValid: false,
        errors: [{
          code: 'INVALID_DATE_FORMAT',
          message: 'Format de date invalide',
          field: 'startDate',
          i18nKey: DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT
        }]
      });
      
      // Act
      const result = validationService.validate(workWithInvalidDate);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const dateErrors = result.error.filter(e => e.field === 'startDate');
        expect(dateErrors.length).toBe(1);
        expect(dateErrors[0].message).toBe('Format de date invalide');
        expect(dateErrors[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
    
    it('should warn about brief description', () => {
      // Arrange
      const workWithBriefSummary: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Worked on projects.' // Too brief
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(workWithBriefSummary);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && result.warnings) {
        const summaryWarnings = result.warnings.filter(w => w.field === 'summary');
        expect(summaryWarnings.length).toBe(1);
        expect(summaryWarnings[0].message).toBe('Description trop succincte');
        expect(summaryWarnings[0].i18nKey).toBe(WORK_VALIDATION_KEYS.BRIEF_DESCRIPTION);
        expect(summaryWarnings[0].severity).toBe('warning');
      }
    });
    
    it('should warn about missing highlights', () => {
      // Arrange
      const workWithoutHighlights: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications and websites for clients in the finance sector. Worked with a team of 5 developers to deliver high-quality solutions.'
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      // Act
      const result = validationService.validate(workWithoutHighlights);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && result.warnings) {
        const highlightsWarnings = result.warnings.filter(w => w.field === 'highlights');
        expect(highlightsWarnings.length).toBe(1);
        expect(highlightsWarnings[0].message).toBe('Aucune réalisation notable mentionnée');
        expect(highlightsWarnings[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_HIGHLIGHTS);
        expect(highlightsWarnings[0].severity).toBe('warning');
      }
    });

    it('should fail validation for missing company', () => {
      const invalidWork: WorkInterface = {
        company: '',
        position: 'Senior Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Led development of cloud application',
        highlights: ['Improved performance']
      };
      
      // Mock DateRange.create to return a success result
      dateRangeSpy.mockReturnValue({ isValid: true });
      
      const result = validationService.validate(invalidWork);
      
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].message).toBe(mockI18n.translate(WORK_VALIDATION_KEYS.MISSING_COMPANY));
      }
      expect(dateRangeSpy).toHaveBeenCalledWith(
        invalidWork.startDate,
        invalidWork.endDate,
        'work',
        mockI18n
      );
    });

    it('should fail validation for invalid date range', () => {
      const invalidWork: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Senior Software Developer',
        startDate: '2022-01-01',
        endDate: '2020-12-31', // End date before start date
        summary: 'Led development of cloud application',
        highlights: ['Improved performance']
      };
      
      // Mock DateRange.create to return a failure result
      dateRangeSpy.mockReturnValue({ 
        isValid: false,
        errors: [{
          code: 'END_BEFORE_START',
          message: 'La date de fin doit être postérieure à la date de début',
          field: 'endDate',
          i18nKey: DATE_RANGE_VALIDATION_KEYS.END_BEFORE_START
        }]
      });
      
      const result = validationService.validate(invalidWork);
      
      expect(isFailure(result)).toBe(true);
      expect(dateRangeSpy).toHaveBeenCalledWith(
        invalidWork.startDate,
        invalidWork.endDate,
        'work',
        mockI18n
      );
    });
  });
  
  describe('validateField', () => {
    it('should validate company field correctly', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Senior Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Led development of cloud application'
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
        expect(result.error[0].message).toBe("Le nom de l'entreprise est requis");
        expect(result.error[0].i18nKey).toBe(WORK_VALIDATION_KEYS.MISSING_COMPANY);
      }
    });
    
    it('should validate startDate field correctly', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: '2020-01-01',
        endDate: '2022-12-31',
        summary: 'Developed software applications.'
      };
      
      // Act
      const result = validationService.validateField(work, 'startDate');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe('2020-01-01');
      }
    });
    
    it('should fail validating invalid startDate', () => {
      // Arrange
      const work: WorkInterface = {
        company: 'Acme Inc.',
        position: 'Software Developer',
        startDate: 'invalid-date',
        endDate: '2022-12-31',
        summary: 'Developed software applications.'
      };
      
      // Act
      const result = validationService.validateField(work, 'startDate');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].message).toBe('Format de date invalide');
        expect(result.error[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
  });
}); 