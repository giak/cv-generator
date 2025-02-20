import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Resume } from '../../domain/entities/Resume'

export interface ResumeRepository {
  load(): Promise<Resume>
  save(resume: ResumeInterface): Promise<void>
  export(format: 'json' | 'pdf' | 'html'): Promise<Blob>
  import(file: Blob): Promise<Resume>
}

export class ManageResume {
  constructor(private readonly repository: ResumeRepository) {}

  async loadResume(): Promise<Resume> {
    return this.repository.load()
  }

  async createResume(data: ResumeInterface): Promise<void> {
    const result = Resume.create(data)
    if (!result.isValid || !result.resume) {
      throw new Error('Invalid resume data')
    }
    await this.repository.save(result.resume.toJSON())
  }

  async exportResume(format: 'json' | 'pdf' | 'html'): Promise<Blob> {
    return this.repository.export(format)
  }

  async importResume(file: Blob): Promise<Resume> {
    return this.repository.import(file)
  }
} 