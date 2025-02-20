import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Resume } from "../../domain/entities/Resume"
import type { ResumeRepositoryInterface } from "../../ports/ResumeRepository"

export class ManageResume {
  constructor(private readonly repository: ResumeRepositoryInterface) {}

  async createResume(data: ResumeInterface) {
    const result = Resume.create(data)
    if (!result.isValid || !result.resume) {
      throw new Error(`Invalid resume data: ${result.errors?.join(', ')}`)
    }
    return this.repository.save(result.resume)
  }

  async updateResume(id: string, data: Partial<ResumeInterface>) {
    const current = await this.repository.findById(id)
    if (!current) {
      throw new Error(`Resume not found: ${id}`)
    }

    const result = Resume.create({ ...current.toJSON(), ...data })
    if (!result.isValid || !result.resume) {
      throw new Error(`Invalid resume data: ${result.errors?.join(', ')}`)
    }
    return this.repository.save(result.resume)
  }

  async importResume(file: File) {
    return this.repository.import(file)
  }

  async exportResume(id: string, format: 'json' | 'pdf') {
    const resume = await this.repository.findById(id)
    if (!resume) {
      throw new Error(`Resume not found: ${id}`)
    }
    return this.repository.export(resume, format)
  }
}
