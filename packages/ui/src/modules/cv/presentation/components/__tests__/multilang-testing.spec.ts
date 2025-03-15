import { describe, vi, beforeEach, afterAll } from 'vitest'
import { testComponentInMultipleLanguages } from '@ui/test-utils/language-testing'

// Importer les composants à tester
import SkillList from '../SkillList.vue'
import EducationList from '../EducationList.vue'
import LanguageList from '../LanguageList.vue'
import InterestList from '../InterestList.vue'
import PublicationList from '../PublicationList.vue'

// Mock pour CollectionManager (utilisé par tous les composants)
vi.mock('@ui/components/shared/CollectionManager.vue', () => ({
  default: {
    name: 'CollectionManager',
    template: `
      <div class="mock-collection-manager">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <button class="mock-add-button">{{ addButtonText }}</button>
        <slot></slot>
        <div v-if="!items || items.length === 0" class="mock-empty-state">
          <div>{{ emptyStateTitle }}</div>
          <div>{{ emptyStateDescription }}</div>
        </div>
      </div>
    `,
    props: [
      'title', 
      'description', 
      'addButtonText', 
      'emptyStateTitle', 
      'emptyStateDescription',
      'items',
      'loading'
    ]
  }
}))

// Mock pour les composants partagés
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

// Mock pour les stores
vi.mock('@ui/modules/cv/presentation/stores/skill', () => ({
  useSkillStore: vi.fn(() => ({
    skills: [],
    loading: false,
    loadSkills: vi.fn(),
    addSkill: vi.fn(),
    updateSkill: vi.fn(),
    deleteSkill: vi.fn(),
    reorderSkills: vi.fn()
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/education', () => ({
  useEducationStore: vi.fn(() => ({
    educations: [],
    loading: false,
    loadEducations: vi.fn(),
    addEducation: vi.fn(),
    updateEducation: vi.fn(),
    deleteEducation: vi.fn(),
    reorderEducations: vi.fn()
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/language', () => ({
  useLanguageStore: vi.fn(() => ({
    languages: [],
    loading: false,
    loadLanguages: vi.fn(),
    addLanguage: vi.fn(),
    updateLanguage: vi.fn(),
    deleteLanguage: vi.fn(),
    reorderLanguages: vi.fn()
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/interest', () => ({
  useInterestStore: vi.fn(() => ({
    interests: [],
    loading: false,
    loadInterests: vi.fn(),
    addInterest: vi.fn(),
    updateInterest: vi.fn(),
    deleteInterest: vi.fn(),
    reorderInterests: vi.fn()
  }))
}))

vi.mock('@ui/modules/cv/presentation/stores/publication', () => ({
  usePublicationStore: vi.fn(() => ({
    publications: [],
    loading: false,
    loadPublications: vi.fn(),
    addPublication: vi.fn(),
    updatePublication: vi.fn(),
    deletePublication: vi.fn(),
    reorderPublications: vi.fn()
  }))
}))

// Configuration des tests
describe('Multilingual Components Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  // SkillList
  describe('SkillList', () => {
    const skillTexts = {
      'h2': {
        fr: 'Compétences',
        en: 'Skills'
      },
      '.mock-add-button': {
        fr: 'Ajouter une compétence',
        en: 'Add a skill'
      }
    }

    testComponentInMultipleLanguages(
      SkillList,
      {},
      skillTexts
    )
  })

  // EducationList
  describe('EducationList', () => {
    const educationTexts = {
      'h2': {
        fr: 'Formation',
        en: 'Education'
      },
      '.mock-add-button': {
        fr: 'Ajouter une formation',
        en: 'Add education'
      }
    }

    testComponentInMultipleLanguages(
      EducationList,
      {},
      educationTexts
    )
  })

  // LanguageList
  describe('LanguageList', () => {
    const languageTexts = {
      'h2': {
        fr: 'Langues',
        en: 'Languages'
      },
      '.mock-add-button': {
        fr: 'Ajouter une langue',
        en: 'Add a language'
      }
    }

    testComponentInMultipleLanguages(
      LanguageList,
      {},
      languageTexts
    )
  })

  // InterestList
  describe('InterestList', () => {
    const interestTexts = {
      'h2': {
        fr: 'Centres d\'intérêt',
        en: 'Interests'
      },
      '.mock-add-button': {
        fr: 'Ajouter un centre d\'intérêt',
        en: 'Add an interest'
      }
    }

    testComponentInMultipleLanguages(
      InterestList,
      {},
      interestTexts
    )
  })

  // PublicationList
  describe('PublicationList', () => {
    const publicationTexts = {
      'h2': {
        fr: 'Publications',
        en: 'Publications'
      },
      '.mock-add-button': {
        fr: 'Ajouter une publication',
        en: 'Add a publication'
      }
    }

    testComponentInMultipleLanguages(
      PublicationList,
      {},
      publicationTexts
    )
  })
}) 