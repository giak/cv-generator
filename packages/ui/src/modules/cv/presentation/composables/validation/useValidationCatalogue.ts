/**
 * useValidationCatalogue.ts
 * 
 * Composable Vue pour gérer un catalogue de messages de validation.
 * Ce composable permet de récupérer des messages d'erreur et d'aide basés sur des codes.
 */

import { ref, computed, watch, type Ref } from 'vue';
import type {
  ValidationErrorInterface,
  HelpMessageInterface
} from '@cv-generator/shared';

// Using type imports to avoid runtime dependencies

// Import de l'enum ValidationLayerType pour l'utiliser

interface TranslationOptionsInterface {
  t: (key: string, params?: Record<string, any>) => string;
  locale: Ref<string>;
}

interface ValidationCatalogueOptionsInterface {
  enableCache?: boolean;
  locale?: string;
  lazyLoad?: (code: string) => Promise<ValidationErrorInterface | HelpMessageInterface | null>;
  enableLogging?: boolean;
  i18n?: TranslationOptionsInterface;
}

interface ValidationCatalogueReturnInterface {
  addErrorMessage: (message: ValidationErrorInterface) => void;
  addErrorMessages: (messages: ValidationErrorInterface[]) => void;
  addHelpMessage: (message: HelpMessageInterface) => void;
  addHelpMessages: (messages: HelpMessageInterface[]) => void;
  getErrorMessage: (code: string) => ValidationErrorInterface | undefined;
  getHelpMessage: (id: string) => HelpMessageInterface | undefined;
  getErrorsForField: (field: string) => ValidationErrorInterface[];
  getHelpForField: (field: string) => HelpMessageInterface[];
  autoShowHelp: Ref<HelpMessageInterface[]>;
  setErrorCatalogue: (messages: ValidationErrorInterface[]) => void;
  setHelpCatalogue: (messages: HelpMessageInterface[]) => void;
  resetCatalogue: () => void;
}

const translateMessage = (
  message: ValidationErrorInterface | HelpMessageInterface,
  i18n?: TranslationOptionsInterface
): string => {
  if (!i18n) {
    return 'message' in message ? message.message : message.content;
  }

  if ('message' in message) {
    // ValidationErrorInterface
    if (message.i18nKey) {
      try {
        const translated = i18n.t(message.i18nKey, message.i18nParams);
        return translated || message.message;
      } catch {
        return message.message;
      }
    }
    return message.message;
  } else {
    // HelpMessageInterface
    return message.content;
  }
};

export function useValidationCatalogue(
  options: ValidationCatalogueOptionsInterface = {}
): ValidationCatalogueReturnInterface {
  const { 
    enableCache = true, 
    lazyLoad,
    i18n
  } = options;

  const errorMessages = ref<ValidationErrorInterface[]>([]);
  const helpMessages = ref<HelpMessageInterface[]>([]);

  const errorCache = new Map<string, ValidationErrorInterface>();
  const helpCache = new Map<string, HelpMessageInterface>();
  const fieldErrorCache = new Map<string, ValidationErrorInterface[]>();
  const fieldHelpCache = new Map<string, HelpMessageInterface[]>();

  const autoShowHelp = computed(() => {
    return helpMessages.value.filter(msg => msg.autoShow);
  });

  const clearCaches = (): void => {
    errorCache.clear();
    helpCache.clear();
    fieldErrorCache.clear();
    fieldHelpCache.clear();
  };

  const addErrorMessage = (message: ValidationErrorInterface): void => {
    const translatedMessage = {
      ...message,
      message: translateMessage(message, i18n)
    };
    errorMessages.value.push(translatedMessage);
    if (enableCache) {
      errorCache.set(message.code, translatedMessage);
      fieldErrorCache.clear();
    }
  };

  const addErrorMessages = (messages: ValidationErrorInterface[]): void => {
    const translatedMessages = messages.map(msg => ({
      ...msg,
      message: translateMessage(msg, i18n)
    }));
    errorMessages.value.push(...translatedMessages);
    if (enableCache) {
      translatedMessages.forEach(msg => errorCache.set(msg.code, msg));
      fieldErrorCache.clear();
    }
  };

  const addHelpMessage = (message: HelpMessageInterface): void => {
    const translatedMessage = {
      ...message,
      content: translateMessage(message, i18n)
    };
    helpMessages.value.push(translatedMessage);
    if (enableCache) {
      helpCache.set(message.id, translatedMessage);
      fieldHelpCache.clear();
    }
  };

  const addHelpMessages = (messages: HelpMessageInterface[]): void => {
    const translatedMessages = messages.map(msg => ({
      ...msg,
      content: translateMessage(msg, i18n)
    }));
    helpMessages.value.push(...translatedMessages);
    if (enableCache) {
      translatedMessages.forEach(msg => helpCache.set(msg.id, msg));
      fieldHelpCache.clear();
    }
  };

  const getErrorMessage = (code: string): ValidationErrorInterface | undefined => {
    if (enableCache && errorCache.has(code)) {
      return errorCache.get(code);
    }
    
    const message = errorMessages.value.find(msg => msg.code === code);
    
    if (message && enableCache) {
      errorCache.set(code, message);
    }
    
    if (!message && lazyLoad) {
      lazyLoad(code).then(msg => {
        if (msg && 'code' in msg) {
          addErrorMessage(msg as ValidationErrorInterface);
        }
      });
    }
    
    return message;
  };

  const getHelpMessage = (id: string): HelpMessageInterface | undefined => {
    if (enableCache && helpCache.has(id)) {
      return helpCache.get(id);
    }
    
    const message = helpMessages.value.find(msg => msg.id === id);
    
    if (message && enableCache) {
      helpCache.set(id, message);
    }
    
    if (!message && lazyLoad) {
      lazyLoad(id).then(msg => {
        if (msg && 'id' in msg) {
          addHelpMessage(msg as HelpMessageInterface);
        }
      });
    }
    
    return message;
  };

  const getErrorsForField = (field: string): ValidationErrorInterface[] => {
    if (enableCache && fieldErrorCache.has(field)) {
      return fieldErrorCache.get(field) || [];
    }
    
    const messages = errorMessages.value.filter(msg => msg.field === field);
    
    if (enableCache) {
      fieldErrorCache.set(field, messages);
    }
    
    return messages;
  };

  const getHelpForField = (field: string): HelpMessageInterface[] => {
    if (enableCache && fieldHelpCache.has(field)) {
      return fieldHelpCache.get(field) || [];
    }
    
    const messages = helpMessages.value.filter(msg => msg.field === field);
    
    if (enableCache) {
      fieldHelpCache.set(field, messages);
    }
    
    return messages;
  };

  const setErrorCatalogue = (messages: ValidationErrorInterface[]): void => {
    const translatedMessages = messages.map(msg => ({
      ...msg,
      message: translateMessage(msg, i18n)
    }));
    errorMessages.value = translatedMessages;
    clearCaches();
  };

  const setHelpCatalogue = (messages: HelpMessageInterface[]): void => {
    const translatedMessages = messages.map(msg => ({
      ...msg,
      content: translateMessage(msg, i18n)
    }));
    helpMessages.value = translatedMessages;
    clearCaches();
  };

  const resetCatalogue = (): void => {
    errorMessages.value = [];
    helpMessages.value = [];
    clearCaches();
  };

  if (i18n) {
    watch(i18n.locale, () => {
      const currentErrors = [...errorMessages.value];
      const currentHelp = [...helpMessages.value];
      setErrorCatalogue(currentErrors);
      setHelpCatalogue(currentHelp);
    });
  }

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
    resetCatalogue
  };
} 