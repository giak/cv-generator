import { z } from 'zod'

export const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().length(2).optional(),
  region: z.string().optional()
})

export const profileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.string().url()
})

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
})

export type LocationType = z.infer<typeof locationSchema>
export type ProfileType = z.infer<typeof profileSchema>
export type BasicsType = z.infer<typeof basicsSchema> 