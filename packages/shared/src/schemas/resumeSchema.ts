import { z } from 'zod'
import { ResumeInterface } from '../types/resume.interface'

// Schéma simplifié sans validation pour le développement
export const resumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string().default(''),
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
  skills: z.array(z.object({
    name: z.string(),
    level: z.string().default(''),
    keywords: z.array(z.string()).default([])
  })).default([])
}).passthrough() as z.ZodType<ResumeInterface> 