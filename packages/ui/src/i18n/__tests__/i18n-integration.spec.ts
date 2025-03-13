import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createI18n } from 'vue-i18n';
import { VueI18nAdapter } from '../vue-i18n-adapter';

// Create a test component that uses the adapter
const TestComponent = defineComponent({
  template: '<div>{{ translated }}</div>',
  setup() {
    const adapter = new VueI18nAdapter();
    const translated = adapter.translate('test.key');
    return { translated };
  }
});

describe('I18n Integration', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  it('should correctly translate text in a component', () => {
    // Create i18n instance with test messages
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          test: {
            key: 'Test Translation'
          }
        }
      }
    });

    // Mount component with i18n plugin
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    });

    // Check if translation is correctly rendered
    expect(wrapper.text()).toContain('Test Translation');
  });

  it('should handle missing translations', () => {
    // Create i18n instance with no messages for the key
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {}
      }
    });

    // Mount component with i18n plugin
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    });

    // Check if key is rendered when translation is missing
    expect(wrapper.text()).toContain('test.key');
  });
}); 