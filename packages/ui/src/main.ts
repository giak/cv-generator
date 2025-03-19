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
  console.log('Initializing application...');
  
  try {
    // 1. Précharger les messages par défaut (pour garantir une fallback)
    await preloadDefaultMessages();
    
    // 2. Détecter la langue et charger les messages correspondants
    const detectedLocale = getInitialLocale();
    console.log(`Detected locale: ${detectedLocale}`);
    
    if (detectedLocale !== DEFAULT_LOCALE) {
      try {
        await loadLocaleMessages(detectedLocale);
        console.log(`Successfully loaded messages for ${detectedLocale}`);
      } catch (error) {
        console.error(`Failed to load messages for ${detectedLocale}, using default locale`, error);
        // Pas besoin de charger à nouveau les messages par défaut car ils ont été préchargés
      }
    }
    
    // 3. Monter l'application
    console.log('Mounting application...');
    app.mount('#app');
    console.log('Application mounted successfully');
    
  } catch (error) {
    console.error('Critical error during app initialization:', error);
    
    // En cas d'erreur critique, monter quand même l'application
    // pour permettre à l'utilisateur d'interagir avec l'interface
    console.warn('Mounting application despite initialization errors');
    app.mount('#app');
  }
};

// Lancer l'initialisation de l'application
initializeApp();
