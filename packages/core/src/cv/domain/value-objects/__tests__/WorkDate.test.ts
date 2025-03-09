import { describe, it, expect } from 'vitest'
import { WorkDate } from '../work-date.value-object'

describe('WorkDate', () => {
  describe('create', () => {
    it('should create a valid WorkDate', () => {
      // Arrange
      const validDate = '2022-01-15'
      
      // Act
      const dateResult = WorkDate.create(validDate)
      
      // Assert
      expect(dateResult.isSuccess).toBe(true)
      expect(dateResult.getValue().getValue()).toBe(validDate)
    })
    
    it('should fail with empty date', () => {
      // Arrange
      const emptyDate = ''
      
      // Act
      const dateResult = WorkDate.create(emptyDate)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe('La date est requise')
    })
    
    it('should fail with invalid format date', () => {
      // Arrange
      const invalidFormatDate = '15/01/2022' // Format DD/MM/YYYY au lieu de YYYY-MM-DD
      
      // Act
      const dateResult = WorkDate.create(invalidFormatDate)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe('La date doit être au format YYYY-MM-DD')
    })
    
    it('should fail with invalid date', () => {
      // Arrange
      const invalidDate = '2022-13-45' // Mois 13, jour 45 (invalides)
      
      // Act
      const dateResult = WorkDate.create(invalidDate)
      
      // Assert
      expect(dateResult.isFailure).toBe(true)
      expect(dateResult.error).toBe('Date invalide')
    })
  })
  
  describe('isBefore', () => {
    it('should return true when first date is before second date', () => {
      // Arrange
      const earlierDate = WorkDate.create('2020-01-01').getValue()
      const laterDate = WorkDate.create('2022-01-01').getValue()
      
      // Act
      const result = earlierDate.isBefore(laterDate)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when first date is not before second date', () => {
      // Arrange
      const date1 = WorkDate.create('2022-01-01').getValue()
      const date2 = WorkDate.create('2020-01-01').getValue()
      
      // Act
      const result = date1.isBefore(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('isAfter', () => {
    it('should return true when first date is after second date', () => {
      // Arrange
      const laterDate = WorkDate.create('2022-01-01').getValue()
      const earlierDate = WorkDate.create('2020-01-01').getValue()
      
      // Act
      const result = laterDate.isAfter(earlierDate)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when first date is not after second date', () => {
      // Arrange
      const date1 = WorkDate.create('2020-01-01').getValue()
      const date2 = WorkDate.create('2022-01-01').getValue()
      
      // Act
      const result = date1.isAfter(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('equals', () => {
    it('should return true when dates are equal', () => {
      // Arrange
      const date1 = WorkDate.create('2022-01-01').getValue()
      const date2 = WorkDate.create('2022-01-01').getValue()
      
      // Act
      const result = date1.equals(date2)
      
      // Assert
      expect(result).toBe(true)
    })
    
    it('should return false when dates are not equal', () => {
      // Arrange
      const date1 = WorkDate.create('2022-01-01').getValue()
      const date2 = WorkDate.create('2020-01-01').getValue()
      
      // Act
      const result = date1.equals(date2)
      
      // Assert
      expect(result).toBe(false)
    })
  })
  
  describe('formatting methods', () => {
    it('should format to local date string', () => {
      // Arrange
      const date = WorkDate.create('2022-01-15').getValue()
      
      // Act
      const formatted = date.toLocaleDateString('en-US')
      
      // Assert
      expect(formatted).toBe('1/15/2022')
    })
    
    it('should format to month and year', () => {
      // Arrange
      const date = WorkDate.create('2022-01-15').getValue()
      
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
      const date = WorkDate.create(rawDate).getValue()
      
      // Act
      const value = date.getValue()
      
      // Assert
      expect(value).toBe(rawDate)
    })
  })
  
  describe('duration calculation', () => {
    it('should calculate months between two dates', () => {
      // Arrange
      const startDate = WorkDate.create('2020-01-01').getValue()
      const endDate = WorkDate.create('2021-01-01').getValue()
      
      // Act
      const months = startDate.monthsUntil(endDate)
      
      // Assert
      expect(months).toBe(12)
    })
  })
}) 