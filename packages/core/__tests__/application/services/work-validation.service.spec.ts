/**
 * Tests pour le WorkValidationService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkValidationService, WorkInterface } from '../../../src/cv/application/services/work-validation.service';
import { isSuccess, isFailure, ValidationLayerType, getWarnings } from '@cv-generator/shared';
import { DateRange } from '../../../src/cv/domain/value-objects/date-range.value-object';

// Mock du Value Object DateRange
vi.mock('../../../src/cv/domain/value-objects/date-range.value-object', () => {
  return {
    DateRange: {
      create: vi.fn()
    }
  };
});

describe('WorkValidationService', () => {
  let service: WorkValidationService;
  let validWork: WorkInterface;
  
  beforeEach(() => {
    service = new WorkValidationService();
    
    // Réinitialiser le mock de DateRange.create
    vi.mocked(DateRange.create).mockReset();
    
    // Configuration par défaut (succès)
    vi.mocked(DateRange.create).mockReturnValue({
      success: true,
      value: {
        getStartDate: () => new Date('2023-01-15'),
        getEndDate: () => new Date('2023-12-31'),
        isOngoing: () => false,
        getDurationInMonths: () => 12
      }
    });
    
    // Préparer une expérience professionnelle valide
    validWork = {
      company: 'Tech Company',
      position: 'Senior Developer',
      startDate: '2023-01-15',
      endDate: '2023-12-31',
      summary: 'Worked on various projects including a large-scale redesign of the main application. Led a team of developers and implemented CI/CD processes.',
      highlights: [
        'Improved application performance by 40% through code optimization',
        'Mentored junior developers and established coding standards',
        'Implemented automated testing that increased test coverage to 85%'
      ]
    };
  });
  
  describe('validate', () => {
    it('should validate a complete valid work experience', () => {
      // Act
      const result = service.validate(validWork);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toEqual(validWork);
      }
      
      // Vérifier que DateRange.create a été appelé
      expect(DateRange.create).toHaveBeenCalledWith(
        validWork.startDate,
        validWork.endDate,
        'work',
        expect.anything() // Accepter n'importe quel adaptateur i18n comme 4ème paramètre
      );
    });
    
    it('should fail when company is missing', () => {
      // Arrange
      const invalidWork = { ...validWork, company: '' };
      
      // Act
      const result = service.validate(invalidWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const companyError = result.error.find(e => e.field === 'company');
        expect(companyError).toBeDefined();
        expect(companyError?.code).toBe('missing_company');
        expect(companyError?.severity).toBe('error');
        expect(companyError?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });
    
    it('should fail when position is missing', () => {
      // Arrange
      const invalidWork = { ...validWork, position: '' };
      
      // Act
      const result = service.validate(invalidWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const positionError = result.error.find(e => e.field === 'position');
        expect(positionError).toBeDefined();
        expect(positionError?.code).toBe('missing_position');
      }
    });
    
    it('should warn when position is too vague', () => {
      // Arrange
      const workWithVaguePosition = { ...validWork, position: 'Dev' }; // Trop court/vague
      
      // Act
      const result = service.validate(workWithVaguePosition);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // Use getWarnings instead of directly accessing warnings
      expect(getWarnings(result)).toBeDefined();
      const vaguePositionWarning = getWarnings(result).find((w: any) => w.code === 'vague_position');
      expect(vaguePositionWarning).toBeDefined();
      expect(vaguePositionWarning.severity).toBe('warning');
      expect(vaguePositionWarning.layer).toBe(ValidationLayerType.APPLICATION);
    });
    
    it('should fail when date validation fails', () => {
      // Arrange - Mock DateRange.create pour retourner une erreur
      vi.mocked(DateRange.create).mockReturnValue({
        success: false,
        error: [{
          code: 'missing_start_date',
          message: 'La date de début est requise',
          field: 'startDate',
          severity: 'error',
          layer: ValidationLayerType.DOMAIN
        }]
      });
      
      // Act
      const result = service.validate(validWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const dateError = result.error.find(e => e.field === 'startDate');
        expect(dateError).toBeDefined();
        expect(dateError?.code).toBe('missing_start_date');
      }
    });
    
    it('should fail when summary is missing', () => {
      // Arrange
      const invalidWork = { ...validWork, summary: '' };
      
      // Act
      const result = service.validate(invalidWork);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const summaryError = result.error.find(e => e.field === 'summary');
        expect(summaryError).toBeDefined();
        expect(summaryError?.code).toBe('missing_summary');
        expect(summaryError?.layer).toBe(ValidationLayerType.APPLICATION);
      }
    });
    
    it('should warn when summary is too brief', () => {
      // Arrange
      const workWithBriefSummary = { ...validWork, summary: 'Developed software' }; // Trop court
      
      // Act
      const result = service.validate(workWithBriefSummary);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // Use getWarnings instead of directly accessing warnings
      const briefSummaryWarning = getWarnings(result).find((w: any) => w.code === 'brief_description');
      expect(briefSummaryWarning).toBeDefined();
      expect(briefSummaryWarning.severity).toBe('warning');
    });
    
    it('should warn when highlights are missing', () => {
      // Arrange
      const workWithoutHighlights = { ...validWork, highlights: [] };
      
      // Act
      const result = service.validate(workWithoutHighlights);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // Use getWarnings instead of directly accessing warnings
      const missingHighlightsWarning = getWarnings(result).find((w: any) => w.code === 'missing_highlights');
      expect(missingHighlightsWarning).toBeDefined();
      expect(missingHighlightsWarning.severity).toBe('warning');
      expect(missingHighlightsWarning.layer).toBe(ValidationLayerType.APPLICATION);
    });
    
    it('should include info level message when highlights are vague', () => {
      // Arrange
      const workWithVagueHighlights = { 
        ...validWork, 
        highlights: ['Improved performance', 'Fixed bugs', 'Led team'] // Trop vagues/courts
      };
      
      // Act
      const result = service.validate(workWithVagueHighlights);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // Use getWarnings instead of directly accessing warnings
      const vagueHighlightsInfo = getWarnings(result).find((w: any) => w.code === 'vague_highlights');
      expect(vagueHighlightsInfo).toBeDefined();
      expect(vagueHighlightsInfo.severity).toBe('info');
      expect(vagueHighlightsInfo.layer).toBe(ValidationLayerType.PRESENTATION);
    });
  });
  
  describe('validateField', () => {
    it('should validate a specific field correctly - company', () => {
      // Act
      const result = service.validateField(validWork, 'company');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe(validWork.company);
      }
    });
    
    it('should fail when validating a missing required field - company', () => {
      // Arrange
      const invalidWork = { ...validWork, company: '' };
      
      // Act
      const result = service.validateField(invalidWork, 'company');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].code).toBe('missing_company');
      }
    });
    
    it('should validate dates using DateRange', () => {
      // Act
      const result = service.validateField(validWork, 'startDate');
      
      // Assert
      expect(DateRange.create).toHaveBeenCalled();
      // Les dates sont validées ensemble dans DateRange.create
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should handle date validation failure in validateField', () => {
      // Arrange - Mock DateRange.create pour retourner une erreur sur startDate
      vi.mocked(DateRange.create).mockReturnValue({
        success: false,
        error: [{
          code: 'missing_start_date',
          message: 'La date de début est requise',
          field: 'startDate',
          severity: 'error',
          layer: ValidationLayerType.DOMAIN
        }]
      });
      
      // Act
      const result = service.validateField(validWork, 'startDate');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].code).toBe('missing_start_date');
      }
    });
    
    it('should return warnings for fields with non-blocking issues', () => {
      // Arrange
      const workWithVaguePosition = { ...validWork, position: 'Dev' }; // Trop court/vague
      
      // Act
      const result = service.validateField(workWithVaguePosition, 'position');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // @ts-ignore: Testing the extended ResultType with warnings
      expect(getWarnings(result)).toBeDefined();
      // Use getWarnings instead of directly accessing warnings
      expect(getWarnings(result)[0].code).toBe('vague_position');
      // @ts-ignore: Testing the extended ResultType with warnings
      expect(getWarnings(result)[0].severity).toBe('warning');
    });
  });
}); 