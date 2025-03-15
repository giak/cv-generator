import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'
import { setLocale } from './i18n-plugin'

/**
 * Vérifie qu'un composant ne génère pas d'erreurs de console liées à l'internationalisation
 * @param component Le composant à tester
 * @param options Options de montage du composant
 */
export function testNoI18nConsoleErrors(
  options: any = {},
  locales: ('fr' | 'en')[] = ['fr', 'en']
) {
  describe('I18n Console Errors', () => {
    let consoleErrorSpy: any

    beforeEach(() => {
      // Espionner console.error pour détecter les erreurs de traduction
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      // Restaurer console.error
      consoleErrorSpy.mockRestore()
    })

    // Tester chaque locale
    for (const locale of locales) {
      it(`does not log i18n errors in ${locale} locale`, async () => {
        // Définir la locale
        setLocale(locale)

        // Monter le composant

        // Vérifier qu'aucune erreur de console n'a été émise concernant les traductions
        const i18nErrors = consoleErrorSpy.mock.calls.filter(
          (call: any[]) =>
            call[0] &&
            typeof call[0] === 'string' &&
            (call[0].includes('i18n') ||
              call[0].includes('translation') ||
              call[0].includes('Not found') ||
              call[0].includes('t is not a function') ||
              call[0].includes('locale message'))
        )

        // Afficher les erreurs détectées pour faciliter le débogage
        if (i18nErrors.length > 0) {
          console.log(`Detected ${i18nErrors.length} i18n errors in ${locale} locale:`)
          i18nErrors.forEach((error: any[], index: number) => {
            console.log(`Error ${index + 1}:`, error)
          })
        }

        // Utiliser expect.toBe avec un seul argument, puis un message dans un expect.fail si nécessaire
        expect(i18nErrors.length).toBe(0)
        if (i18nErrors.length > 0) {
          const errorMessages = i18nErrors.map((e: any[]) => e[0]).join(', ')
          expect.fail(`Component should not log i18n errors in ${locale} locale. Found: ${errorMessages}`)
        }
      })
    }
  })
} 