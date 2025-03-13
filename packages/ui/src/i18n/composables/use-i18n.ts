import { ref, computed } from 'vue';
import { VueI18nAdapter } from '../vue-i18n-adapter';
import type { DomainI18nPortInterface } from '@cv-generator/core/src/shared/i18n/domain-i18n.port';
import type { SupportedLocale } from '@cv-generator/shared/src/i18n/constants/supported-locales';
import { loadLocaleMessages } from '../setup';

/**
 * Composable that provides i18n functionality through the domain port interface.
 * This ensures that components only interact with the domain interface,
 * maintaining the separation of concerns.
 */
export function useAppI18n(): {
  i18n: DomainI18nPortInterface;
  currentLocale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => Promise<void>;
} {
  const adapter = new VueI18nAdapter();
  const locale = ref<SupportedLocale>('en');

  const changeLocale = async (newLocale: SupportedLocale): Promise<void> => {
    await loadLocaleMessages(newLocale);
    locale.value = newLocale;
  };

  return {
    i18n: adapter,
    currentLocale: computed(() => locale.value).value,
    changeLocale
  };
} 