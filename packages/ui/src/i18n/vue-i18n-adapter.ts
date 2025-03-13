import { DomainI18nPortInterface } from '@cv-generator/core/src/shared/i18n/domain-i18n.port';
import { useI18n } from 'vue-i18n';

/**
 * Adapter implementing the domain i18n port interface using Vue I18n.
 * This adapter isolates the Vue I18n implementation from the domain.
 */
export class VueI18nAdapter implements DomainI18nPortInterface {
  private readonly i18n;

  constructor() {
    this.i18n = useI18n();
  }

  translate(key: string, params?: Record<string, unknown>): string {
    return this.i18n.t(key, params || {});
  }

  exists(key: string): boolean {
    return this.i18n.te(key);
  }
} 