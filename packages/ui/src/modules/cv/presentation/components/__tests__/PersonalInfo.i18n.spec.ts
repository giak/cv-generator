import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonalInfo from '../PersonalInfo.vue'
import { createTestingOptions, setLocale } from '../../../../../test-utils/i18n-plugin'
import { TextSelector, runI18nTests, testDynamicLocaleChange } from '../../../../../test-utils/i18n-e2e-test'
import { testNoI18nConsoleErrors } from '../../../../../test-utils/i18n-console-errors'

// Mock des composants
vi.mock('../../../shared/components/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="mock-card"><slot></slot></div>'
  }
}))

vi.mock('../../../shared/components/Button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button class="mock-button"><slot></slot></button>',
    props: ['variant']
  }
}))

// Mock du store personal
vi.mock('../../../shared/stores/usePersonalStore', () => ({
  usePersonalStore: () => ({
    personal: {
      name: 'John Doe',
      title: 'Développeur Web',
      email: 'john@example.com',
      phone: '+33600000000',
      website: 'https://johndoe.com',
      location: 'Paris, France',
      summary: 'Un développeur passionné',
      profiles: [
        { network: 'LinkedIn', username: 'johndoe', url: 'https://linkedin.com/in/johndoe' },
        { network: 'GitHub', username: 'johndoe', url: 'https://github.com/johndoe' }
      ]
    },
    isLoading: false,
    save: vi.fn()
  })
}))

describe('PersonalInfo i18n', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Définition des sélecteurs de texte pour les tests multilingues
  const textSelectors: TextSelector[] = [
    {
      selector: 'h2.card-title',
      fr: 'Informations Personnelles',
      en: 'Personal Information'
    },
    {
      selector: '.mock-button',
      fr: 'Éditer',
      en: 'Edit'
    },
    {
      selector: '.field-label:nth-of-type(1)',
      fr: 'Nom:',
      en: 'Name:'
    },
    {
      selector: '.field-label:nth-of-type(2)',
      fr: 'Titre:',
      en: 'Title:'
    },
    {
      selector: '.field-label:nth-of-type(3)',
      fr: 'Email:',
      en: 'Email:'
    },
    {
      selector: '.field-label:nth-of-type(4)',
      fr: 'Téléphone:',
      en: 'Phone:'
    },
    {
      selector: '.field-label:nth-of-type(5)',
      fr: 'Site Web:',
      en: 'Website:'
    },
    {
      selector: '.field-label:nth-of-type(6)',
      fr: 'Localisation:',
      en: 'Location:'
    },
    {
      selector: '.field-label:nth-of-type(7)',
      fr: 'Résumé:',
      en: 'Summary:'
    },
    {
      selector: '.field-label:nth-of-type(8)',
      fr: 'Profils:',
      en: 'Profiles:'
    }
  ]

  // 1. Test du rendu en français et en anglais
  runI18nTests(PersonalInfo, textSelectors)

  // 2. Test du changement dynamique de langue
  testDynamicLocaleChange(PersonalInfo, textSelectors)

  // 3. Test pour vérifier l'absence d'erreurs de console liées à l'i18n
  testNoI18nConsoleErrors(PersonalInfo)

  // Test supplémentaire pour vérifier des comportements spécifiques
  describe('Specific i18n behaviors', () => {
    beforeEach(() => {
      setLocale('fr')
    })

    it('displays profiles with translated network labels', async () => {
      const wrapper = mount(PersonalInfo, createTestingOptions())
      
      // Vérifier que le réseau LinkedIn est affiché
      expect(wrapper.text()).toContain('LinkedIn')
      
      // Changer la langue vers l'anglais
      setLocale('en')
      await wrapper.vm.$nextTick()
      
      // Vérifier que le réseau est toujours affiché (pas de traduction pour LinkedIn)
      expect(wrapper.text()).toContain('LinkedIn')
    })
  })
}) 