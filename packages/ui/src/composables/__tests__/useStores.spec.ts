import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStores } from '../ui/useStores'

// Mock all store modules
vi.mock('@ui/modules/cv/presentation/stores/resume', () => ({
  useResumeStore: vi.fn(() => ({
    loadResume: vi.fn().mockResolvedValue({}),
    saveResume: vi.fn(),
    resume: { basics: { name: 'Test' } }
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/work', () => ({
  useWorkStore: vi.fn(() => ({
    loadWorks: vi.fn().mockResolvedValue([]),
    work: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/volunteer', () => ({
  useVolunteerStore: vi.fn(() => ({
    loadVolunteers: vi.fn().mockResolvedValue([]),
    volunteers: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/education', () => ({
  useEducationStore: vi.fn(() => ({
    loadEducation: vi.fn().mockResolvedValue([]),
    education: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/award', () => ({
  useAwardStore: vi.fn(() => ({
    loadAwards: vi.fn().mockResolvedValue([]),
    awards: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/certificate', () => ({
  useCertificateStore: vi.fn(() => ({
    loadCertificates: vi.fn().mockResolvedValue([]),
    certificates: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/publication', () => ({
  usePublicationStore: vi.fn(() => ({
    loadPublications: vi.fn().mockResolvedValue([]),
    publications: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/skill', () => ({
  useSkillStore: vi.fn(() => ({
    loadSkills: vi.fn().mockResolvedValue([]),
    skills: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/language', () => ({
  useLanguageStore: vi.fn(() => ({
    loadLanguages: vi.fn().mockResolvedValue([]),
    languages: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/interest', () => ({
  useInterestStore: vi.fn(() => ({
    loadInterests: vi.fn().mockResolvedValue([]),
    interests: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/reference', () => ({
  useReferenceStore: vi.fn(() => ({
    loadReferences: vi.fn().mockResolvedValue([]),
    references: []
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/project', () => ({
  useProjectStore: vi.fn(() => ({
    loadProjects: vi.fn().mockResolvedValue([]),
    projects: []
  }))
}))

vi.mock('@ui/core/stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    dismissError: vi.fn(),
    clearErrors: vi.fn(),
    errors: []
  }))
}))

describe('useStores', () => {
  let stores: ReturnType<typeof useStores>
  
  beforeEach(() => {
    stores = useStores()
  })
  
  it('should return all stores', () => {
    expect(stores.resumeStore).toBeDefined()
    expect(stores.workStore).toBeDefined()
    expect(stores.volunteerStore).toBeDefined()
    expect(stores.educationStore).toBeDefined()
    expect(stores.awardStore).toBeDefined()
    expect(stores.certificateStore).toBeDefined()
    expect(stores.publicationStore).toBeDefined()
    expect(stores.skillStore).toBeDefined()
    expect(stores.languageStore).toBeDefined()
    expect(stores.interestStore).toBeDefined()
    expect(stores.referenceStore).toBeDefined()
    expect(stores.projectStore).toBeDefined()
    expect(stores.errorStore).toBeDefined()
  })
  
  it('should provide a method to load all data', async () => {
    expect(stores.loadAllData).toBeInstanceOf(Function)
    
    const result = await stores.loadAllData()
    
    expect(result).toBe(true)
    expect(stores.resumeStore.loadResume).toHaveBeenCalled()
    expect(stores.workStore.loadWorks).toHaveBeenCalled()
    expect(stores.volunteerStore.loadVolunteers).toHaveBeenCalled()
    expect(stores.educationStore.loadEducation).toHaveBeenCalled()
    expect(stores.awardStore.loadAwards).toHaveBeenCalled()
    expect(stores.certificateStore.loadCertificates).toHaveBeenCalled()
    expect(stores.publicationStore.loadPublications).toHaveBeenCalled()
    expect(stores.skillStore.loadSkills).toHaveBeenCalled()
    expect(stores.languageStore.loadLanguages).toHaveBeenCalled()
    expect(stores.interestStore.loadInterests).toHaveBeenCalled()
    expect(stores.referenceStore.loadReferences).toHaveBeenCalled()
    expect(stores.projectStore.loadProjects).toHaveBeenCalled()
  })
  
  it('should handle errors when loading data', async () => {
    // Make one of the load methods throw an error
    stores.resumeStore.loadResume = vi.fn().mockRejectedValue(new Error('Test error'))
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const result = await stores.loadAllData()
    
    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalled()
    expect(consoleSpy.mock.calls[0][0]).toContain('Error loading all data')
    
    // Restore the original console.error
    consoleSpy.mockRestore()
  })
}) 