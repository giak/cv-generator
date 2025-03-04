import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppState } from '../ui/useAppState'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'

// Create a mock for saveResume that we can check if it was called
const mockSaveResume = vi.fn()

// Mock the resume store
vi.mock('@ui/modules/cv/presentation/stores/resume', () => ({
  useResumeStore: vi.fn(() => ({
    loadResume: vi.fn(),
    saveResume: mockSaveResume,
    resume: {
      basics: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'test.jpg',
        location: {
          address: '123 Test St',
          postalCode: '12345',
          city: 'Test City',
          countryCode: 'TC',
          region: 'Test Region'
        }
      }
    }
  }))
}))

describe('useAppState', () => {
  let appState: ReturnType<typeof useAppState>
  
  beforeEach(() => {
    // Setup Pinia
    setActivePinia(createPinia())
    
    vi.clearAllMocks()
    appState = useAppState()
  })
  
  it('should provide essential state and methods', () => {
    expect(appState.activeComponent).toBeDefined()
    expect(appState.activeView).toBeDefined()
    expect(appState.isSidebarOpen).toBeDefined()
    expect(appState.basics).toBeDefined()
    expect(appState.initializeBasics).toBeInstanceOf(Function)
    expect(appState.updateBasics).toBeInstanceOf(Function)
    expect(appState.saveBasics).toBeInstanceOf(Function)
    expect(appState.toggleSidebar).toBeInstanceOf(Function)
    expect(appState.setupResizeListener).toBeInstanceOf(Function)
  })
  
  it('should initialize basics data from the resume store', async () => {
    await appState.initializeBasics()
    
    // Expect full structure with all fields
    expect(appState.basics).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      label: '',
      phone: '',
      url: '',
      image: 'test.jpg',
      summary: '',
      location: {
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        countryCode: 'TC',
        region: 'Test Region'
      },
      profiles: []
    })
  })
  
  it('should update basics data', () => {
    const newBasics: Partial<BasicsInterface> = {
      name: 'Updated User',
      email: 'updated@example.com',
      location: {
        address: '456 New St',
        city: 'New City'
      }
    }
    
    appState.updateBasics(newBasics as BasicsInterface)
    
    // Expect full structure with newly updated values and defaults for missing values
    expect(appState.basics).toEqual({
      name: 'Updated User',
      email: 'updated@example.com',
      label: '',
      phone: '',
      url: '',
      image: '',
      summary: '',
      location: {
        address: '456 New St',
        postalCode: '',
        city: 'New City',
        countryCode: '',
        region: ''
      },
      profiles: []
    })
  })
  
  it('should toggle sidebar state', () => {
    // Check the value of the ref, not the ref itself
    expect(appState.isSidebarOpen.value).toBe(false)
    
    appState.toggleSidebar()
    expect(appState.isSidebarOpen.value).toBe(true)
    
    appState.toggleSidebar()
    expect(appState.isSidebarOpen.value).toBe(false)
  })
  
  it('should save basics data', async () => {
    await appState.saveBasics()
    
    // Check if our mock saveResume function was called
    expect(mockSaveResume).toHaveBeenCalled()
  })
}) 