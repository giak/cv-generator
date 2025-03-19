import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import LanguageSelector from '../LanguageSelector.vue';
import { SUPPORTED_LOCALES, LOCALE_NAMES } from '@cv-generator/shared';

// Mock des modules nécessaires
vi.mock('vue-i18n', async () => {
  const currentLocale = { value: 'fr' };
  
  return {
    useI18n: vi.fn(() => ({
      locale: currentLocale,
      t: vi.fn((key: string) => key)
    })),
    // Ajouter createI18n qui est utilisé dans setup.ts
    createI18n: vi.fn(() => ({
      global: {
        locale: currentLocale,
        setLocaleMessage: vi.fn(),
        t: vi.fn((key: string) => key)
      }
    }))
  };
});

// Mock du module d'import dynamique pour loadLocaleMessages
vi.mock('../../i18n/locales/fr.json', () => ({ default: {} }));
vi.mock('../../i18n/locales/en.json', () => ({ default: {} }));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: vi.fn(() => { store = {}; })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mocks pour les imports dynamiques de fichiers i18n
vi.mock('../../i18n/setup', async () => {
  return {
    LOCALE_STORAGE_KEY: 'cv-generator-locale',
    getInitialLocale: vi.fn(() => 'fr'),
    loadLocaleMessages: vi.fn(async () => Promise.resolve()),
    setupI18n: vi.fn(() => ({
      global: {
        locale: { value: 'fr' },
        setLocaleMessage: vi.fn()
      }
    }))
  };
});

// Réinitialiser les mocks entre les tests
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

describe('LanguageSelector', () => {
  // Tests de rendu
  describe('rendering', () => {
    it('should render the component with current language', () => {
      // Arrange & Act
      const wrapper = mount(LanguageSelector);
      
      // Assert
      expect(wrapper.find('[data-test="language-current"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="language-current"]').text()).toContain(LOCALE_NAMES.fr);
    });
    
    it('should not display the dropdown by default', () => {
      // Arrange & Act
      const wrapper = mount(LanguageSelector);
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(false);
    });
    
    it('should display all supported languages in the dropdown when opened', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector);
      
      // Act
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(true);
      
      // Vérifier que toutes les langues supportées sont affichées
      const languageItems = wrapper.findAll('[data-test^="language-item"]');
      expect(languageItems.length).toBe(SUPPORTED_LOCALES.length);
      
      // Vérifier les noms des langues
      SUPPORTED_LOCALES.forEach(locale => {
        const item = wrapper.find(`[data-test*="language-item-${locale}"]`);
        expect(item.exists()).toBe(true);
        expect(item.text()).toContain(LOCALE_NAMES[locale]);
      });
    });
    
    it('should highlight the current language in the dropdown', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector, {
        global: {
          stubs: {
            transition: false
          }
        }
      });
      
      // Act
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert - Vérifier que l'élément "fr" a l'attribut aria-selected="true"
      const currentItem = wrapper.find('[data-test*="language-item-fr"]');
      expect(currentItem.exists()).toBe(true);
      expect(currentItem.attributes('aria-selected')).toBe('true');
      
      // Une alternative à la vérification des classes qui pourrait être problématique
      // avec les classes dynamiques est de simplement vérifier l'attribut aria-selected
    });
  });
  
  // Tests d'interaction
  describe('interactions', () => {
    it('should toggle dropdown when button is clicked', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector);
      
      // Act - Ouvrir le dropdown
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(true);
      
      // Act - Fermer le dropdown
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(false);
    });
    
    it('should change language when a language option is clicked', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector, {
        global: {
          stubs: {
            transition: false
          }
        }
      });
      const setItemMock = vi.spyOn(Storage.prototype, 'setItem');
      
      // Act - Ouvrir le dropdown
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Vérifier que le dropdown est ouvert et que l'élément en existe
      const enItem = wrapper.find('[data-test*="language-item-en"]');
      expect(enItem.exists()).toBe(true);
      
      // Act - Sélectionner une langue différente (anglais)
      await enItem.trigger('click');
      
      // Assert
      // Vérifier que le localStorage a été mis à jour
      expect(setItemMock).toHaveBeenCalledWith('cv-generator-locale', 'en');
      
      // Vérifier que le dropdown est fermé après la sélection
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(false);
    });
    
    it('should be accessible with keyboard navigation', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector);
      
      // Act - Ouvrir le dropdown avec Entrée
      const button = wrapper.find('[data-test="language-button"]');
      await button.trigger('keydown.enter');
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(true);
      
      // Vérifier que les éléments du dropdown sont focusables
      const dropdownItem = wrapper.find('[data-test^="language-item"]');
      expect(dropdownItem.exists()).toBe(true);
      expect(dropdownItem.attributes('tabindex')).toBe('0');
    });
    
    it('should close dropdown when clicking outside', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector);
      
      // Act - Ouvrir le dropdown
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(true);
      
      // Act - Simuler un clic à l'extérieur
      const clickOutsideEvent = new Event('click');
      document.dispatchEvent(clickOutsideEvent);
      await nextTick();
      
      // Assert
      expect(wrapper.find('[data-test="language-dropdown"]').exists()).toBe(false);
    });
  });
  
  // Tests d'accessibilité
  describe('accessibility', () => {
    it('should have proper ARIA attributes for the button', () => {
      // Arrange & Act
      const wrapper = mount(LanguageSelector);
      const button = wrapper.find('[data-test="language-button"]');
      
      // Assert
      expect(button.attributes('aria-haspopup')).toBe('listbox');
      expect(button.attributes('aria-expanded')).toBe('false');
    });
    
    it('should update ARIA attributes when dropdown is opened', async () => {
      // Arrange
      const wrapper = mount(LanguageSelector);
      
      // Act
      await wrapper.find('[data-test="language-button"]').trigger('click');
      
      // Assert
      const button = wrapper.find('[data-test="language-button"]');
      expect(button.attributes('aria-expanded')).toBe('true');
      
      const dropdown = wrapper.find('[data-test="language-dropdown"]');
      expect(dropdown.attributes('role')).toBe('listbox');
    });
  });
}); 