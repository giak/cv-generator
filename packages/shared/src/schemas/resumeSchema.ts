import { z } from 'zod'
import { ResumeInterface, SkillInterface } from '../types/resume.interface'

const skillSchema = z.object({
  name: z.string().min(1, { message: 'Skill name is required' }),
  level: z.string().min(1, { message: 'Skill level is required' }),
  keywords: z.array(z.string()).optional()
}).strict()

export const resumeSchema = z.object({
  basics: z.object({
    name: z.string().min(1, { message: 'Name is required and must not be empty' }),
    label: z.string().optional(),
    email: z.string().email({ message: 'Invalid email format' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    url: z.string().url({ message: 'Invalid URL format' }).optional(),
    summary: z.string().optional(),
    location: z.object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional()
    }).optional()
  }).strict(),
  work: z.array(z.object({
    name: z.string().min(1, { message: 'Company name is required' }),
    position: z.string().min(1, { message: 'Position is required' }),
    url: z.string().url({ message: 'Invalid company URL format' }).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Start date must be in YYYY-MM-DD format' }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date must be in YYYY-MM-DD format' }).optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional()
  }).strict()).optional(),
  education: z.array(z.object({
    institution: z.string().min(1, { message: 'Institution name is required' }),
    url: z.string().url({ message: 'Invalid institution URL format' }).optional(),
    area: z.string().min(1, { message: 'Area of study is required' }),
    studyType: z.string().min(1, { message: 'Type of study is required' }),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Start date must be in YYYY-MM-DD format' }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date must be in YYYY-MM-DD format' }).optional(),
    score: z.string().optional(),
    courses: z.array(z.string()).optional()
  }).strict()).optional(),
  skills: z.array(skillSchema).optional()
}).strict() 