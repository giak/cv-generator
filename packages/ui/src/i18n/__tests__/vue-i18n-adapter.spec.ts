import { describe, it, expect, vi } from 'vitest';
import { VueI18nAdapter } from '../vue-i18n-adapter';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key: string, params?: Record<string, unknown>) => 
      params && Object.keys(params).length > 0 ? `${key} with params` : key
    ),
    te: vi.fn(() => true)
  })
}));

describe('VueI18nAdapter', () => {
  it('should translate a key without parameters', () => {
    const adapter = new VueI18nAdapter();
    const result = adapter.translate('test.key');
    expect(result).toBe('test.key');
  });

  it('should translate a key with parameters', () => {
    const adapter = new VueI18nAdapter();
    const result = adapter.translate('test.key', { param: 'value' });
    expect(result).toBe('test.key with params');
  });

  it('should check if a translation key exists', () => {
    const adapter = new VueI18nAdapter();
    const result = adapter.exists('test.key');
    expect(result).toBe(true);
  });
}); 