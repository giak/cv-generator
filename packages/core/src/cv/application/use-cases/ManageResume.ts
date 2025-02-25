import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'
import { Resume } from '../../domain/entities/Resume'
import { ResumeRepository } from '../../ports/repositories/ResumeRepository'
import { ValidationError } from '../../../shared/domain/errors/ValidationError'

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
      // 1. Validation de base (syntaxique)
      const result = Resume.create(data)
      console.log('Resume instance created:', result.resume)
      
      if (!result.isValid || !result.resume) {
        throw new ValidationError(result.errors || ['Unknown validation error'])
      }
      
      resumeInstance = result.resume;
      
      // 2. Validation des règles métier (sémantique)
      await this.validateBusinessRules(data)
    }
    
    console.log('Saving to repository...')
    await this.repository.save(resumeInstance)
    console.log('Saved to repository successfully')
  }
  
  private async validateBusinessRules(data: ResumeInterface): Promise<void> {
    const errors: string[] = []
    
    // Règle métier: La date de fin ne peut pas être avant la date de début
    if (data.work) {
      for (const work of data.work) {
        if (work.startDate && work.endDate) {
          const startDate = new Date(work.startDate)
          const endDate = new Date(work.endDate)
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            if (endDate < startDate) {
              errors.push('End date cannot be before start date')
            }
          }
        }
      }
    }
    
    // Règle métier: La date de fin d'éducation ne peut pas être avant la date de début
    if (data.education) {
      for (const edu of data.education) {
        if (edu.startDate && edu.endDate) {
          const startDate = new Date(edu.startDate)
          const endDate = new Date(edu.endDate)
          
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            if (endDate < startDate) {
              errors.push('Education end date cannot be before start date')
            }
          }
        }
      }
    }
    
    // Autres règles métier à ajouter au besoin
    
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
  }

  async exportResume(format: 'json' | 'pdf' | 'html'): Promise<Blob> {
    return this.repository.export(format)
  }

  async importResume(file: Blob): Promise<Resume> {
    return this.repository.import(file)
  }
} 