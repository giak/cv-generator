import { describe, it, expect } from 'vitest';
import { WorkDate } from '../work-date.value-object';
import { MockDomainI18nAdapter } from '../../../../shared/i18n/__mocks__/i18n.mock';

// Importing the same keys as defined in the WorkDate value object
const DATE_VALIDATION_KEYS = {
  MISSING_DATE: "resume.common.validation.missingDate",
  INVALID_DATE_FORMAT: "resume.common.validation.invalidDateFormat",
  INVALID_DATE: "resume.common.validation.invalidDate"
};

describe('WorkDate', () => {
  // Create a mock i18n adapter for testing
  const mockI18n = new MockDomainI18nAdapter({
    [DATE_VALIDATION_KEYS.MISSING_DATE]: "La date est requise",
    [DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT]: "La date doit être au format YYYY-MM-DD",
    [DATE_VALIDATION_KEYS.INVALID_DATE]: "Date invalide"
  });

  describe('create', () => {
    it('should create a valid WorkDate', () => {
      // Arrange
      const validDate = '2022-01-15'
      
      // Act
      const dateResult = WorkDate.create(validDate, mockI18n)
      
      // Assert
      expect(dateResult.isSuccess).toBe(true)
      if (!dateResult.isSuccess || !dateResult.getValue) return
      expect(dateResult.getValue().getValue()).toBe(validDate)
    })
    
    it('should fail with empty date', () => {
      // Arrange
      const emptyDate = ''
      
      // Act
      const dateResult = WorkDate.create(emptyDate, mockI18n)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe(mockI18n.translate(DATE_VALIDATION_KEYS.MISSING_DATE))
    })
    
    it('should fail with invalid format date', () => {
      // Arrange
      const invalidFormatDate = '15/01/2022' // Format DD/MM/YYYY au lieu de YYYY-MM-DD
      
      // Act
      const dateResult = WorkDate.create(invalidFormatDate, mockI18n)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe(mockI18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE_FORMAT))
    })
    
    it('should fail with invalid date', () => {
      // Arrange
      const invalidDate = '2022-13-45' // Mois 13, jour 45 (invalides)
      
      // Act
      const dateResult = WorkDate.create(invalidDate, mockI18n)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe(mockI18n.translate(DATE_VALIDATION_KEYS.INVALID_DATE))
    })
  })
  
  describe('isBefore', () => {
    it('should return true when first date is before second date', () => {
      // Arrange
      const earlierDateResult = WorkDate.create('2020-01-01', mockI18n)
      const laterDateResult = WorkDate.create('2022-01-01', mockI18n)
      
      expect(earlierDateResult.isSuccess).toBe(true)
      expect(laterDateResult.isSuccess).toBe(true)
      if (!earlierDateResult.isSuccess || !laterDateResult.isSuccess ||
          !earlierDateResult.getValue || !laterDateResult.getValue) return
      
      const earlierDate = earlierDateResult.getValue()
      const laterDate = laterDateResult.getValue()
      
      // Act
      const result = earlierDate.isBefore(laterDate)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when first date is not before second date', () => {
      // Arrange
      const date1Result = WorkDate.create('2022-01-01', mockI18n)
      const date2Result = WorkDate.create('2020-01-01', mockI18n)
      
      expect(date1Result.isSuccess).toBe(true)
      expect(date2Result.isSuccess).toBe(true)
      if (!date1Result.isSuccess || !date2Result.isSuccess ||
          !date1Result.getValue || !date2Result.getValue) return
      
      const date1 = date1Result.getValue()
      const date2 = date2Result.getValue()
      
      // Act
      const result = date1.isBefore(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('isAfter', () => {
    it('should return true when first date is after second date', () => {
      // Arrange
      const laterDateResult = WorkDate.create('2022-01-01', mockI18n)
      const earlierDateResult = WorkDate.create('2020-01-01', mockI18n)
      
      expect(laterDateResult.isSuccess).toBe(true)
      expect(earlierDateResult.isSuccess).toBe(true)
      if (!laterDateResult.isSuccess || !earlierDateResult.isSuccess ||
          !laterDateResult.getValue || !earlierDateResult.getValue) return
      
      const laterDate = laterDateResult.getValue()
      const earlierDate = earlierDateResult.getValue()
      
      // Act
      const result = laterDate.isAfter(earlierDate)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when first date is not after second date', () => {
      // Arrange
      const date1Result = WorkDate.create('2020-01-01', mockI18n)
      const date2Result = WorkDate.create('2022-01-01', mockI18n)
      
      expect(date1Result.isSuccess).toBe(true)
      expect(date2Result.isSuccess).toBe(true)
      if (!date1Result.isSuccess || !date2Result.isSuccess ||
          !date1Result.getValue || !date2Result.getValue) return
      
      const date1 = date1Result.getValue()
      const date2 = date2Result.getValue()
      
      // Act
      const result = date1.isAfter(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('equals', () => {
    it('should return true when dates are equal', () => {
      // Arrange
      const date1Result = WorkDate.create('2022-01-01', mockI18n)
      const date2Result = WorkDate.create('2022-01-01', mockI18n)
      
      expect(date1Result.isSuccess).toBe(true)
      expect(date2Result.isSuccess).toBe(true)
      if (!date1Result.isSuccess || !date2Result.isSuccess ||
          !date1Result.getValue || !date2Result.getValue) return
      
      const date1 = date1Result.getValue()
      const date2 = date2Result.getValue()
      
      // Act
      const result = date1.equals(date2)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when dates are not equal', () => {
      // Arrange
      const date1Result = WorkDate.create('2022-01-01', mockI18n)
      const date2Result = WorkDate.create('2020-01-01', mockI18n)
      
      expect(date1Result.isSuccess).toBe(true)
      expect(date2Result.isSuccess).toBe(true)
      if (!date1Result.isSuccess || !date2Result.isSuccess ||
          !date1Result.getValue || !date2Result.getValue) return
      
      const date1 = date1Result.getValue()
      const date2 = date2Result.getValue()
      
      // Act
      const result = date1.equals(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('formatting methods', () => {
    it('should format to local date string', () => {
      // Arrange
      const dateResult = WorkDate.create('2022-01-15', mockI18n)
      
      expect(dateResult.isSuccess).toBe(true)
      if (!dateResult.isSuccess || !dateResult.getValue) return
      
      const date = dateResult.getValue()
      
      // Act
      const formatted = date.toLocaleDateString('en-US')
      
      // Assert
      expect(formatted).toBe('1/15/2022')
    })
    
    it('should format to month and year', () => {
      // Arrange
      const dateResult = WorkDate.create('2022-01-15', mockI18n)
      
      expect(dateResult.isSuccess).toBe(true)
      if (!dateResult.isSuccess || !dateResult.getValue) return
      
      const date = dateResult.getValue()
      
      // Act
      const formatted = date.toMonthYearString('en-US')
      
      // Assert
      expect(formatted).toBe('January 2022')
    })
  })
  
  describe('getValue', () => {
    it('should return the raw date value', () => {
      // Arrange
      const rawDate = '2022-01-15'
      const dateResult = WorkDate.create(rawDate, mockI18n)
      
      expect(dateResult.isSuccess).toBe(true)
      if (!dateResult.isSuccess || !dateResult.getValue) return
      
      const date = dateResult.getValue()
      
      // Act
      const value = date.getValue()
      
      // Assert
      expect(value).toBe(rawDate)
    })
  })
  
  describe('duration calculation', () => {
    it('should calculate months between two dates', () => {
      // Arrange
      const startDateResult = WorkDate.create('2020-01-01', mockI18n)
      const endDateResult = WorkDate.create('2021-01-01', mockI18n)
      
      expect(startDateResult.isSuccess).toBe(true)
      expect(endDateResult.isSuccess).toBe(true)
      if (!startDateResult.isSuccess || !endDateResult.isSuccess ||
          !startDateResult.getValue || !endDateResult.getValue) return
      
      const startDate = startDateResult.getValue()
      const endDate = endDateResult.getValue()
      
      // Act
      const months = startDate.monthsUntil(endDate)
      
      // Assert
      expect(months).toBe(12)
    })
  })
}) 