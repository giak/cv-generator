import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ErrorNotification from '../ErrorNotification.vue';
import { useErrorStore, type ErrorInfo } from '../../../core/stores/error';

// Mock heroicons
vi.mock('@heroicons/vue/24/solid', () => ({
  ExclamationTriangleIcon: 'div',
  ExclamationCircleIcon: 'div',
  InformationCircleIcon: 'div',
  XMarkIcon: 'div'
}));

describe('ErrorNotification.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>;
  let errorStore: ReturnType<typeof useErrorStore>;
  
  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn
    });
    errorStore = useErrorStore(pinia);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('displays nothing when there are no errors', () => {
    errorStore.errors = [];
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
  
  it('displays active errors', () => {
    const testErrors: ErrorInfo[] = [
      {
        id: 'test-error-1',
        message: 'This is a test error',
        timestamp: Date.now(),
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      }
    ];
    
    errorStore.errors = testErrors;
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    expect(wrapper.find(`#error-test-error-1`).exists()).toBe(true);
    expect(wrapper.html()).toContain('This is a test error');
  });
  
  it('does not display dismissed errors', () => {
    const testErrors: ErrorInfo[] = [
      {
        id: 'active-error',
        message: 'Active error',
        timestamp: Date.now(),
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      },
      {
        id: 'dismissed-error',
        message: 'Dismissed error',
        timestamp: Date.now(),
        severity: 'error',
        source: 'infrastructure',
        dismissed: true
      }
    ];
    
    errorStore.errors = testErrors;
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    expect(wrapper.find(`#error-active-error`).exists()).toBe(true);
    expect(wrapper.find(`#error-dismissed-error`).exists()).toBe(false);
    expect(wrapper.html()).toContain('Active error');
    expect(wrapper.html()).not.toContain('Dismissed error');
  });
  
  it('dismisses an error when clicking the dismiss button', async () => {
    const testError: ErrorInfo = {
      id: 'test-error',
      message: 'This is a test error',
      timestamp: Date.now(),
      severity: 'error',
      source: 'infrastructure',
      dismissed: false
    };
    
    errorStore.errors = [testError];
    errorStore.dismissError = vi.fn();
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    await wrapper.find('button[aria-label="Dismiss This is a test error"]').trigger('click');
    
    expect(errorStore.dismissError).toHaveBeenCalledWith('test-error');
  });
  
  it('emits an action event when action button is clicked', async () => {
    const testError: ErrorInfo = {
      id: 'test-error',
      message: 'This is a test error',
      timestamp: Date.now(),
      severity: 'error',
      source: 'infrastructure',
      dismissed: false,
      action: {
        label: 'Retry',
        handler: 'test/action'
      }
    };
    
    errorStore.errors = [testError];
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    expect(wrapper.find('button.text-primary-600').exists()).toBe(true);
    expect(wrapper.find('button.text-primary-600').text()).toBe('Retry');
    
    await wrapper.find('button.text-primary-600').trigger('click');
    
    expect(wrapper.emitted('action')).toBeTruthy();
    expect(wrapper.emitted('action')![0]).toEqual([testError]);
  });
  
  it('applies appropriate styling based on error severity', () => {
    const testErrors: ErrorInfo[] = [
      {
        id: 'error-severity',
        message: 'Error message',
        timestamp: Date.now(),
        severity: 'error',
        source: 'infrastructure',
        dismissed: false
      }
    ];
    
    errorStore.errors = testErrors;
    
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    const errorElement = wrapper.find('#error-error-severity');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.classes()).toContain('bg-red-50');
    expect(errorElement.classes()).toContain('border-l-4');
    expect(errorElement.classes()).toContain('border-red-400');
  });
}); 