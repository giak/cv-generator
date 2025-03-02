import { describe, it, expect } from 'vitest'
import { workSchema } from '../validators/resumeSchema'
import type { WorkInterface } from '../types/resume.interface'

describe('Work Schema Validation', () => {
  it('should validate a complete valid work entry', () => {
    // Arrange
    const validWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Senior Developer',
      url: 'https://acme.com',
      startDate: '2020-01-01',
      endDate: '2022-12-31',
      summary: 'Led development of various projects',
      highlights: ['Project A', 'Project B', 'Project C']
    }

    // Act
    const result = workSchema.safeParse(validWork)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should validate a minimal valid work entry', () => {
    // Arrange
    const minimalWork: Partial<WorkInterface> = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '2020-01-01'
    }

    // Act
    const result = workSchema.safeParse(minimalWork)

    // Assert
    expect(result.success).toBe(true)
  })

  it('should fail validation if name is missing', () => {
    // Arrange
    const invalidWork: Partial<WorkInterface> = {
      position: 'Developer',
      startDate: '2020-01-01'
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Required')
    }
  })

  it('should fail validation if position is missing', () => {
    // Arrange
    const invalidWork: Partial<WorkInterface> = {
      name: 'Acme Inc',
      startDate: '2020-01-01'
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Required')
    }
  })

  it('should fail validation if startDate is missing', () => {
    // Arrange
    const invalidWork: Partial<WorkInterface> = {
      name: 'Acme Inc',
      position: 'Developer'
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Required')
    }
  })

  it('should fail validation if startDate has invalid format', () => {
    // Arrange
    const invalidWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '01-01-2020' // Wrong format
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Date must be in YYYY-MM-DD format')
    }
  })

  it('should fail validation if startDate is not a valid date', () => {
    // Arrange
    const invalidWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '2020-13-40' // Invalid date value
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Invalid date value')
    }
  })

  it('should fail validation if url is not a valid URL', () => {
    // Arrange
    const invalidWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '2020-01-01',
      url: 'not-a-url'
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Invalid URL format')
    }
  })

  it('should fail validation if url does not start with http:// or https://', () => {
    // Arrange
    const invalidWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '2020-01-01',
      url: 'ftp://acme.com'
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('URL must start with http:// or https://')
    }
  })

  it('should fail validation if endDate is before startDate', () => {
    // Arrange
    const invalidWork: WorkInterface = {
      name: 'Acme Inc',
      position: 'Developer',
      startDate: '2020-01-01',
      endDate: '2019-12-31' // Before start date
    }

    // Act
    const result = workSchema.safeParse(invalidWork)

    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('End date must be after or equal to start date')
    }
  })
}) 