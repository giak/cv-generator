import { describe, vi, beforeEach, it, expect } from 'vitest'
import WorkList from '../WorkList.vue'
import { testComponentInMultipleLanguages } from '@ui/test-utils/language-testing'
import { mount } from '@vue/test-utils'
import { createTestingOptions } from '@ui/test-utils/i18n-plugin'
import type { WorkWithId } from '@ui/modules/cv/presentation/stores/work'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'

// Mock the store
vi.mock('@ui/modules/cv/presentation/stores/work', () => {
  const mockWorks: WorkWithId[] = [
    {
      id: '1',
      name: 'Test Company 1',
      position: 'Software Engineer',
      startDate: '2020-01-01',
      endDate: '2022-01-01',
      highlights: ['Achievement 1', 'Achievement 2'],
      summary: 'First test job',
      url: 'https://example.com'
    }
  ]
  
  return {
    useWorkStore: vi.fn(() => ({
      works: mockWorks,
      loading: false,
      loadWorks: vi.fn(),
      addWork: vi.fn(),
      updateWork: vi.fn(),
      deleteWork: vi.fn(),
      reorderWorks: vi.fn()
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
    template: '<div class="mock-empty-state" data-testid="empty-state"><div data-testid="title">{{ title }}</div><div data-testid="description">{{ description }}</div><button class="action-button" v-if="actionLabel">{{ actionLabel }}</button></div>',
    props: ['title', 'description', 'actionLabel']
  }
}))

vi.mock('../WorkForm.vue', () => ({
  default: {
    name: 'WorkForm',
    template: '<div class="mock-work-form"></div>',
    props: ['modelValue', 'loading', 'isNew'],
    emits: ['update:modelValue', 'validate', 'cancel']
  }
}))

describe('WorkList - Multilingual Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Définir les textes attendus dans chaque langue
  const textSelectors = {
    'h2': {
      fr: 'Expériences Professionnelles',
      en: 'Work Experience'
    },
    '.mock-button': {
      fr: 'Ajouter une expérience',
      en: 'Add experience'
    }
  }

  // Tester le composant avec les deux langues
  testComponentInMultipleLanguages(
    WorkList,
    {},
    textSelectors
  )

  // Test avec état vide - Nous utilisons d'autres tests pour ce cas
  // car les sélecteurs réels et le texte exact nécessitent une configuration plus spécifique
  // qui dépasse le cadre de ces tests d'intégration.
  describe('Empty state placeholder test', () => {
    it('shows empty state when no works exist', async () => {
      // Override the store mock for this test
      vi.mocked(useWorkStore).mockReturnValue({
        works: [],
        loading: false,
        loadWorks: vi.fn(),
        addWork: vi.fn(),
        updateWork: vi.fn(),
        deleteWork: vi.fn(),
        reorderWorks: vi.fn()
      } as any)

      const wrapper = mount(WorkList, createTestingOptions())
      
      // Vérifier simplement que le composant EmptyState est présent
      expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true)
    })
  })
}) 