import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNavigation } from '../ui/useNavigation'
import { ref, type Component } from 'vue'

// Define mock functions for stores
const mockResumeStore = {
  loadResume: vi.fn(),
  resume: { basics: { name: 'Test Name' } }
}

const mockWorkStore = {
  loadWorks: vi.fn()
}

const mockGenericStore = {
  loadItems: vi.fn()
}

// Mock all the stores without using vi.mock at top level
vi.mock('@ui/modules/cv/presentation/stores/resume', () => ({
  useResumeStore: () => mockResumeStore
}))

vi.mock('@ui/modules/cv/presentation/stores/work', () => ({
  useWorkStore: () => mockWorkStore
}))

// Create a simple function for the other stores
const createMockStore = (name: string) => {
  return {
    [`load${name}`]: vi.fn()
  }
}

vi.mock('@ui/modules/cv/presentation/stores/volunteer', () => ({
  useVolunteerStore: () => createMockStore('Volunteers')
}))

vi.mock('@ui/modules/cv/presentation/stores/education', () => ({
  useEducationStore: () => createMockStore('Education')
}))

vi.mock('@ui/modules/cv/presentation/stores/award', () => ({
  useAwardStore: () => createMockStore('Awards')
}))

vi.mock('@ui/modules/cv/presentation/stores/certificate', () => ({
  useCertificateStore: () => createMockStore('Certificates')
}))

vi.mock('@ui/modules/cv/presentation/stores/publication', () => ({
  usePublicationStore: () => createMockStore('Publications')
}))

vi.mock('@ui/modules/cv/presentation/stores/skill', () => ({
  useSkillStore: () => createMockStore('Skills')
}))

vi.mock('@ui/modules/cv/presentation/stores/language', () => ({
  useLanguageStore: () => createMockStore('Languages')
}))

vi.mock('@ui/modules/cv/presentation/stores/interest', () => ({
  useInterestStore: () => createMockStore('Interests')
}))

vi.mock('@ui/modules/cv/presentation/stores/project', () => ({
  useProjectStore: () => createMockStore('Projects')
}))

vi.mock('@ui/modules/cv/presentation/stores/reference', () => ({
  useReferenceStore: () => createMockStore('References')
}))

describe('useNavigation', () => {
  const activeView = ref('basics')
  const activeComponent = ref<Component | null>(null)
  let navigation: ReturnType<typeof useNavigation>
  
  beforeEach(() => {
    vi.clearAllMocks()
    activeView.value = 'basics'
    navigation = useNavigation({ activeView, activeComponent })
  })
  
  it('should provide navigation functions and state', () => {
    expect(navigation.navigationGroups).toBeDefined()
    expect(navigation.breadcrumbItems).toBeDefined()
    expect(navigation.handleNavigation).toBeInstanceOf(Function)
    expect(navigation.getActiveViewTitle).toBeDefined()
    expect(navigation.getActiveViewDescription).toBeDefined()
  })
  
  it('should provide the complete navigation structure', () => {
    // Check navigation group count
    expect(navigation.navigationGroups.length).toBe(2)
    
    // Check CV section
    const cvGroup = navigation.navigationGroups[0]
    expect(cvGroup.id).toBe('cv')
    expect(cvGroup.title).toBe('Curriculum Vitae')
    expect(cvGroup.items.length).toBe(12) // All CV-related items
    
    // Check Options section
    const optionsGroup = navigation.navigationGroups[1]
    expect(optionsGroup.id).toBe('options')
    expect(optionsGroup.title).toBe('Options')
    expect(optionsGroup.items.length).toBe(3) // Notifications, Themes, Settings
    
    // Check that each item has the required properties
    for (const group of navigation.navigationGroups) {
      for (const item of group.items) {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('label')
        expect(item).toHaveProperty('path')
        expect(item).toHaveProperty('icon')
      }
    }
  })
  
  it('should handle navigation to different sections', async () => {
    // Reset the active view first
    activeView.value = 'basics'
    
    // Test navigation to experience
    await navigation.handleNavigation('#experience')
    
    // In the actual implementation, #experience maps to 'work'
    expect(activeView.value).toBe('work')
    expect(mockWorkStore.loadWorks).toHaveBeenCalled()
  })
  
  it('should update breadcrumbs when active view changes', async () => {
    // Test navigation to education
    await navigation.handleNavigation('#education')
    
    // Check if breadcrumbs contain the correct items
    const breadcrumbs = navigation.breadcrumbItems.value
    expect(breadcrumbs.length).toBe(2)
    expect(breadcrumbs[0].id).toBe('home')
    expect(breadcrumbs[1].id).toBe('education')
    expect(breadcrumbs[1].path).toBe('#education')
  })
  
  it('should return the correct active view title', () => {
    activeView.value = 'skills'
    expect(navigation.getActiveViewTitle.value).toBe('Compétences')
    
    activeView.value = 'languages'
    expect(navigation.getActiveViewTitle.value).toBe('Langues')
    
    // Test default case
    activeView.value = 'unknown'
    expect(navigation.getActiveViewTitle.value).toBe('Vue inconnue')
  })
  
  it('should handle unknown view IDs gracefully', async () => {
    await navigation.handleNavigation('#nonexistent')
    
    // Should default to showing some view and not crash
    expect(activeView.value).toBe('nonexistent')
    expect(navigation.getActiveViewTitle.value).toBe('Vue inconnue')
  })
}) 