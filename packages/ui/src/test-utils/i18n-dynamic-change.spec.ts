import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSelector from '../components/navigation/LanguageSelector.vue'
import { LOCALE_STORAGE_KEY } from '../i18n/setup'
import { useI18n } from 'vue-i18n'

// Mock pour localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}

// Mock pour i18n
vi.mock('vue-i18n', async () => {
  const locale = { value: 'fr' }
  
  return {
    useI18n: vi.fn(() => ({
      locale,
      t: vi.fn((key: string) => {
        // Simuler des traductions simples pour les tests
        const frenchMessages: Record<string, string> = {
          'common.language.french': 'Français',
          'common.language.english': 'Anglais'
        }
        
        const englishMessages: Record<string, string> = {
          'common.language.french': 'French',
          'common.language.english': 'English'
        }
        
        return locale.value === 'fr' ? frenchMessages[key] || key : englishMessages[key] || key
      }),
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    })),
    createI18n: vi.fn(() => ({
      global: {
        locale,
        availableLocales: ['fr', 'en'],
        t: vi.fn(),
        setLocaleMessage: vi.fn()
      }
    }))
  }
})

// Mock pour loadLocaleMessages
vi.mock('../i18n/setup', () => ({
  LOCALE_STORAGE_KEY: 'cv-generator-locale',
  loadLocaleMessages: vi.fn().mockResolvedValue(true),
  getInitialLocale: vi.fn().mockReturnValue('fr')
}))

describe('Changement dynamique de langue', () => {
  beforeEach(() => {
    // Reset localStorage mock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    
    // Reset mocks
    localStorageMock.getItem.mockReturnValue('fr')
    localStorageMock.setItem.mockClear()
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('change la langue lorsqu\'on sélectionne une nouvelle langue', async () => {
    // Monter le sélecteur de langue
    const wrapper = mount(LanguageSelector)
    
    // Vérifier l'état initial (français)
    const initialButton = wrapper.find('[data-test="language-current"]')
    expect(initialButton.text()).toContain('Français')
    
    // Ouvrir le menu déroulant
    await wrapper.find('[data-test="language-button"]').trigger('click')
    
    // Sélectionner l'anglais
    const englishOption = wrapper.find('[data-test*="language-item-en"]')
    await englishOption.trigger('click')
    
    // Vérifier que localStorage a été mis à jour
    expect(localStorageMock.setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, 'en')
    
    // Note: Dans un test réel, nous devrions attendre que le changement de langue soit propagé
    // à toute l'application, mais cela nécessiterait des mocks plus complexes ou un test e2e
  })
  
  it('affiche correctement la langue actuelle', async () => {
    // Test avec langue française
    localStorageMock.getItem.mockReturnValue('fr')
    
    // Mock renvoyant Français pour la première instance
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'fr' },
      t: vi.fn((key) => key === 'common.language.french' ? 'Français' : key),
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any)
    
    const frWrapper = mount(LanguageSelector)
    expect(frWrapper.find('[data-test="language-current"]').text()).toContain('Français')
    
    // Test avec langue anglaise
    localStorageMock.getItem.mockReturnValue('en')
    
    // Changer le mock pour renvoyer English pour la seconde instance
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'en' },
      t: vi.fn((key) => key === 'common.language.english' ? 'English' : key),
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any)
    
    const enWrapper = mount(LanguageSelector)
    expect(enWrapper.find('[data-test="language-current"]').text()).toContain('English')
  })
  
  it('persiste la préférence linguistique', async () => {
    // Mock de localStorage uniquement pour setItem
    const setItemMock = vi.fn();
    
    // Garder l'implémentation originale de getItem
    const originalGetItem = localStorageMock.getItem;
    
    // Remplacer seulement setItem
    localStorageMock.setItem = setItemMock;
    
    // Appliquer le mock à window.localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Mock pour useI18n
    vi.mocked(useI18n).mockReturnValue({
      locale: { value: 'fr' },
      t: vi.fn((key) => key),
      availableLocales: ['fr', 'en'],
      setLocaleMessage: vi.fn()
    } as any);
    
    // Monter le composant
    const wrapper = mount(LanguageSelector);
    
    // Appeler directement la méthode de changement de langue
    const vm = wrapper.vm as any;
    vm.changeLocale('en');
    await wrapper.vm.$nextTick();
    
    // Vérifier que setItem a été appelé avec la nouvelle langue
    expect(setItemMock).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, 'en');
    
    // Restaurer l'implémentation originale
    localStorageMock.getItem = originalGetItem;
  })
})

// Tests d'intégration plus poussés nécessiteraient un environnement de test plus complet
// comme Cypress ou Playwright pour tester l'interaction réelle avec l'application 