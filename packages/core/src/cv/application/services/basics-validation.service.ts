/**
 * Service de validation pour les informations de base du CV
 * Utilise le domaine pour la validation
 */

import {
  ResultType,
  createFailure,
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { Basics } from '../../domain/entities/Basics';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';

/**
 * Service de validation pour les données de base d'un CV
 * Délègue la validation à l'entité de domaine Basics
 */
export class BasicsValidationService extends BaseValidationService<BasicsInterface> {
  /**
   * Valide l'ensemble des données de base
   * @param basics Données de base à valider
   * @returns ResultType avec les données validées ou les erreurs
   */
  validate(basics: BasicsInterface): ResultType<BasicsInterface> {
    // Délègue la validation à l'entité de domaine
    const result = Basics.create(basics);
    
    // Si la validation a réussi, on retourne les données validées
    if (result.success) {
      return result;
    }
    
    // Sinon, on retourne les erreurs
    return createFailure(result.error);
  }

  /**
   * Valide un champ spécifique des données de base
   * @param basics Données de base complètes
   * @param fieldName Nom du champ à valider
   * @returns ResultType avec la valeur validée ou les erreurs
   */
  validateField<K extends keyof BasicsInterface>(
    basics: BasicsInterface, 
    fieldName: K
  ): ResultType<BasicsInterface[K]> {
    // Délègue la validation à l'entité de domaine
    const result = Basics.validateField(basics, fieldName);
    
    // On doit ajouter un cast pour gérer la conversion de type
    return result as ResultType<BasicsInterface[K]>;
  }
  
  /**
   * Vérifie si une URL est valide
   * Cette méthode est conservée pour compatibilité avec le code existant
   * mais délègue à l'entité de domaine
   * @param url URL à vérifier
   * @returns true si l'URL est valide
   * @deprecated Utilisez Basics.validateField à la place
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
} 