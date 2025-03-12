/**
 * useValidationCatalogue.ts
 * 
 * Composable Vue pour gérer un catalogue de messages de validation.
 * Ce composable permet de récupérer des messages d'erreur et d'aide basés sur des codes.
 */

import { ref, computed, Ref } from 'vue';

// Using type imports to avoid runtime dependencies
import type {
  ValidationErrorInterface,
  HelpMessageInterface
} from '@cv-generator/shared';

// Import de l'enum ValidationLayerType pour l'utiliser
import { ValidationLayerType as LayerType } from '@cv-generator/shared';

export interface ValidationRule {
  /**
   * Fonction de validation qui retourne true si valide
   */
  validator: (value: any) => boolean;
  
  /**
   * Message d'erreur si la validation échoue
   */
  message: string;
  
  /**
   * Niveau de sévérité (error, warning, info)
   */
  severity: 'error' | 'warning' | 'info';
  
  /**
   * Code d'erreur unique
   */
  code: string;
  
  /**
   * Champ concerné (optionnel, sera remplacé par le champ validé)
   */
  field?: string;
}

export interface ValidationCatalogueOptionsInterface {
  /**
   * Si le cache des messages doit être activé
   */
  enableCache?: boolean;
  
  /**
   * Locale à utiliser (pour internationalisation)
   */
  locale?: string;
  
  /**
   * Fonction pour charger des messages à la demande
   */
  lazyLoad?: (code: string) => Promise<ValidationErrorInterface | HelpMessageInterface | null>;
  
  /**
   * Activation du mode debug (logs supplémentaires)
   */
  enableLogging?: boolean;
  
  /**
   * Règles de validation par champ
   */
  rules?: Record<string, ValidationRule[]>;
}

export interface ValidationCatalogueReturnInterface {
  /**
   * Ajouter un message d'erreur au catalogue
   */
  addErrorMessage: (message: ValidationErrorInterface) => void;
  
  /**
   * Ajouter plusieurs messages d'erreur au catalogue
   */
  addErrorMessages: (messages: ValidationErrorInterface[]) => void;
  
  /**
   * Ajouter un message d'aide au catalogue
   */
  addHelpMessage: (message: HelpMessageInterface) => void;
  
  /**
   * Ajouter plusieurs messages d'aide au catalogue
   */
  addHelpMessages: (messages: HelpMessageInterface[]) => void;
  
  /**
   * Récupérer un message d'erreur par son code
   */
  getErrorMessage: (code: string) => ValidationErrorInterface | undefined;
  
  /**
   * Récupérer un message d'aide par son id
   */
  getHelpMessage: (id: string) => HelpMessageInterface | undefined;
  
  /**
   * Récupérer tous les messages d'erreur pour un champ donné
   */
  getErrorsForField: (field: string) => ValidationErrorInterface[];
  
  /**
   * Récupérer tous les messages d'aide pour un champ donné
   */
  getHelpForField: (field: string) => HelpMessageInterface[];
  
  /**
   * Récupérer les messages d'erreur à afficher automatiquement
   */
  autoShowHelp: Ref<HelpMessageInterface[]>;
  
  /**
   * Remplacer tout le catalogue d'erreurs
   */
  setErrorCatalogue: (messages: ValidationErrorInterface[]) => void;
  
  /**
   * Remplacer tout le catalogue d'aide
   */
  setHelpCatalogue: (messages: HelpMessageInterface[]) => void;
  
  /**
   * Réinitialiser le catalogue
   */
  resetCatalogue: () => void;
  
  /**
   * Valider un champ selon les règles définies
   * @param field Nom du champ à valider
   * @param value Valeur à valider
   * @param errors Tableau d'erreurs à remplir (optionnel)
   * @returns true si le champ est valide, false sinon
   */
  validateField: (field: string, value: any, errors?: ValidationErrorInterface[]) => boolean;
}

/**
 * Composable pour gérer un catalogue de messages de validation
 * 
 * @param options Options de configuration
 * @param initialErrors Messages d'erreur initiaux
 * @param initialHelp Messages d'aide initiaux 
 * @returns Interface pour interagir avec le catalogue
 */
export function useValidationCatalogue(
  options: ValidationCatalogueOptionsInterface = {},
  initialErrors: ValidationErrorInterface[] = [],
  initialHelp: HelpMessageInterface[] = []
): ValidationCatalogueReturnInterface {
  const { 
    enableCache = true, 
    locale = 'fr', 
    lazyLoad,
    enableLogging = false,
    rules = {}
  } = options;
  
  // État interne
  const errorMessages = ref<ValidationErrorInterface[]>([...initialErrors]);
  const helpMessages = ref<HelpMessageInterface[]>([...initialHelp]);
  
  // Cache pour les résultats de recherche (si activé)
  const errorCache = new Map<string, ValidationErrorInterface>();
  const helpCache = new Map<string, HelpMessageInterface>();
  const fieldErrorCache = new Map<string, ValidationErrorInterface[]>();
  const fieldHelpCache = new Map<string, HelpMessageInterface[]>();
  
  // Messages d'aide à afficher automatiquement
  const autoShowHelp = computed(() => {
    return helpMessages.value.filter((msg: any) => msg.autoShow);
  });
  
  /**
   * Vide tous les caches
   */
  const clearCaches = (): void => {
    errorCache.clear();
    helpCache.clear();
    fieldErrorCache.clear();
    fieldHelpCache.clear();
  };
  
  /**
   * Ajoute un message d'erreur
   */
  const addErrorMessage = (message: ValidationErrorInterface): void => {
    errorMessages.value.push(message);
    if (enableCache) {
      errorCache.set(message.code, message);
      fieldErrorCache.clear(); // Invalidate field cache
    }
  };
  
  /**
   * Ajoute plusieurs messages d'erreur
   */
  const addErrorMessages = (messages: ValidationErrorInterface[]): void => {
    errorMessages.value.push(...messages);
    if (enableCache) {
      messages.forEach(msg => errorCache.set(msg.code, msg));
      fieldErrorCache.clear(); // Invalidate field cache
    }
  };
  
  /**
   * Ajoute un message d'aide
   */
  const addHelpMessage = (message: HelpMessageInterface): void => {
    helpMessages.value.push(message);
    if (enableCache) {
      helpCache.set(message.id, message);
      fieldHelpCache.clear(); // Invalidate field cache
    }
  };
  
  /**
   * Ajoute plusieurs messages d'aide
   */
  const addHelpMessages = (messages: HelpMessageInterface[]): void => {
    helpMessages.value.push(...messages);
    if (enableCache) {
      messages.forEach(msg => helpCache.set(msg.id, msg));
      fieldHelpCache.clear(); // Invalidate field cache
    }
  };
  
  /**
   * Récupère un message d'erreur par son code
   */
  const getErrorMessage = (code: string): ValidationErrorInterface | undefined => {
    // Vérifier le cache d'abord
    if (enableCache && errorCache.has(code)) {
      return errorCache.get(code);
    }
    
    // Rechercher dans les messages
    const message = errorMessages.value.find((msg: any) => msg.code === code);
    
    // Mettre en cache si trouvé
    if (message && enableCache) {
      errorCache.set(code, message);
    }
    
    // Utiliser lazyLoad si disponible et message non trouvé
    if (!message && lazyLoad) {
      lazyLoad(code).then(msg => {
        if (msg && 'code' in msg) {
          addErrorMessage(msg as ValidationErrorInterface);
        }
      });
    }
    
    return message;
  };
  
  /**
   * Récupère un message d'aide par son id
   */
  const getHelpMessage = (id: string): HelpMessageInterface | undefined => {
    // Vérifier le cache d'abord
    if (enableCache && helpCache.has(id)) {
      return helpCache.get(id);
    }
    
    // Rechercher dans les messages
    const message = helpMessages.value.find((msg: any) => msg.id === id);
    
    // Mettre en cache si trouvé
    if (message && enableCache) {
      helpCache.set(id, message);
    }
    
    // Utiliser lazyLoad si disponible et message non trouvé
    if (!message && lazyLoad) {
      lazyLoad(id).then(msg => {
        if (msg && 'id' in msg) {
          addHelpMessage(msg as HelpMessageInterface);
        }
      });
    }
    
    return message;
  };
  
  /**
   * Récupère tous les messages d'erreur pour un champ donné
   */
  const getErrorsForField = (field: string): ValidationErrorInterface[] => {
    // Vérifier le cache d'abord
    if (enableCache && fieldErrorCache.has(field)) {
      return fieldErrorCache.get(field) || [];
    }
    
    // Filtrer les messages par champ
    const messages = errorMessages.value.filter((msg: any) => msg.field === field);
    
    // Mettre en cache si activé
    if (enableCache) {
      fieldErrorCache.set(field, messages);
    }
    
    return messages;
  };
  
  /**
   * Récupère tous les messages d'aide pour un champ donné
   */
  const getHelpForField = (field: string): HelpMessageInterface[] => {
    // Vérifier le cache d'abord
    if (enableCache && fieldHelpCache.has(field)) {
      return fieldHelpCache.get(field) || [];
    }
    
    // Filtrer les messages par champ
    const messages = helpMessages.value.filter((msg: any) => msg.field === field);
    
    // Mettre en cache si activé
    if (enableCache) {
      fieldHelpCache.set(field, messages);
    }
    
    return messages;
  };
  
  /**
   * Remplace tout le catalogue d'erreurs
   */
  const setErrorCatalogue = (messages: ValidationErrorInterface[]): void => {
    errorMessages.value = [...messages];
    clearCaches();
  };
  
  /**
   * Remplace tout le catalogue d'aide
   */
  const setHelpCatalogue = (messages: HelpMessageInterface[]): void => {
    helpMessages.value = [...messages];
    clearCaches();
  };
  
  /**
   * Réinitialise le catalogue
   */
  const resetCatalogue = (): void => {
    errorMessages.value = [];
    helpMessages.value = [];
    clearCaches();
  };
  
  /**
   * Valide un champ selon les règles définies
   */
  const validateField = (field: string, value: any, errors: ValidationErrorInterface[] = []): boolean => {
    if (enableLogging) {
      console.log(`[useValidationCatalogue] Validating field ${field} with value:`, value);
    }
    
    // Si pas de règles pour ce champ, on considère qu'il est valide
    if (!rules[field] || !Array.isArray(rules[field])) {
      return true;
    }
    
    // Parcourir toutes les règles pour ce champ
    let isValid = true;
    for (const rule of rules[field]) {
      // Appliquer la règle de validation
      const ruleIsValid = rule.validator(value);
      
      // Si la règle échoue, ajouter l'erreur
      if (!ruleIsValid) {
        const error: ValidationErrorInterface = {
          code: rule.code,
          message: rule.message,
          field: field,
          severity: rule.severity,
          layer: LayerType.PRESENTATION // Utilisation de l'enum importé
        };
        
        // Ajouter l'erreur au tableau d'erreurs passé en paramètre
        errors.push(error);
        
        // Si c'est une erreur (et non un warning/info), marquer comme invalide
        if (rule.severity === 'error') {
          isValid = false;
        }
        
        if (enableLogging) {
          console.log(`[useValidationCatalogue] Validation failed for ${field}:`, error);
        }
      }
    }
    
    return isValid;
  };
  
  return {
    addErrorMessage,
    addErrorMessages,
    addHelpMessage,
    addHelpMessages,
    getErrorMessage,
    getHelpMessage,
    getErrorsForField,
    getHelpForField,
    autoShowHelp,
    setErrorCatalogue,
    setHelpCatalogue,
    resetCatalogue,
    validateField
  };
} 