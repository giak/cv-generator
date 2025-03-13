import { createApp, type App as VueApp, type ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import AppComponent from './App/App.vue'
import './assets/styles/main.scss'
import ToastPlugin from './plugins/toast'
import { i18nPlugin } from './i18n/plugin'
import { loadLocaleMessages } from './i18n/setup'
import { DEFAULT_LOCALE } from '@cv-generator/shared/i18n/constants/supported-locales'

// Configuration du gestionnaire d'erreurs global
const configureErrorHandling = (app: VueApp<Element>) => {
  if (process.env.NODE_ENV === 'development') {
    // Capturer les erreurs non gérées de Vue
    app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
      console.error('=== Vue Error ===');
      console.error(`Error: ${err instanceof Error ? err.toString() : String(err)}`);
      console.error(`Info: ${info}`);
      console.error('Component:', instance);
      if (err instanceof Error && err.stack) {
        console.error('Stack:', err.stack);
      }
      console.error('================');
    };

    // Capturer les erreurs non gérées de JavaScript
    window.addEventListener('error', (event: ErrorEvent) => {
      console.error('=== JS Error ===');
      console.error(`Error: ${event.error}`);
      console.error(`Message: ${event.message}`);
      console.error(`File: ${event.filename}:${event.lineno}:${event.colno}`);
      console.error('================');
    });

    // Capturer les rejets de promesses non gérés
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      console.error('=== Unhandled Promise Rejection ===');
      console.error('Reason:', event.reason);
      console.error('================');
    });
  }
};

// Créer l'application
const app = createApp(AppComponent)
configureErrorHandling(app)
app.use(createPinia())
app.use(ToastPlugin, {
  position: 'top-right',
  maxToasts: 5
})
app.use(i18nPlugin)

// Attendre que les traductions soient chargées avant de monter l'application
loadLocaleMessages(DEFAULT_LOCALE)
  .then(() => {
    console.log('Locale messages loaded, mounting app')
    app.mount('#app')
  })
  .catch(error => {
    console.error('Failed to load locale messages:', error)
    // Monter l'application même en cas d'erreur pour ne pas bloquer l'utilisateur
    app.mount('#app')
  })
