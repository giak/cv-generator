import { mount, VueWrapper } from '@vue/test-utils'
import { Component } from 'vue'
import { describe, it, expect } from 'vitest'
import { createTestingOptions, setLocale } from './i18n-plugin'

export interface TextSelector {
  selector: string
  fr: string
  en: string
}

/**
 * Configure et exécute des tests d'internationalisation pour un composant
 * @param component Le composant à tester
 * @param textSelectors Les sélecteurs et textes attendus pour chaque langue
 * @param mountOptions Options supplémentaires pour le montage du composant
 */
export function runI18nTests(
  component: Component,
  textSelectors: TextSelector[],
  mountOptions: Record<string, any> = {}
) {
  describe('I18n rendering', () => {
    // Tester le composant en français
    it('renders correctly in French', async () => {
      setLocale('fr')
      const wrapper = mount(component, {
        ...createTestingOptions(),
        ...mountOptions
      })
      
      await verifyTextContent(wrapper, textSelectors, 'fr')
    })

    // Tester le composant en anglais
    it('renders correctly in English', async () => {
      setLocale('en')
      const wrapper = mount(component, {
        ...createTestingOptions(),
        ...mountOptions
      })
      
      await verifyTextContent(wrapper, textSelectors, 'en')
    })
  })
}

/**
 * Vérifie que le contenu textuel correspond aux traductions attendues
 */
async function verifyTextContent(
  wrapper: VueWrapper<any>,
  textSelectors: TextSelector[],
  locale: 'fr' | 'en'
) {
  // Attendre le prochain tick pour s'assurer que les traductions sont appliquées
  await wrapper.vm.$nextTick()
  
  // Vérifier chaque sélecteur
  for (const { selector, fr, en } of textSelectors) {
    const expected = locale === 'fr' ? fr : en
    
    try {
      const element = wrapper.find(selector)
      
      // Si nous nous attendons à un texte vide, vérifions que l'élément n'existe pas
      if (expected === '') {
        if (element.exists()) {
          expect(element.text().trim()).toBe('')
        }
        continue
      }
      
      // Sinon, vérifions que l'élément existe et a le texte attendu
      expect(element.exists()).toBeTruthy()
      
      const actualText = element.text().trim()
      expect(actualText).toContain(expected)
    } catch (error) {
      console.error(`Error checking selector "${selector}" in ${locale} locale:`, error)
      throw error
    }
  }
}

/**
 * Teste qu'un composant fonctionne correctement avec le changement dynamique de langue
 */
export function testDynamicLocaleChange(
  component: Component,
  textSelectors: TextSelector[],
  mountOptions: Record<string, any> = {}
) {
  describe('Dynamic locale change', () => {
    it('updates text when locale changes', async () => {
      // Commencer avec le français
      setLocale('fr')
      const wrapper = mount(component, {
        ...createTestingOptions(),
        ...mountOptions
      })
      
      // Vérifier le contenu en français
      await verifyTextContent(wrapper, textSelectors, 'fr')
      
      // Changer la locale vers l'anglais
      setLocale('en')
      await wrapper.vm.$nextTick()
      
      // Vérifier que le contenu est maintenant en anglais
      await verifyTextContent(wrapper, textSelectors, 'en')
    })
  })
} 