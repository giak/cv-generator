import { ref, reactive } from 'vue';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { BasicsValidationService } from '@cv-generator/core';
import { 
  isFailure, 
  isSuccess, 
  ValidationErrorInterface,
  ResultType,
  FormValidationResultType,
  createSuccess,
  createFailure,
  createSuccessWithWarnings
} from '@cv-generator/shared';

export interface FormValidationState {
  /** État des erreurs par champ */
  errors: Record<string, string>;
  /** Liste des champs avec warnings */
  warnings: Record<string, string>;
  /** Champs qui ont été modifiés (dirty) */
  dirtyFields: Set<string>;
  /** Résultat complet de la dernière validation */
  lastResult: FormValidationResultType<BasicsInterface> | null;
}

/**
 * Composable pour la validation du formulaire des informations de base
 * Orchestration de la validation en utilisant le service de validation du domaine
 */
export function useBasicsFormValidation() {
  // Initialisation du service de validation
  const validationService = new BasicsValidationService();
  
  // État réactif de la validation
  const state = reactive<FormValidationState>({
    errors: {},
    warnings: {},
    dirtyFields: new Set<string>(),
    lastResult: null
  });
  
  // Getters utiles
  const hasErrors = () => Object.keys(state.errors).length > 0;
  const hasWarnings = () => Object.keys(state.warnings).length > 0;
  
  /**
   * Marque un champ comme modifié (dirty)
   */
  const markFieldAsDirty = (field: keyof BasicsInterface): void => {
    state.dirtyFields.add(field as string);
  };
  
  /**
   * Réinitialise l'état de validation
   */
  const resetValidation = (): void => {
    state.errors = {};
    state.warnings = {};
    state.dirtyFields.clear();
    state.lastResult = null;
  };
  
  /**
   * Traite le résultat de validation et met à jour l'état
   */
  const processValidationResult = <T>(
    result: ResultType<T>,
    field?: keyof BasicsInterface
  ): boolean => {
    // Si succès sans warnings, efface les erreurs associées au champ
    if (isSuccess(result) && (!result.warnings || result.warnings.length === 0)) {
      if (field) {
        delete state.errors[field as string];
        delete state.warnings[field as string];
      }
      return true;
    }
    
    // Si succès avec warnings, traiter les warnings
    if (isSuccess(result) && result.warnings && result.warnings.length > 0) {
      if (field) {
        // Stocke uniquement les warnings pour ce champ
        const fieldWarnings = result.warnings.filter(w => w.field === field);
        if (fieldWarnings.length > 0) {
          state.warnings[field as string] = fieldWarnings[0].message;
        }
        delete state.errors[field as string];
      }
      return true;
    }
    
    // Si échec, traiter les erreurs
    if (isFailure(result)) {
      if (field) {
        // Pour un champ spécifique, stocke uniquement les erreurs de ce champ
        const fieldErrors = result.error.filter(
          err => err.field === field && err.severity === 'error'
        );
        
        if (fieldErrors.length > 0) {
          state.errors[field as string] = fieldErrors[0].message;
        }
        
        // Traite également les warnings pour ce champ
        const fieldWarnings = result.error.filter(
          err => err.field === field && err.severity === 'warning'
        );
        
        if (fieldWarnings.length > 0) {
          state.warnings[field as string] = fieldWarnings[0].message;
        }
      } else {
        // Pour une validation complète, groupe les erreurs par champ
        result.error.forEach(err => {
          if (err.field) {
            if (err.severity === 'error') {
              state.errors[err.field] = err.message;
            } else if (err.severity === 'warning') {
              state.warnings[err.field] = err.message;
            }
          }
        });
      }
      
      return Object.keys(state.errors).length === 0;
    }
    
    return true;
  };
  
  /**
   * Valide le champ nom
   */
  const validateName = (data: BasicsInterface): boolean => {
    markFieldAsDirty('name');
    
    // Vérification spécifique pour le champ obligatoire
    if (!data.name || data.name.trim() === '') {
      state.errors.name = 'Le nom est requis';
      return false;
    }
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, 'name');
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, 'name');
  };
  
  /**
   * Valide le champ email
   */
  const validateEmail = (data: BasicsInterface): boolean => {
    markFieldAsDirty('email');
    
    // Vérification spécifique pour le champ obligatoire
    if (!data.email || data.email.trim() === '') {
      state.errors.email = 'L\'email est requis';
      return false;
    }
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, 'email');
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, 'email');
  };
  
  /**
   * Valide le champ téléphone
   */
  const validatePhone = (data: BasicsInterface): boolean => {
    markFieldAsDirty('phone');
    
    // Le téléphone n'est pas obligatoire
    if (!data.phone || data.phone.trim() === '') {
      delete state.errors.phone;
      delete state.warnings.phone;
      return true;
    }
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, 'phone');
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, 'phone');
  };
  
  /**
   * Valide le champ URL
   */
  const validateUrl = (data: BasicsInterface): boolean => {
    markFieldAsDirty('url');
    
    // L'URL n'est pas obligatoire
    if (!data.url || data.url.trim() === '') {
      delete state.errors.url;
      delete state.warnings.url;
      return true;
    }
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, 'url');
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, 'url');
  };
  
  /**
   * Valide le champ image URL
   */
  const validateImageUrl = (data: BasicsInterface): boolean => {
    markFieldAsDirty('image');
    
    // L'image n'est pas obligatoire
    if (!data.image || data.image.trim() === '') {
      delete state.errors.image;
      delete state.warnings.image;
      return true;
    }
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, 'image');
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, 'image');
  };
  
  /**
   * Valide un champ spécifique
   */
  const validateField = (data: BasicsInterface, field: keyof BasicsInterface): boolean => {
    // Déléguer aux fonctions spécifiques pour les champs principaux
    if (field === 'name') return validateName(data);
    if (field === 'email') return validateEmail(data);
    if (field === 'phone') return validatePhone(data);
    if (field === 'url') return validateUrl(data);
    if (field === 'image') return validateImageUrl(data);
    
    // Pour les autres champs
    markFieldAsDirty(field);
    
    // Utiliser le service de validation
    const result = validationService.validateField(data, field);
    // Conversion de type sécurisée
    state.lastResult = result as unknown as FormValidationResultType<BasicsInterface>;
    
    return processValidationResult(result, field);
  };
  
  /**
   * Valide l'ensemble du formulaire
   */
  const validateForm = (data: BasicsInterface): boolean => {
    resetValidation();
    
    // Marquer tous les champs comme modifiés
    Object.keys(data).forEach(key => markFieldAsDirty(key as keyof BasicsInterface));
    
    // Utiliser le service de validation
    const result = validationService.validate(data);
    state.lastResult = result;
    
    return processValidationResult(result);
  };
  
  return {
    // État
    state,
    
    // Fonctions de validation spécifiques
    validateName,
    validateEmail,
    validatePhone,
    validateUrl,
    validateImageUrl,
    
    // Fonctions génériques
    validateField,
    validateForm,
    
    // Helpers
    hasErrors,
    hasWarnings,
    markFieldAsDirty,
    resetValidation
  };
} 