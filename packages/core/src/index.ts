/**
 * Exports principaux pour le module core
 */

// Exports du module CV
export * from './cv';

// Export Bounded Context
export * from './export';

// User Bounded Context
export * from './user';

// Shared
export * from './shared';

// Types from shared package
export type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface';
export type { ValidationResultType } from '@cv-generator/shared/src/types/resume.type';
