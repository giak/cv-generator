import { describe, expect, it } from 'vitest'
import { Basics } from '../Basics'
import type { BasicsType } from '../../validators/basicsSchema'

describe('Basics Entity', () => {
  const validBasicsData: BasicsType = {
    name: 'John Doe',
    label: 'Software Engineer',
    email: 'john@example.com',
    phone: '+1234567890',
    url: 'https://johndoe.com',
    summary: 'Experienced software engineer',
    image: 'https://example.com/photo.jpg',
    location: {
      address: '123 Main St',
      postalCode: '12345',
      city: 'San Francisco',
      countryCode: 'US',
      region: 'California'
    },
    profiles: [
      {
        network: 'LinkedIn',
        username: 'johndoe',
        url: 'https://linkedin.com/in/johndoe'
      }
    ]
  }

  describe('create', () => {
    it('should create a valid Basics entity with all fields', () => {
      const result = Basics.create(validBasicsData)

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      expect(basics.name).toBe(validBasicsData.name)
      expect(basics.email).toBe(validBasicsData.email)
      expect(basics.label).toBe(validBasicsData.label)
      expect(basics.location).toEqual(validBasicsData.location)
      expect(basics.profiles).toHaveLength(1)
      expect(basics.profiles[0]).toEqual(validBasicsData.profiles![0])
    })

    it('should create a valid Basics entity with only required fields', () => {
      const minimalData = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const result = Basics.create(minimalData)

      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      expect(basics.name).toBe(minimalData.name)
      expect(basics.email).toBe(minimalData.email)
      expect(basics.label).toBeUndefined()
      expect(basics.location).toBeUndefined()
      expect(basics.profiles).toEqual([])
    })

    it('should fail when name is empty', () => {
      const invalidData = {
        ...validBasicsData,
        name: ''
      }

      const result = Basics.create(invalidData)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('name')
    })

    it('should fail when email is invalid', () => {
      const invalidData = {
        ...validBasicsData,
        email: 'invalid-email'
      }

      const result = Basics.create(invalidData)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('email')
    })

    it('should fail when URL is invalid', () => {
      const invalidData = {
        ...validBasicsData,
        url: 'invalid-url'
      }

      const result = Basics.create(invalidData)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('url')
    })

    it('should fail when profile URL is invalid', () => {
      const invalidData = {
        ...validBasicsData,
        profiles: [{
          network: 'LinkedIn',
          username: 'johndoe',
          url: 'invalid-url'
        }]
      }

      const result = Basics.create(invalidData)

      expect(result.isFailure).toBe(true)
      if (!result.isFailure) return
      expect(result.error).toContain('profiles')
    })
  })

  describe('toJSON', () => {
    it('should return a valid JSON representation', () => {
      const result = Basics.create(validBasicsData)
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      const json = basics.toJSON()

      expect(json).toEqual(validBasicsData)
    })

    it('should omit undefined optional fields in JSON', () => {
      const minimalData = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const result = Basics.create(minimalData)
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      const json = basics.toJSON()

      expect(json).toEqual({
        name: minimalData.name,
        email: minimalData.email,
        profiles: []
      })
      expect(json.label).toBeUndefined()
      expect(json.location).toBeUndefined()
    })
  })

  describe('update', () => {
    it('should update fields with valid data', () => {
      const result = Basics.create(validBasicsData)
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      const updateData = {
        name: 'Jane Doe',
        label: 'Senior Engineer'
      }

      const updateResult = basics.update(updateData)

      expect(updateResult.isSuccess).toBe(true)
      if (!updateResult.isSuccess) return

      const updated = updateResult.getValue()
      expect(updated.name).toBe(updateData.name)
      expect(updated.label).toBe(updateData.label)
      expect(updated.email).toBe(validBasicsData.email)
    })

    it('should fail update with invalid data', () => {
      const result = Basics.create(validBasicsData)
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return

      const basics = result.getValue()
      const updateData = {
        email: 'invalid-email'
      }

      const updateResult = basics.update(updateData)

      expect(updateResult.isFailure).toBe(true)
      if (!updateResult.isFailure) return
      expect(updateResult.error).toContain('email')
    })
  })
}) 