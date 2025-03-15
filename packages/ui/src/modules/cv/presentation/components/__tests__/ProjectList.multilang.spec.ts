import { describe, vi, beforeEach } from 'vitest'
import ProjectList from '../ProjectList.vue'
import { testComponentInMultipleLanguages } from '@ui/test-utils/language-testing'
import { mount } from '@vue/test-utils'
import { createTestingOptions } from '@ui/test-utils/i18n-plugin'
import type { ProjectWithId } from '@ui/modules/cv/presentation/stores/project'
import { useProjectStore } from '@ui/modules/cv/presentation/stores/project'

// Mock the store
vi.mock('@ui/modules/cv/presentation/stores/project', () => {
  const mockProjects: ProjectWithId[] = [
    {
      id: '1',
      name: 'Test Project 1',
      description: 'First test project',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      highlights: ['Feature 1', 'Feature 2'],
      url: 'https://example.com'
    }
  ]
  
  return {
    useProjectStore: vi.fn(() => ({
      projects: mockProjects,
      loading: false,
      loadProjects: vi.fn(),
      addProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      reorderProjects: vi.fn()
    }))
  }
})

// Mock components
vi.mock('@ui/components/shared/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="mock-card"><slot /></div>'
  }
}))

vi.mock('@ui/components/shared/Button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button class="mock-button"><slot /><slot name="icon" /></button>',
    props: ['variant', 'size', 'disabled']
  }
}))

vi.mock('@ui/components/shared/EmptyState.vue', () => ({
  default: {
    name: 'EmptyState',
    template: '<div class="mock-empty-state"><slot /><slot name="icon" /></div>',
    props: ['title', 'description', 'actionLabel']
  }
}))

vi.mock('../ProjectForm.vue', () => ({
  default: {
    name: 'ProjectForm',
    template: '<div class="mock-project-form"></div>',
    props: ['modelValue', 'loading', 'isNew'],
    emits: ['update:modelValue', 'validate', 'cancel']
  }
}))

describe('ProjectList - Multilingual Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Définir les textes attendus dans chaque langue
  const textSelectors = {
    'h2': {
      fr: 'Projets',
      en: 'Projects'
    },
    '.mock-button': {
      fr: 'Ajouter un projet',
      en: 'Add a project'
    }
  }

  // Tester le composant avec les deux langues
  testComponentInMultipleLanguages(
    ProjectList,
    {},
    textSelectors
  )

  // Test avec état vide
  describe('Empty state in multiple languages', () => {
    const emptyTextSelectors = {
      '.mock-empty-state': {
        fr: 'Aucun projet',
        en: 'No projects'
      }
    }

    // Utiliser une fonction de montage personnalisée pour configurer le mock du store
    const customMount = () => {
      // Override the store mock for this test
      vi.mocked(useProjectStore).mockReturnValue({
        projects: [],
        loading: false,
        loadProjects: vi.fn(),
        addProject: vi.fn(),
        updateProject: vi.fn(),
        deleteProject: vi.fn(),
        reorderProjects: vi.fn()
      } as any)

      return mount(ProjectList, createTestingOptions())
    }

    testComponentInMultipleLanguages(
      ProjectList,
      {},
      emptyTextSelectors,
      customMount
    )
  })
}) 