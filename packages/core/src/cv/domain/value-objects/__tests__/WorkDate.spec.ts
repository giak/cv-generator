import { describe, it, expect } from 'vitest'
import { WorkDate } from '../WorkDate'

describe('WorkDate Value Object', () => {
  describe('Create method', () => {
    it('should create a valid WorkDate with valid date', () => {
      // Arrange & Act
      const result = WorkDate.create('2020-01-01')
      
      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        const workDate = result.getValue()
        expect(workDate.getValue()).toBe('2020-01-01')
      }
    })
    
    it('should fail if date is empty', () => {
      // Arrange & Act
      const result = WorkDate.create('')
      
      // Assert
      expect(result.isSuccess).toBe(false)
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBe('La date est requise')
      }
    })
    
    it('should fail if date format is invalid', () => {
      // Arrange & Act
      const result = WorkDate.create('01-01-2020') // Wrong format
      
      // Assert
      expect(result.isSuccess).toBe(false)
      if (result.isFailure) {
        expect(result.error).toBe('La date doit être au format YYYY-MM-DD')
      }
    })
    
    it('should fail if date is invalid', () => {
      // Arrange & Act
      const result = WorkDate.create('2020-13-40') // Invalid date
      
      // Assert
      expect(result.isSuccess).toBe(false)
      if (result.isFailure) {
        expect(result.error).toBe('Date invalide')
      }
    })
  })
  
  describe('Comparison methods', () => {
    it('should correctly compare two dates with isBefore', () => {
      // Arrange
      const date1 = WorkDate.create('2020-01-01').getValue()
      const date2 = WorkDate.create('2020-02-01').getValue()
      
      // Act & Assert
      expect(date1.isBefore(date2)).toBe(true)
      expect(date2.isBefore(date1)).toBe(false)
    })
    
    it('should correctly compare two dates with isAfter', () => {
      // Arrange
      const date1 = WorkDate.create('2020-01-01').getValue()
      const date2 = WorkDate.create('2020-02-01').getValue()
      
      // Act & Assert
      expect(date1.isAfter(date2)).toBe(false)
      expect(date2.isAfter(date1)).toBe(true)
    })
    
    it('should correctly determine if dates are equal', () => {
      // Arrange
      const date1 = WorkDate.create('2020-01-01').getValue()
      const date2 = WorkDate.create('2020-01-01').getValue()
      const date3 = WorkDate.create('2020-02-01').getValue()
      
      // Act & Assert
      expect(date1.equals(date2)).toBe(true)
      expect(date1.equals(date3)).toBe(false)
    })
  })
  
  describe('Formatting methods', () => {
    it('should format date to local date string', () => {
      // Arrange
      const date = WorkDate.create('2020-01-01').getValue()
      
      // Act & Assert - The exact format depends on the locale
      expect(date.toLocaleDateString('en-US')).toBe('1/1/2020')
      expect(date.toLocaleDateString('fr-FR')).toBe('01/01/2020')
    })
    
    it('should format date to month and year string', () => {
      // Arrange
      const date = WorkDate.create('2020-01-01').getValue()
      
      // Act & Assert
      expect(date.toMonthYearString('en-US')).toBe('January 2020')
      expect(date.toMonthYearString('fr-FR')).toBe('janvier 2020')
    })
  })
  
  describe('Duration calculation', () => {
    it('should calculate months between two dates', () => {
      // Arrange
      const startDate = WorkDate.create('2020-01-01').getValue()
      const endDate = WorkDate.create('2020-07-01').getValue()
      
      // Act & Assert
      expect(startDate.monthsUntil(endDate)).toBe(6)
    })
    
    it('should handle years in months calculation', () => {
      // Arrange
      const startDate = WorkDate.create('2020-01-01').getValue()
      const endDate = WorkDate.create('2021-01-01').getValue()
      
      // Act & Assert
      expect(startDate.monthsUntil(endDate)).toBe(12)
    })
    
    it('should return negative months if end date is before start date', () => {
      // Arrange
      const startDate = WorkDate.create('2020-07-01').getValue()
      const endDate = WorkDate.create('2020-01-01').getValue()
      
      // Act & Assert
      expect(startDate.monthsUntil(endDate)).toBe(-6)
    })
  })
}) 