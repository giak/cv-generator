import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Resume } from '../../domain/entities/Resume'

export interface ResumeRepository {
  load(): Promise<Resume>
  save(resume: Resume): Promise<void>
  export(format: 'json' | 'pdf' | 'html'): Promise<Blob>
  import(file: Blob): Promise<Resume>
}

export class ManageResume {
  constructor(private readonly repository: ResumeRepository) {}

  async loadResume(): Promise<Resume> {
    return this.repository.load()
  }

  async createResume(data: Resume | ResumeInterface): Promise<void> {
    console.log('=== Application Layer - ManageResume UseCase ===')
    console.log('Received data in use case:', data)
    console.log('Data type:', data instanceof Resume ? 'Resume instance' : 'Resume interface')

    let resumeInstance: Resume;
    
    if (data instanceof Resume) {
      console.log('Using existing Resume instance')
      resumeInstance = data;
    } else {
      console.log('Creating new Resume instance from data')
      const result = Resume.create(data)
      console.log('Resume instance created:', result.resume)
      resumeInstance = result.resume!;
    }
    
    console.log('Saving to repository...')
    await this.repository.save(resumeInstance)
    console.log('Saved to repository successfully')
  }

  async exportResume(format: 'json' | 'pdf' | 'html'): Promise<Blob> {
    return this.repository.export(format)
  }

  async importResume(file: Blob): Promise<Resume> {
    return this.repository.import(file)
  }
} 