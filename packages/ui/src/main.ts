import { createApp, type App as VueApp, type ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import AppComponent from './App/App.vue'
import './assets/styles/main.scss'
import ToastPlugin from './plugins/toast'
import { i18nPlugin } from './i18n/plugin'
import { loadLocaleMessages, getInitialLocale, preloadDefaultMessages } from './i18n/setup'
import { DEFAULT_LOCALE } from '@cv-generator/shared'

// Configuration du gestionnaire d'erreurs global
const configureErrorHandling = (app: VueApp<Element>) => {
  if (process.env.NODE_ENV === 'development') {
    // Capturer les erreurs non gérées de Vue
    app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {

      if (err instanceof Error && err.stack) {}

    };

    // Capturer les erreurs non gérées de JavaScript
    window.addEventListener('error', (event: ErrorEvent) => {});

    // Capturer les rejets de promesses non gérés
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {});
  }
};

// Création de l'application
const app = createApp(AppComponent)
configureErrorHandling(app)
app.use(createPinia())
app.use(ToastPlugin, {
  position: 'top-right',
  maxToasts: 5
})
app.use(i18nPlugin)

// Fonction pour initialiser et monter l'application de manière sécurisée
const initializeApp = async () => {

  try {
    // 1. Précharger les messages par défaut (pour garantir une fallback)
    await preloadDefaultMessages();
    
    // 2. Détecter la langue et charger les messages correspondants
    const detectedLocale = getInitialLocale();

    if (detectedLocale !== DEFAULT_LOCALE) {
      try {
        await loadLocaleMessages(detectedLocale);

      } catch (error) {

        // Pas besoin de charger à nouveau les messages par défaut car ils ont été préchargés
      }
    }
    
    // 3. Monter l'application

    app.mount('#app');

  } catch (error) {

    // En cas d'erreur critique, monter quand même l'application
    // pour permettre à l'utilisateur d'interagir avec l'interface

    app.mount('#app');
  }
};

// Lancer l'initialisation de l'application
initializeApp();
