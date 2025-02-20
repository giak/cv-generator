import type { Resume } from '../domain/entities/Resume'

export interface ResumeRepositoryInterface {
  save(resume: Resume): Promise<Resume>
  findById(id: string): Promise<Resume | null>
  import(file: File): Promise<Resume>
  export(resume: Resume, format: 'json' | 'pdf'): Promise<Blob>
}
