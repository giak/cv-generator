import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BasicsForm from '../BasicsForm.vue'
import { testNoI18nConsoleErrors } from '../../../../../test-utils/i18n-console-errors'
import { useI18n } from 'vue-i18n'

// Mock pour vue-i18n
vi.mock('vue-i18n', () => {
  // Mock initial de useI18n
  const useI18nMock = vi.fn(() => ({
    locale: { value: 'fr' },
    t: (key: string) => key,
    availableLocales: ['fr', 'en'],
    setLocaleMessage: vi.fn()
  }));
  
  // Mock pour createI18n
  const createI18nMock = vi.fn(() => ({
    global: {
      locale: { value: 'fr' },
      t: vi.fn((key: string) => key),
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    },
    install: vi.fn()
  }));
  
  return {
    useI18n: useI18nMock,
    createI18n: createI18nMock
  }
})

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
    template: '<button class="mock-button">{{ $slots.default ? $slots.default() : "Save" }}</button>',
    props: ['variant']
  }
}))

// Mock du store personal
const mockPersonalData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+33600000000',
  url: 'https://johndoe.com',
  location: {
    address: '123 Rue de Paris',
    postalCode: '75001',
    city: 'Paris',
    region: 'Île-de-France',
    countryCode: 'FR'
  },
  summary: 'Un développeur passionné',
  profiles: []
};

vi.mock('../../../shared/stores/usePersonalStore', () => ({
  usePersonalStore: () => ({
    personal: mockPersonalData,
    isLoading: false,
    save: vi.fn()
  })
}))

describe('BasicsForm i18n', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Réinitialiser la locale
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'fr' },
      t: (key: string) => key,
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any)
  })

  it('contient les traductions attendues en français', async () => {
    // Configurer le mock pour le français
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'fr' },
      t: (key: string) => {
        const translations: Record<string, string> = {
          'resume.sections.basics': 'Informations de base',
          'resume.basics.labels.name': 'Nom',
          'resume.basics.labels.email': 'Email',
          'common.actions.save': 'Enregistrer'
        }
        return translations[key] || key
      },
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any)
    
    const wrapper = mount(BasicsForm, {
      props: {
        modelValue: mockPersonalData,
        'onUpdate:modelValue': () => {}
      },
      global: {
        stubs: {
          'FormField': true, // Stub le composant FormField
          'Button': true,    // Stub le composant Button
        }
      }
    })
    
    // Vérifier la présence de textes traduits
    expect(wrapper.html()).toContain('Informations de base')
  })

  it('contient les traductions attendues en anglais', async () => {
    // Configurer le mock pour l'anglais
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'en' },
      t: (key: string) => {
        const translations: Record<string, string> = {
          'resume.sections.basics': 'Basic Information',
          'resume.basics.labels.name': 'Name',
          'resume.basics.labels.email': 'Email',
          'common.actions.save': 'Save'
        }
        return translations[key] || key
      },
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any)
    
    const wrapper = mount(BasicsForm, {
      props: {
        modelValue: mockPersonalData,
        'onUpdate:modelValue': () => {}
      },
      global: {
        stubs: {
          'FormField': true, // Stub le composant FormField
          'Button': true,    // Stub le composant Button
        }
      }
    })
    
    // Vérifier la présence de textes traduits
    expect(wrapper.html()).toContain('Basic Information')
  })

  // Test pour vérifier l'absence d'erreurs de console liées à l'i18n
  testNoI18nConsoleErrors(
    {
      props: {
        modelValue: mockPersonalData,
        'onUpdate:modelValue': () => {}
      },
      global: {
        stubs: {
          'FormField': true,
          'Button': true
        }
      }
    },
    ['fr', 'en']
  );
}); 