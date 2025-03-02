import { z } from 'zod'
import { ResumeInterface } from '../types/resume.interface'

/**
 * Zod schema for validating JSON Resume format
 * Based on the JSON Resume schema standard: https://jsonresume.org/schema/
 */
export const resumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string().default(''),
    image: z.string().default(''),
    email: z.string(),
    phone: z.string().default(''),
    url: z.string().default(''),
    summary: z.string().default(''),
    location: z.object({
      address: z.string().default(''),
      postalCode: z.string().default(''),
      city: z.string().default(''),
      countryCode: z.string().default(''),
      region: z.string().default('')
    }).optional(),
    profiles: z.array(z.object({
      network: z.string().default(''),
      username: z.string().default(''),
      url: z.string().default('')
    })).default([])
  }),
  work: z.array(z.object({
    name: z.string(),
    position: z.string(),
    url: z.string().default(''),
    startDate: z.string(),
    endDate: z.string().default(''),
    summary: z.string().default(''),
    highlights: z.array(z.string()).default([])
  })).default([]),
  volunteer: z.array(z.object({
    organization: z.string(),
    position: z.string(),
    url: z.string().default(''),
    startDate: z.string(),
    endDate: z.string().default(''),
    summary: z.string().default(''),
    highlights: z.array(z.string()).default([])
  })).default([]),
  education: z.array(z.object({
    institution: z.string(),
    url: z.string().default(''),
    area: z.string(),
    studyType: z.string(),
    startDate: z.string(),
    endDate: z.string().default(''),
    score: z.string().default(''),
    courses: z.array(z.string()).default([])
  })).default([]),
  awards: z.array(z.object({
    title: z.string(),
    date: z.string(),
    awarder: z.string(),
    summary: z.string().default('')
  })).default([]),
  certificates: z.array(z.object({
    name: z.string(),
    date: z.string(),
    issuer: z.string(),
    url: z.string().default('')
  })).default([]),
  publications: z.array(z.object({
    name: z.string(),
    publisher: z.string(),
    releaseDate: z.string(),
    url: z.string().default(''),
    summary: z.string().default('')
  })).default([]),
  skills: z.array(z.object({
    name: z.string(),
    level: z.string().default(''),
    keywords: z.array(z.string()).default([])
  })).default([]),
  languages: z.array(z.object({
    language: z.string(),
    fluency: z.string()
  })).default([]),
  interests: z.array(z.object({
    name: z.string(),
    keywords: z.array(z.string()).default([])
  })).default([]),
  references: z.array(z.object({
    name: z.string(),
    reference: z.string()
  })).default([]),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string().default(''),
    highlights: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    url: z.string().default(''),
    roles: z.array(z.string()).default([]),
    entity: z.string().default(''),
    type: z.string().default('')
  })).default([])
}).passthrough() as z.ZodType<ResumeInterface> 