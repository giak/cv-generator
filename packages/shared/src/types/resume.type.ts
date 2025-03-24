import type { ResumeInterface } from './resume.interface';

export type ResumeSectionType = keyof ResumeInterface

/**
 * Type pour les résultats de validation de CV
 * @deprecated Privilégiez l'utilisation de ResultTypeInterface du pattern standardisé
 */
export type ValidationResultType = { isValid: boolean; errors?: string[] } 