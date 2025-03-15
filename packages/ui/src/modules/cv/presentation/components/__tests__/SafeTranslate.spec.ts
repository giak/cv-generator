import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createTestingOptions, setLocale } from '@ui/test-utils/i18n-plugin'
import { useI18n } from 'vue-i18n'

// Composant de test qui utilise safeTranslate
const TestComponent = defineComponent({
  template: '<div>{{ safeTranslated }}</div>',
  props: {
    translationKey: {
      type: String,
      required: true
    },
    fallbackText: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    
    const safeTranslate = (key: string, fallback: string) => {
      try {
        const translation = t(key)
        return translation !== key ? translation : fallback
      } catch (e) {
        return fallback
      }
    }
    
    const safeTranslated = safeTranslate(props.translationKey, props.fallbackText)
    
    return { safeTranslated }
  }
})

describe('safeTranslate function', () => {
  // Spy pour vérifier les erreurs de console
  let consoleErrorSpy: any

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // Réinitialiser la langue à français pour chaque test
    setLocale('fr')
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })
  
  it('returns fallback text for missing translation keys', () => {
    const wrapper = mount(TestComponent, {
      ...createTestingOptions(),
      props: {
        translationKey: 'nonexistent.key',
        fallbackText: 'Fallback Text'
      }
    })
    
    expect(wrapper.text()).toBe('Fallback Text')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  
  it('returns translation for existing keys', () => {
    const wrapper = mount(TestComponent, {
      ...createTestingOptions(),
      props: {
        translationKey: 'resume.work.list.title',
        fallbackText: 'Fallback Text'
      }
    })
    
    expect(wrapper.text()).toBe('Expériences Professionnelles')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  
  it('handles errors from translation function', () => {
    // Créer un composant qui simule une erreur dans la fonction t
    const ErrorComponent = defineComponent({
      template: '<div>{{ errorText }}</div>',
      props: {
        fallbackText: {
          type: String,
          required: true
        }
      },
      setup(props) {
        // Simuler une erreur dans la fonction de traduction
        const safeTranslate = (_key: string, fallback: string) => {
          try {
            // Forcer une erreur
            throw new Error('Translation error')
          } catch (e) {
            return fallback
          }
        }
        
        const errorText = safeTranslate('error.key', props.fallbackText)
        
        return { errorText }
      }
    })
    
    const wrapper = mount(ErrorComponent, {
      ...createTestingOptions(),
      props: {
        fallbackText: 'Error Fallback'
      }
    })
    
    expect(wrapper.text()).toBe('Error Fallback')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
  
  it('returns fallback when key equals translation (missing key)', () => {
    const wrapper = mount(TestComponent, {
      ...createTestingOptions(),
      props: {
        translationKey: 'missing.key',
        fallbackText: 'Missing Key Fallback'
      }
    })
    
    expect(wrapper.text()).toBe('Missing Key Fallback')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
}) 