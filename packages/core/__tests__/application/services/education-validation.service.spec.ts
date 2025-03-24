/**
 * Tests pour le EducationValidationService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EducationValidationService, EducationInterface } from '../../../src/cv/application/services/education-validation.service';
import { isSuccess, isFailure, ValidationLayerType } from '@cv-generator/shared';
import { DateRange } from '../../../src/cv/domain/value-objects/date-range.value-object';

// Mock du Value Object DateRange
vi.mock('../../../src/cv/domain/value-objects/date-range.value-object', () => {
  return {
    DateRange: {
      create: vi.fn()
    }
  };
});

describe('EducationValidationService', () => {
  let service: EducationValidationService;
  let validEducation: EducationInterface;
  
  beforeEach(() => {
    service = new EducationValidationService();
    
    // Réinitialiser le mock de DateRange.create
    vi.mocked(DateRange.create).mockReset();
    
    // Configuration par défaut (succès)
    vi.mocked(DateRange.create).mockReturnValue({
      success: true,
      value: {
        getStartDate: () => new Date('2018-09-01'),
        getEndDate: () => new Date('2022-06-30'),
        isOngoing: () => false,
        getDurationInMonths: () => 48
      }
    });
    
    // Préparer une formation valide
    validEducation = {
      institution: 'Université Paris-Saclay',
      area: 'Computer Science',
      studyType: 'Master of Science',
      startDate: '2018-09-01',
      endDate: '2022-06-30',
      gpa: '16/20 - Mention Très Bien',
      courses: ['Algorithms', 'Software Architecture', 'Machine Learning', 'Web Development']
    };
  });
  
  describe('validate', () => {
    it('should validate a complete valid education', () => {
      // Act
      const result = service.validate(validEducation);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toEqual(validEducation);
      }
      
      // Vérifier que DateRange.create a été appelé
      expect(DateRange.create).toHaveBeenCalledWith(
        validEducation.startDate,
        validEducation.endDate,
        'education',
        expect.anything()
      );
    });
    
    it('should fail when institution is missing', () => {
      // Arrange
      const invalidEducation = { ...validEducation, institution: '' };
      
      // Act
      const result = service.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const institutionError = result.error.find(e => e.field === 'institution');
        expect(institutionError).toBeDefined();
        expect(institutionError?.code).toBe('missing_institution');
        expect(institutionError?.severity).toBe('error');
        expect(institutionError?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });
    
    it('should fail when area is missing', () => {
      // Arrange
      const invalidEducation = { ...validEducation, area: '' };
      
      // Act
      const result = service.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const areaError = result.error.find(e => e.field === 'area');
        expect(areaError).toBeDefined();
        expect(areaError?.code).toBe('missing_area');
      }
    });
    
    it('should fail when studyType is missing', () => {
      // Arrange
      const invalidEducation = { ...validEducation, studyType: '' };
      
      // Act
      const result = service.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const studyTypeError = result.error.find(e => e.field === 'studyType');
        expect(studyTypeError).toBeDefined();
        expect(studyTypeError?.code).toBe('missing_study_type');
      }
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
      const result = service.validate(validEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const dateError = result.error.find(e => e.field === 'startDate');
        expect(dateError).toBeDefined();
        expect(dateError?.code).toBe('missing_start_date');
      }
    });
    
    it('should add info message when gpa is missing', () => {
      // Arrange
      const educationWithoutGpa = { ...validEducation, gpa: undefined };
      
      // Act
      const result = service.validate(educationWithoutGpa);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // @ts-ignore: Testing the extended ResultType with warnings
      const gpaInfo = result.warnings.find((w: any) => w.code === 'missing_gpa');
      expect(gpaInfo).toBeDefined();
      expect(gpaInfo.severity).toBe('info');
      expect(gpaInfo.layer).toBe(ValidationLayerType.APPLICATION);
    });
    
    it('should add info message when courses are vague', () => {
      // Arrange
      const educationWithVagueCourses = { 
        ...validEducation, 
        courses: ['Module 1', 'Course 2', 'Project 3'] // Cours vagues
      };
      
      // Act
      const result = service.validate(educationWithVagueCourses);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // @ts-ignore: Testing the extended ResultType with warnings
      const vagueCoursesInfo = result.warnings.find((w: any) => w.code === 'vague_courses');
      expect(vagueCoursesInfo).toBeDefined();
      expect(vagueCoursesInfo.severity).toBe('info');
      expect(vagueCoursesInfo.layer).toBe(ValidationLayerType.PRESENTATION);
    });
  });
  
  describe('validateField', () => {
    it('should validate a specific field correctly - institution', () => {
      // Act
      const result = service.validateField(validEducation, 'institution');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe(validEducation.institution);
      }
    });
    
    it('should fail when validating a missing required field - area', () => {
      // Arrange
      const invalidEducation = { ...validEducation, area: '' };
      
      // Act
      const result = service.validateField(invalidEducation, 'area');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].code).toBe('missing_area');
      }
    });
    
    it('should validate dates using DateRange', () => {
      // Act
      const result = service.validateField(validEducation, 'startDate');
      
      // Assert
      expect(DateRange.create).toHaveBeenCalled();
      // Les dates sont validées ensemble dans DateRange.create
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should handle date validation failure in validateField', () => {
      // Arrange - Mock DateRange.create pour retourner une erreur sur endDate
      vi.mocked(DateRange.create).mockReturnValue({
        success: false,
        error: [{
          code: 'end_before_start',
          message: 'La date de fin précède la date de début',
          field: 'endDate',
          severity: 'error',
          layer: ValidationLayerType.DOMAIN
        }]
      });
      
      // Act - On teste d'abord avec le champ startDate (différent de endDate)
      const result = service.validateField(validEducation, 'startDate');
      
      // Assert
      expect(isSuccess(result)).toBe(true); // Car l'erreur est sur un autre champ (endDate)
      
      // Valider maintenant avec le bon champ qui devrait échouer
      const resultForEndDate = service.validateField(validEducation, 'endDate');
      expect(isFailure(resultForEndDate)).toBe(true);
    });
    
    it('should return info message for missing gpa in validateField', () => {
      // Arrange
      const educationWithoutGpa = { ...validEducation, gpa: undefined };
      
      // Act
      const result = service.validateField(educationWithoutGpa, 'gpa');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      // @ts-ignore: Testing the extended ResultType with warnings
      expect(result.warnings).toBeDefined();
      // @ts-ignore: Testing the extended ResultType with warnings
      expect(result.warnings[0].code).toBe('missing_gpa');
      // @ts-ignore: Testing the extended ResultType with warnings
      expect(result.warnings[0].severity).toBe('info');
    });
  });
}); 