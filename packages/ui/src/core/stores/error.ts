import { defineStore } from 'pinia';
import { inject } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ref, computed } from 'vue';

export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Interface pour le service de mapping d'erreurs
 */
export interface ErrorMappingService {
  mapError(error: unknown): ErrorInfo;
}

/**
 * Interface pour une information d'erreur
 */
export interface ErrorInfo {
  id: string;
  message: string;
  timestamp: number;
  severity: ErrorSeverity;
  source: 'infrastructure' | 'application' | 'domain' | 'ui';
  field?: string;
  action?: ErrorAction;
  dismissed: boolean;
}

/**
 * Interface pour une action associée à une erreur
 */
export interface ErrorAction {
  label: string;
  handler: string;
  params?: Record<string, any>;
}

/**
 * Store pour la gestion centralisée des erreurs dans l'application
 */
export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [] as ErrorInfo[]
  }),
  
  getters: {
    /**
     * Indique si le store contient des erreurs non ignorées
     */
    hasErrors: (state) => state.errors.some((error: ErrorInfo) => !error.dismissed),
    
    /**
     * Renvoie la dernière erreur ajoutée ou null si aucune erreur
     */
    lastError: (state) => state.errors.length > 0 ? state.errors[state.errors.length - 1] : null,
    
    /**
     * Récupère une erreur par son id
     * @param id L'identifiant de l'erreur
     */
    getErrorById: (state) => (id: string) => state.errors.find((error: ErrorInfo) => error.id === id),
    
    /**
     * Récupère la première erreur active associée à un champ
     * @param fieldPath Le chemin d'accès du champ (ex: 'basics.email')
     */
    getFieldError: (state) => (fieldPath: string) => 
      state.errors.find((error: ErrorInfo) => error.field === fieldPath && !error.dismissed),
    
    /**
     * Vérifie si un champ a une erreur active
     * @param fieldPath Le chemin d'accès du champ
     */
    hasFieldError: (state) => (fieldPath: string) => 
      state.errors.some((error: ErrorInfo) => error.field === fieldPath && !error.dismissed)
  },
  
  actions: {
    /**
     * Ajoute une nouvelle erreur au store
     * @param error L'erreur à ajouter
     */
    addError(error: ErrorInfo) {
      // Garantit que l'erreur a un id
      const errorWithId = {
        ...error,
        id: error.id || uuidv4(),
        timestamp: error.timestamp || Date.now()
      };
      
      this.errors.push(errorWithId);
      console.error(`[ErrorStore] Error added: ${errorWithId.message}`, errorWithId);
      
      return errorWithId.id;
    },
    
    /**
     * Marque une erreur comme ignorée
     * @param id L'identifiant de l'erreur à ignorer
     */
    dismissError(id: string) {
      const error = this.errors.find((e: ErrorInfo) => e.id === id);
      if (error) {
        error.dismissed = true;
      }
    },
    
    /**
     * Supprime toutes les erreurs du store
     */
    clearErrors() {
      this.errors = [];
    },
    
    /**
     * Exécute une opération avec gestion centralisée des erreurs
     * @param operation La fonction à exécuter
     * @param options Options supplémentaires
     * @returns Le résultat de l'opération si elle réussit
     */
    async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      options: {
        showToast?: boolean;
        rethrow?: boolean;
      } = {}
    ): Promise<T | undefined> {
      try {
        return await operation();
      } catch (error: unknown) {
        // Récupère le service de mapping d'erreurs
        const errorMappingService = inject<ErrorMappingService>('errorMappingService');
        
        if (errorMappingService) {
          // Transforme l'erreur technique en erreur lisible par l'utilisateur
          const errorInfo = errorMappingService.mapError(error);
          
          // Ajoute l'erreur au store
          this.addError(errorInfo);
          
          // TODO: Afficher un toast si nécessaire
          if (options.showToast) {
            // Implémenter l'affichage du toast
          }
        } else {
          console.error('[ErrorStore] ErrorMappingService not available', error);
          
          // Fallback basique si le service n'est pas disponible
          this.addError({
            id: uuidv4(),
            message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
            timestamp: Date.now(),
            severity: 'error',
            source: 'application',
            dismissed: false
          });
        }
        
        // Propage l'erreur si nécessaire
        if (options.rethrow) {
          throw error;
        }
        
        return undefined;
      }
    }
  }
}); 