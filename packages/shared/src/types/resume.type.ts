import type { ResumeInterface } from './resume.interface'

export type ResumeSectionType = keyof ResumeInterface
export type ValidationResultType = { isValid: boolean; errors?: string[] } 