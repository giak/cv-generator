import { z } from "zod";

const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  region: z.string().optional(),
});

const profileSchema = z.object({
  network: z.string().min(1),
  username: z.string().min(1),
  url: z.string().url(),
});

export const basicsSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  image: z.string().url().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: locationSchema.optional(),
  profiles: z.array(profileSchema).optional(),
});

const workExperienceSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  url: z.string().url().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  area: z.string().min(1),
  studyType: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const resumeSchema = z.object({
  basics: basicsSchema,
  work: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
});

export type ResumeSchema = z.infer<typeof resumeSchema>;
