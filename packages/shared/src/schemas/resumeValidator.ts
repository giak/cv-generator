import { z } from 'zod'
import { resumeSchema } from './resumeSchema'
import type { ReferenceInterface } from '../types/resume.interface'

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  errors?: Record<string, string[]>
}

/**
 * Schéma de validation pour une référence
 */
const referenceSchema = z.object({
  name: z.string(),
  reference: z.string()
})

/**
 * Valide une référence selon le schéma JSON Resume
 * @param reference La référence à valider
 * @returns Le résultat de validation
 */
export function validateReference(reference: ReferenceInterface): ValidationResult {
  try {
    referenceSchema.parse(reference)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        const field = path || 'global'
        
        if (!errors[field]) {
          errors[field] = []
        }
        
        errors[field].push(err.message)
      })
      
      return {
        valid: false,
        errors
      }
    }
    
    return {
      valid: false,
      errors: {
        global: ['Une erreur inconnue est survenue lors de la validation']
      }
    }
  }
} 