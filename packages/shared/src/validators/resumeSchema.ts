import { z } from "zod";
import type { 
  LocationInterface,
  ProfileInterface,
  BasicsInterface,
  WorkInterface,
  EducationInterface,
  SkillInterface,
  ResumeInterface
} from '../types'

export const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  region: z.string().optional()
}).strict() as z.ZodType<LocationInterface>

export const profileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.string().url()
}).strict() as z.ZodType<ProfileInterface>

export const basicsSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  image: z.string().url().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: locationSchema.optional(),
  profiles: z.array(profileSchema).optional()
}).strict() as z.ZodType<BasicsInterface>

export const workSchema = z.object({
  name: z.string(),
  position: z.string(),
  url: z.string().url().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional()
}).strict() as z.ZodType<WorkInterface>

export const educationSchema = z.object({
  institution: z.string(),
  area: z.string(),
  studyType: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional()
}).strict() as z.ZodType<EducationInterface>

export const skillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional()
}).strict() as z.ZodType<SkillInterface>

export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional()
}).strict() as z.ZodType<ResumeInterface>

export type ResumeSchemaType = z.infer<typeof resumeSchema>
