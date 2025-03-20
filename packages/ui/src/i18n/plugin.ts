import type { App } from 'vue';
import { setupI18n, loadLocaleMessages } from './setup';
import { DEFAULT_LOCALE } from '@cv-generator/shared/i18n/constants/supported-locales';

/**
 * Vue plugin to register i18n functionality with the application.
 * This plugin initializes Vue I18n and loads the default locale messages.
 */
export const i18nPlugin = {
  install: (app: App): void => {
    const i18n = setupI18n();
    app.use(i18n);
    
    // Charger les messages - nous ne pouvons pas attendre ici car app.use ne peut pas être async
    loadLocaleMessages(DEFAULT_LOCALE).catch(e => {});
  }
};
