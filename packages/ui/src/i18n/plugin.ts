import type { App } from 'vue';
import { setupI18n, loadLocaleMessages } from './setup';
import { DEFAULT_LOCALE } from '@cv-generator/shared/src/i18n/constants/supported-locales';

/**
 * Vue plugin to register i18n functionality with the application.
 * This plugin initializes Vue I18n and loads the default locale messages.
 */
export const i18nPlugin = {
  install: async (app: App): Promise<void> => {
    const i18n = setupI18n();
    app.use(i18n);
    
    // Load default locale messages
    await loadLocaleMessages(DEFAULT_LOCALE);
  }
}; 