import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import WorkList from '../WorkList.vue'
import type { WorkWithId } from '@ui/modules/cv/presentation/stores/work'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'
import { createTestingOptions, setLocale } from '@ui/test-utils/i18n-plugin'

// Pas besoin de mocker vue-i18n maintenant que nous utilisons le plugin
// vi.mock('vue-i18n')

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
    },
    {
      id: '2',
      name: 'Test Company 2',
      position: 'Senior Engineer',
      startDate: '2022-02-01',
      highlights: ['Achievement 3', 'Achievement 4'],
      summary: 'Current job',
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
    template: '<div class="mock-empty-state"><slot /><slot name="icon" /></div>',
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

describe('WorkList', () => {
  // Spy pour vérifier les erreurs de console liées aux traductions
  let consoleErrorSpy: any

  beforeEach(() => {
    // Espionner console.error pour détecter les erreurs de traduction
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // Réinitialiser la langue à français pour chaque test
    setLocale('fr')
  })

  afterEach(() => {
    // Restaurer console.error
    consoleErrorSpy.mockRestore()
  })

  it('renders the component with work items', async () => {
    const wrapper = mount(WorkList, createTestingOptions())
    
    // Title is displayed using translation
    expect(wrapper.find('h2').text()).toBe('Expériences Professionnelles')
    
    // Work items are rendered
    const cards = wrapper.findAll('.mock-card')
    expect(cards.length).toBe(2)
    
    // With chronological sort, the current job (Senior Engineer) should appear first
    // Check specific content in the first card
    expect(cards[0].text()).toContain('Senior Engineer')
    expect(cards[0].text()).toContain('Test Company 2')
    
    // Check date formatting with translation for "Present"
    expect(cards[0].text()).toContain('février 2022 - Présent')
    
    // Check highlights
    expect(cards[0].text()).toContain('Achievement 3')
    expect(cards[0].text()).toContain('Achievement 4')
    
    // Check summary
    expect(cards[0].text()).toContain('Current job')
    
    // Check specific content in the second card
    expect(cards[1].text()).toContain('Software Engineer')
    expect(cards[1].text()).toContain('Test Company 1')
    expect(cards[1].text()).toContain('janvier 2020 - janvier 2022')
    expect(cards[1].text()).toContain('Achievement 1')
    expect(cards[1].text()).toContain('First test job')
    
    // Check URL
    const url = cards[1].find('a')
    expect(url.attributes('href')).toBe('https://example.com')
    
    // Vérifier qu'aucune erreur de console n'a été émise concernant les traductions
    const i18nErrors = consoleErrorSpy.mock.calls.filter((call: any[]) => 
      call[0] && typeof call[0] === 'string' && 
      (call[0].includes('i18n') || call[0].includes('translation') || call[0].includes('t is not a function'))
    )
    
    expect(i18nErrors.length).toBe(0)
  })
  
  it('shows add button with correct translation', () => {
    const wrapper = mount(WorkList, createTestingOptions())
    const addButton = wrapper.find('.mock-button')
    
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toContain('Ajouter une expérience')
  })
  
  it('shows dialog when add button is clicked', async () => {
    const wrapper = mount(WorkList, createTestingOptions())
    
    // Initially dialog should not be visible
    expect(wrapper.find('.fixed').exists()).toBe(false)
    
    // Click add button
    await wrapper.find('.mock-button').trigger('click')
    
    // Dialog should be visible
    expect(wrapper.find('.fixed').exists()).toBe(true)
    
    // WorkForm should be in new mode
    const workForm = wrapper.find('.mock-work-form')
    expect(workForm.exists()).toBe(true)
  })
  
  it('shows empty state with correct translations when no works are available', async () => {
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
    
    // Empty state should be visible
    const emptyState = wrapper.find('.mock-empty-state')
    expect(emptyState.exists()).toBe(true)
    
    // Vérifier que les props de EmptyState contiennent les bonnes traductions
    // Note: Nous vérifions uniquement les propriétés qui sont définies dans le mock
    const emptyStateComponent = wrapper.findComponent({ name: 'EmptyState' })
    expect(emptyStateComponent.props('title')).toBe('Aucune expérience professionnelle')
    expect(emptyStateComponent.props('description')).toBe('Ajoutez des expériences professionnelles à votre CV')
    
    // Vérifier que le texte du bouton est présent dans le composant
    // Note: Le texte du bouton dans l'état vide est "Ajouter" par défaut dans CollectionManager
    expect(emptyState.text()).toContain('Ajouter')
  })
  
  it('shows loading state', async () => {
    // Override the store mock for this test
    vi.mocked(useWorkStore).mockReturnValue({
      works: [],
      loading: true,
      loadWorks: vi.fn(),
      addWork: vi.fn(),
      updateWork: vi.fn(),
      deleteWork: vi.fn(),
      reorderWorks: vi.fn()
    } as any)
    
    const wrapper = mount(WorkList, createTestingOptions())
    
    // Loading spinner should be visible
    const loadingSpinner = wrapper.find('.animate-spin')
    expect(loadingSpinner.exists()).toBe(true)
  })
  
  // Test spécifique pour l'internationalisation
  it('changes text when language changes', async () => {
    const wrapper = mount(WorkList, createTestingOptions())
    
    // Vérifier le texte en français par défaut
    expect(wrapper.find('h2').text()).toBe('Expériences Professionnelles')
    
    // Changer la langue du plugin vers l'anglais
    setLocale('en')
    await nextTick()
    
    // Rémonter le composant pour qu'il utilise la nouvelle langue
    wrapper.unmount()
    const newWrapper = mount(WorkList, createTestingOptions())
    
    // Vérifier que le texte a changé pour l'anglais
    expect(newWrapper.find('h2').text()).toBe('Work Experience')
  })
})

// Restore original implementation after tests
afterAll(() => {
  vi.restoreAllMocks()
}) 