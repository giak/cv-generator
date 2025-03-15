import { ComponentMountingOptions, mount, VueWrapper } from '@vue/test-utils';
import { Component } from 'vue';
import { setLocale, createTestingOptions } from './i18n-plugin';
import { afterEach, expect, describe, it } from 'vitest';

/**
 * Utilitaire pour tester les composants dans différentes langues
 * @param component Le composant à tester
 * @param options Options de montage du composant
 * @param textSelectors Un objet contenant des sélecteurs et leurs traductions attendues dans chaque langue
 * @param mountFn Une fonction optionnelle personnalisée pour monter le composant
 */
export function testComponentInMultipleLanguages(
  component: Component,
  options: ComponentMountingOptions<any> = {},
  textSelectors: {
    [selector: string]: {
      fr: string;
      en: string;
    };
  },
  mountFn?: (locale: 'fr' | 'en') => VueWrapper<any>
) {
  // Reset la locale au français après chaque test
  afterEach(() => {
    setLocale('fr')
  })

  describe('Multilingual support', () => {
    it('displays content in French by default', async () => {
      const wrapper = mountFn ? mountFn('fr') : mount(component, {
        ...createTestingOptions(),
        ...options,
      })

      // Vérifier chaque sélecteur avec sa traduction française attendue
      for (const [selector, translations] of Object.entries(textSelectors)) {
        const element = wrapper.find(selector)
        expect(element.exists()).toBe(true)
        expect(element.text()).toContain(translations.fr)
      }
    })

    it('displays content in English when language is changed', async () => {
      // Changer la locale en anglais
      setLocale('en')

      // Monter le composant avec la locale anglaise
      const wrapper = mountFn ? mountFn('en') : mount(component, {
        ...createTestingOptions(),
        ...options,
      })

      // Vérifier chaque sélecteur avec sa traduction anglaise attendue
      for (const [selector, translations] of Object.entries(textSelectors)) {
        const element = wrapper.find(selector)
        expect(element.exists()).toBe(true)
        expect(element.text()).toContain(translations.en)
      }
    })
  })
}

/**
 * Vérifie si un composant utilise correctement safeTranslate pour les textes manquants
 * @param component Le composant à tester
 * @param options Options de montage du composant
 * @param textSelectors Un objet contenant des sélecteurs et les fallbacks attendus
 * @param missingKey Clé de traduction manquante à tester
 */
export function testFallbackTranslations(
  component: Component,
  options: ComponentMountingOptions<any> = {},
  textSelectors: {
    [selector: string]: string; // Sélecteur -> texte de fallback attendu
  },
  missingKey: string
) {
  it('uses fallback text for missing translation keys', async () => {
    // Monter le composant
    const wrapper = mount(component, {
      ...createTestingOptions(),
      ...options,
      props: {
        ...(options.props || {}),
        translationKey: missingKey, // Clé de traduction manquante
      }
    })

    // Vérifier que chaque sélecteur contient son texte de fallback
    for (const [selector, fallbackText] of Object.entries(textSelectors)) {
      const element = wrapper.find(selector)
      expect(element.exists()).toBe(true)
      expect(element.text()).toContain(fallbackText)
    }
  })
} 