import { ManageResume } from "@cv-generator/core"
import { LocalStorageResumeRepository } from "@cv-generator/infrastructure/src/repositories/LocalStorageResumeRepository"

/**
 * Creates and returns a ManageResume use case instance
 * This composable is used to provide a consistent way to access
 * the resume use case throughout the UI layer
 */
export function useResumeUseCase() {
  // Create repository instance
  const repository = new LocalStorageResumeRepository()
  
  // Create and return use case instance
  return new ManageResume(repository)
} 