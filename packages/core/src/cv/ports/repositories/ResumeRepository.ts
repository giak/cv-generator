import { Resume } from '../../domain/entities/Resume';

/**
 * Repository interface for Resume persistence operations
 */
export interface ResumeRepository {
  /**
   * Load a resume from storage
   */
  load(): Promise<Resume>;
  
  /**
   * Save a resume to storage
   */
  save(resume: Resume): Promise<void>;
  
  /**
   * Export a resume to a specified format
   */
  export(format: 'json' | 'pdf' | 'html'): Promise<Blob>;
  
  /**
   * Import a resume from a file
   */
  import(file: Blob): Promise<Resume>;
} 