import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ErrorNotification from '../ErrorNotification.vue';
import { useErrorStore, type ErrorInfo, type ErrorAction } from '../../../core/stores/error';

// Mock heroicons
vi.mock('@heroicons/vue/24/solid', () => ({
  ExclamationTriangleIcon: 'div',
  ExclamationCircleIcon: 'div',
  InformationCircleIcon: 'div',
  XMarkIcon: 'div'
}));

describe('Error Recovery Flows', () => {
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
  
  it('should emit action events for errors with recovery actions', async () => {
    // Créer une erreur avec une action de récupération
    const recoveryAction: ErrorAction = {
      label: 'Retry Saving',
      handler: 'resume/retryLastOperation',
      params: { operation: 'save' }
    };
    
    const errorWithAction: ErrorInfo = {
      id: 'error-with-action',
      message: 'Failed to save your resume',
      timestamp: Date.now(),
      severity: 'error',
      source: 'infrastructure',
      dismissed: false,
      action: recoveryAction
    };
    
    // Ajouter l'erreur au store
    errorStore.errors = [errorWithAction];
    
    // Monter le composant
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    // Vérifier que le bouton d'action est affiché
    const actionButton = wrapper.find('button.text-primary-600');
    expect(actionButton.exists()).toBe(true);
    expect(actionButton.text()).toBe('Retry Saving');
    
    // Cliquer sur le bouton d'action
    await actionButton.trigger('click');
    
    // Vérifier que l'événement action est émis avec les bonnes données
    expect(wrapper.emitted('action')).toBeTruthy();
    expect(wrapper.emitted('action')![0]).toEqual([errorWithAction]);
  });
  
  it('should handle multiple recovery actions', async () => {
    // Créer plusieurs erreurs avec différentes actions
    const errors: ErrorInfo[] = [
      {
        id: 'error-1',
        message: 'Failed to save your resume',
        timestamp: Date.now(),
        severity: 'error',
        source: 'infrastructure',
        dismissed: false,
        action: {
          label: 'Retry',
          handler: 'resume/retryLastOperation',
          params: { operation: 'save' }
        }
      },
      {
        id: 'error-2',
        message: 'Network error occurred',
        timestamp: Date.now(),
        severity: 'warning',
        source: 'infrastructure',
        dismissed: false,
        action: {
          label: 'Go Offline',
          handler: 'app/enableOfflineMode'
        }
      }
    ];
    
    // Ajouter les erreurs au store
    errorStore.errors = errors;
    
    // Monter le composant
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    // Vérifier que les deux boutons d'action sont affichés
    const actionButtons = wrapper.findAll('button.text-primary-600');
    expect(actionButtons.length).toBe(2);
    expect(actionButtons[0].text()).toBe('Retry');
    expect(actionButtons[1].text()).toBe('Go Offline');
    
    // Cliquer sur le premier bouton d'action
    await actionButtons[0].trigger('click');
    
    // Vérifier que le bon événement est émis
    expect(wrapper.emitted('action')).toBeTruthy();
    expect(wrapper.emitted('action')![0]).toEqual([errors[0]]);
    
    // Cliquer sur le deuxième bouton d'action
    await actionButtons[1].trigger('click');
    
    // Vérifier que le bon événement est émis
    expect(wrapper.emitted('action')![1]).toEqual([errors[1]]);
  });
  
  it('should track error dismissal', async () => {
    // Créer une erreur
    const error: ErrorInfo = {
      id: 'test-error',
      message: 'Test error message',
      timestamp: Date.now(),
      severity: 'error',
      source: 'infrastructure',
      dismissed: false
    };
    
    // Ajouter l'erreur au store
    errorStore.errors = [error];
    errorStore.dismissError = vi.fn();
    
    // Monter le composant
    const wrapper = mount(ErrorNotification, {
      global: {
        plugins: [pinia]
      }
    });
    
    // Trouver et cliquer sur le bouton de fermeture
    const dismissButton = wrapper.find('button[aria-label="Dismiss Test error message"]');
    expect(dismissButton.exists()).toBe(true);
    
    await dismissButton.trigger('click');
    
    // Vérifier que dismissError a été appelé avec l'ID correct
    expect(errorStore.dismissError).toHaveBeenCalledWith('test-error');
  });
}); 