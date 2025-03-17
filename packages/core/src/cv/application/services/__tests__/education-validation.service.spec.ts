import { describe, it, expect } from 'vitest';
import { EducationValidationService, EDUCATION_VALIDATION_KEYS } from '../education-validation.service';
import { isSuccess, isFailure } from '@cv-generator/shared';
import type { EducationInterface } from '../education-validation.service';
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock';
import { DATE_RANGE_VALIDATION_KEYS } from '../../../domain/value-objects/date-range.value-object';

describe('EducationValidationService', () => {
  // Create a mock i18n adapter with translations for testing
  const mockI18n = new MockDomainI18nAdapter({
    [EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION]: "Le nom de l'établissement est requis",
    [EDUCATION_VALIDATION_KEYS.MISSING_AREA]: "Le domaine d'études est requis",
    [EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE]: "Le type de diplôme est requis",
    [EDUCATION_VALIDATION_KEYS.MISSING_GPA]: "GPA ou mention non spécifiée",
    [EDUCATION_VALIDATION_KEYS.VAGUE_COURSES]: "Liste de cours trop vague",
    [DATE_RANGE_VALIDATION_KEYS.MISSING_START_DATE]: 'La date de début est requise',
    [DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT]: 'Format de date invalide'
  });

  // Create the validation service with the mock i18n adapter
  const validationService = new EducationValidationService(mockI18n);
  
  describe('validate', () => {
    it('should validate valid education data', () => {
      // Arrange
      const validEducation: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30',
        gpa: '3.9',
        courses: [
          'Advanced Algorithms',
          'Machine Learning',
          'Distributed Systems'
        ]
      };
      
      // Act
      const result = validationService.validate(validEducation);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
    });
    
    it('should fail with missing institution', () => {
      // Arrange
      const invalidEducation: EducationInterface = {
        institution: '',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const institutionErrors = result.error.filter(e => e.field === 'institution');
        expect(institutionErrors.length).toBe(1);
        expect(institutionErrors[0].message).toBe("Le nom de l'établissement est requis");
        expect(institutionErrors[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION);
      }
    });
    
    it('should fail with missing area', () => {
      // Arrange
      const invalidEducation: EducationInterface = {
        institution: 'Stanford University',
        area: '',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const areaErrors = result.error.filter(e => e.field === 'area');
        expect(areaErrors.length).toBe(1);
        expect(areaErrors[0].message).toBe("Le domaine d'études est requis");
        expect(areaErrors[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_AREA);
      }
    });
    
    it('should fail with missing study type', () => {
      // Arrange
      const invalidEducation: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: '',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validate(invalidEducation);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const studyTypeErrors = result.error.filter(e => e.field === 'studyType');
        expect(studyTypeErrors.length).toBe(1);
        expect(studyTypeErrors[0].message).toBe("Le type de diplôme est requis");
        expect(studyTypeErrors[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_STUDY_TYPE);
      }
    });
    
    it('should fail with invalid date format', () => {
      // Arrange
      const educationWithInvalidDate: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: 'not-a-date',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validate(educationWithInvalidDate);
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        const dateErrors = result.error.filter(e => e.field === 'startDate');
        expect(dateErrors.length).toBe(1);
        expect(dateErrors[0].message).toBe('Format de date invalide');
        expect(dateErrors[0].i18nKey).toBe(DATE_RANGE_VALIDATION_KEYS.INVALID_DATE_FORMAT);
      }
    });
    
    it('should add info for missing GPA', () => {
      // Arrange
      const educationWithoutGPA: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validate(educationWithoutGPA);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && result.warnings) {
        const gpaInfos = result.warnings.filter(w => w.field === 'gpa');
        expect(gpaInfos.length).toBe(1);
        expect(gpaInfos[0].message).toBe('GPA ou mention non spécifiée');
        expect(gpaInfos[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_GPA);
        expect(gpaInfos[0].severity).toBe('info');
      }
    });
    
    it('should add info for vague course descriptions', () => {
      // Arrange
      const educationWithVagueCourses: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30',
        courses: ['Course 1', 'Module 2', 'Project 3']
      };
      
      // Act
      const result = validationService.validate(educationWithVagueCourses);
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && result.warnings) {
        const courseInfos = result.warnings.filter(w => w.field === 'courses');
        expect(courseInfos.length).toBe(1);
        expect(courseInfos[0].message).toBe('Liste de cours trop vague');
        expect(courseInfos[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.VAGUE_COURSES);
        expect(courseInfos[0].severity).toBe('info');
      }
    });
  });
  
  describe('validateField', () => {
    it('should validate institution field correctly', () => {
      // Arrange
      const education: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validateField(education, 'institution');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe('Stanford University');
      }
    });
    
    it('should fail validating empty institution', () => {
      // Arrange
      const education: EducationInterface = {
        institution: '',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validateField(education, 'institution');
      
      // Assert
      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error[0].message).toBe("Le nom de l'établissement est requis");
        expect(result.error[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_INSTITUTION);
      }
    });
    
    it('should validate startDate field correctly', () => {
      // Arrange
      const education: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validateField(education, 'startDate');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value).toBe('2018-09-01');
      }
    });
    
    it('should return info for missing GPA field', () => {
      // Arrange
      const education: EducationInterface = {
        institution: 'Stanford University',
        area: 'Computer Science',
        studyType: 'Master of Science',
        startDate: '2018-09-01',
        endDate: '2020-06-30'
      };
      
      // Act
      const result = validationService.validateField(education, 'gpa');
      
      // Assert
      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result) && 'warnings' in result) {
        expect(result.warnings?.length).toBe(1);
        expect(result.warnings?.[0].message).toBe('GPA ou mention non spécifiée');
        expect(result.warnings?.[0].i18nKey).toBe(EDUCATION_VALIDATION_KEYS.MISSING_GPA);
        expect(result.warnings?.[0].severity).toBe('info');
      }
    });
  });
}); 