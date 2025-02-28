import { App, createApp, h } from 'vue';
import ToastContainer from '../components/notification/ToastContainer.vue';
import { ToastItem } from '../components/notification/ToastContainer.vue';

export type ToastOptions = Omit<ToastItem, 'id'>;

export interface ToastPluginOptions {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  defaultDuration?: number;
}

export interface ToastInstance {
  show(options: ToastOptions): string;
  success(message: string, options?: Partial<ToastOptions>): string;
  error(message: string, options?: Partial<ToastOptions>): string;
  warning(message: string, options?: Partial<ToastOptions>): string;
  info(message: string, options?: Partial<ToastOptions>): string;
  remove(id: string): void;
  clearAll(): void;
}

export default {
  install: (app: App, options: ToastPluginOptions = {}) => {
    // Créer une div pour le container de toasts
    const containerDiv = document.createElement('div');
    containerDiv.id = 'toast-container';
    document.body.appendChild(containerDiv);
    
    // Créer l'instance du conteneur de toasts
    const toastApp = createApp({
      name: 'ToastPlugin',
      render() {
        return h(ToastContainer, {
          position: options.position || 'top-right',
          maxToasts: options.maxToasts || 5,
          onDismiss: (id: string) => {
            // Event handler si nécessaire
          },
          onAction: (payload: { id: string, action: any }) => {
            // Event handler si nécessaire
          }
        });
      }
    });
    
    const toastContainer = toastApp.mount(containerDiv) as any;
    
    const defaultDuration = options.defaultDuration || 3000;
    
    const toast: ToastInstance = {
      show(options: ToastOptions): string {
        const toastOptions = {
          ...options,
          duration: options.duration || defaultDuration,
          dismissible: options.dismissible !== undefined ? options.dismissible : true
        };
        return toastContainer.addToast(toastOptions);
      },
      
      success(message: string, options: Partial<ToastOptions> = {}): string {
        return toastContainer.addToast({
          type: 'success',
          message,
          duration: options.duration || defaultDuration,
          dismissible: options.dismissible !== undefined ? options.dismissible : true,
          ...options
        });
      },
      
      error(message: string, options: Partial<ToastOptions> = {}): string {
        return toastContainer.addToast({
          type: 'error',
          message,
          duration: options.duration || defaultDuration,
          dismissible: options.dismissible !== undefined ? options.dismissible : true,
          ...options
        });
      },
      
      warning(message: string, options: Partial<ToastOptions> = {}): string {
        return toastContainer.addToast({
          type: 'warning',
          message,
          duration: options.duration || defaultDuration,
          dismissible: options.dismissible !== undefined ? options.dismissible : true,
          ...options
        });
      },
      
      info(message: string, options: Partial<ToastOptions> = {}): string {
        return toastContainer.addToast({
          type: 'info',
          message,
          duration: options.duration || defaultDuration,
          dismissible: options.dismissible !== undefined ? options.dismissible : true,
          ...options
        });
      },
      
      remove(id: string): void {
        toastContainer.removeToast(id);
      },
      
      clearAll(): void {
        toastContainer.clearAll();
      }
    };
    
    // Ajouter l'API toast à l'application globale
    app.config.globalProperties.$toast = toast;
    
    // Fournir l'API toast via l'injection
    app.provide('toast', toast);
  }
};

// Hook composable pour utiliser l'API de toast dans les composants
export function useToast(): ToastInstance {
  // Dans un composable setup(), on utiliserait inject('toast')
  // Mais pour simplifier, on accède à l'instance globale pour l'instant
  return (window as any)?.__VUE_APP__?.config?.globalProperties?.$toast as ToastInstance;
} 